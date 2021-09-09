import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { Aircraft } from "./Aircraft";
import { Flight } from "./Flight";
import { IFlightInfo } from "./FlightInfo";
import axios from "axios";

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
  // TODO implement real data store
  return [
    { flightId: "", markdown: "# Hello World" } as IFlightInfo,
    { flightId: "", markdown: "## H2" } as IFlightInfo,
    { flightId: "", markdown: "### H3" } as IFlightInfo,
  ];
}

export async function getAircrafts(): Promise<Aircraft[]> {
  const response = await axios.get<Aircraft[]>("aircrafts.json");
  for (const aircraft of response.data) {
    aircraft.icao = aircraft.icao.toLowerCase();
    aircraft.isSelected = true;
  }
  return response.data;
}
