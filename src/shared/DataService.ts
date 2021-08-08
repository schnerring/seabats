import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { Aircraft } from "./Aircraft";
import { Flight } from "./Flight";
import axios from "axios";

export const db = new PouchDB("flights");
PouchDB.plugin(find);

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

export async function getAircrafts(): Promise<Aircraft[]> {
  const response = await axios.get<Aircraft[]>("aircrafts.json");
  for (const aircraft of response.data) {
    aircraft.icao = aircraft.icao.toLowerCase();
    aircraft.isSelected = true;
  }
  return response.data;
}
