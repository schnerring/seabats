import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { Aircraft } from "./Aircraft";
import { Flight } from "./Flight";
import { IFlightInfo, IFlightInfoMeta } from "./FlightInfo";
import axios from "axios";
import marked from "marked";
import fm from "front-matter";

const db = new PouchDB("flights");
PouchDB.plugin(find);

export async function addFlight(flight: Flight): Promise<void> {
  try {
    await db.put(flight);
  } catch (error) {
    if (error.name === "conflict") {
      console.info(`Skip duplicate flight: ${flight._id}, ${flight.date}`);
    } else {
      throw error;
    }
  }
}

export async function getFlights(from: Date, to: Date): Promise<Flight[]> {
  await db.createIndex({
    index: {
      fields: ["date"],
    },
  });
  const findResponse = await db.find({
    selector: {
      date: { $gte: from, $lte: to },
    },
  });
  return findResponse.docs.map(
    (doc) => doc as PouchDB.Core.ExistingDocument<Flight>
  );
}

export async function getFlightInfos(
  from: Date,
  to: Date
): Promise<IFlightInfo[]> {
  const sampleFiles = ["md/10-lorem-ipsum.md", "md/20-hello-world.md"];
  const flightInfos: IFlightInfo[] = [];
  for (const sampleFile of sampleFiles) {
    const response = await axios.get<string>(sampleFile);
    const frontMatter = fm<IFlightInfoMeta>(response.data);
    const html = marked(frontMatter.body);
    const meta = frontMatter.attributes;
    flightInfos.push({ meta, html } as IFlightInfo);
  }
  return flightInfos;
}

export async function getAircrafts(): Promise<Aircraft[]> {
  const response = await axios.get<Aircraft[]>("aircrafts.json");
  for (const aircraft of response.data) {
    aircraft.icao = aircraft.icao.toLowerCase();
    aircraft.isSelected = true;
  }
  return response.data;
}
