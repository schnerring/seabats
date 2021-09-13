import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { Flight, Zone } from "@/models";
import axios from "axios";
import marked from "marked";
import { Feature, FeatureCollection, LineString, Polygon } from "geojson";

const db = new PouchDB("geoJSON");
PouchDB.plugin(find);

export async function addGeoJSON(
  featureCollection: FeatureCollection
): Promise<void> {
  await db.bulkDocs(featureCollection.features);
  await db.createIndex({
    index: {
      fields: ["id", "properties.from", "properties.to", "properties.type"],
    },
  });
}

export async function getZones(): Promise<Feature<Polygon, Zone>[]> {
  const found = await db.find({
    selector: {
      $or: [
        {
          "properties.type": "sar",
        },
        {
          "properties.type": "12nm",
        },
        {
          "properties.type": "24nm",
        },
      ],
    },
  });
  return found.docs.map((doc) => {
    return doc as PouchDB.Core.ExistingDocument<Feature<Polygon, Zone>>;
  });
}

export async function getFlights(
  from: Date,
  to: Date
): Promise<Feature<LineString, Flight>[]> {
  const found = await db.find({
    selector: {
      "properties.type": "flight",
      "properties.from": { $gte: from, $lte: to },
      // TODO properties.to
    },
  });
  return found.docs.map((doc) => {
    return doc as PouchDB.Core.ExistingDocument<Feature<LineString, Flight>>;
  });
}

export async function getFlightsByIds(
  ids: string[]
): Promise<Feature<LineString, Flight>[]> {
  const found = await db.find({
    selector: {
      id: { $in: ids },
    },
  });
  return found.docs.map(
    (doc) => doc as PouchDB.Core.ExistingDocument<Feature<LineString, Flight>>
  );
}

export async function dataExists(): Promise<boolean> {
  return (await db.info()).doc_count > 0;
}

export async function getInfoText(): Promise<string> {
  const response = await axios.get<string>("info-text.md");
  return marked(response.data);
}
