import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { Aircraft } from "./Aircraft";
import { Flight } from "./Flight";
import axios from "axios";
import marked from "marked";
import { FeatureCollection } from "geojson";

const db = new PouchDB("geoJSON");
PouchDB.plugin(find);

export async function addGeoJSON(
  featureCollection: FeatureCollection
): Promise<void> {
  await db.bulkDocs(featureCollection.features);
  await db.createIndex({
    index: {
      fields: ["properties.date", "properties.type"],
    },
  });
}

export async function getSARZones(): Promise<void> {
  const findResponse = await db.find({
    selector: {
      "properties.type": "sar",
    },
  });
}

export async function getFlights(from: Date, to: Date): Promise<Flight[]> {
  const findResponse = await db.find({
    selector: {
      "properties.type": "flight",
      "properties.date": { $gte: from, $lte: to },
    },
  });
  console.log(findResponse);
  return findResponse.docs.map(
    (doc) => doc as PouchDB.Core.ExistingDocument<Flight>
  );
}

export async function getFlightsByIds(ids: string[]): Promise<Flight[]> {
  const findResponse = await db.find({
    selector: {
      _id: { $in: ids },
    },
  });
  return findResponse.docs.map(
    (doc) => doc as PouchDB.Core.ExistingDocument<Flight>
  );
}

export async function getInfoText(): Promise<string> {
  const response = await axios.get<string>("info-text.md");
  return marked(response.data);
}

export async function getAircrafts(): Promise<Aircraft[]> {
  const response = await axios.get<Aircraft[]>("aircrafts.json");
  for (const aircraft of response.data) {
    aircraft.icao = aircraft.icao.toLowerCase();
    aircraft.isSelected = true;
  }
  return response.data;
}

export async function dataExists(): Promise<boolean> {
  return (await db.info()).doc_count > 0;
}
