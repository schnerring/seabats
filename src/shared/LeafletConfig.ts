import { LatLng, TileLayer } from "leaflet";

export const lineStyle = {
  color: "#ffffff", // var(--white)
  weight: 1,
};

export const lineStyleHighlighted = {
  color: "#1148fe", // var(--blue)
  weight: 3,
};

export function tileLayer(): TileLayer {
  return new TileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  );
}

export function zoneStyle(
  type: string,
  color: string
): { weight: number; color: string; stroke: boolean } {
  return {
    weight: type === "sar" ? 2 : 1,
    color: color,
    stroke: false,
  };
}

export const initialCenter = new LatLng(35.917973, 14.409943);

export const initialZoom = 6;
