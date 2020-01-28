import {Point, Polygon} from "leaflet";

export class GeoJsonData {
  name: string;
  locationOsmCode: string;
  polygon: Polygon;
  center: Polygon;

  constructor(name: string, locationOsmCode: string, polygon: Polygon<any>, center: Polygon) {
    this.name = name;
    this.locationOsmCode = locationOsmCode;
    this.polygon = polygon;
    this.center = center;
  }

}
