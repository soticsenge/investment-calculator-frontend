import {Injectable} from '@angular/core';
import {InvestmentData} from './models/InvestmentData';
import {HttpClient} from '@angular/common/http';
import {GeoJsonData} from './models/GeoJsonData';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import * as L from 'leaflet';
import {Point, Polygon} from 'leaflet';
import {assocPath, merge, mergeAll} from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class GeoJsonService {

  constructor(private http: HttpClient) {
  }


  getGeoJson(locationName: string, osmCode: string): Observable<GeoJsonData> {
    return localStorage.getItem(locationName) ?
      of(JSON.parse(localStorage.getItem(locationName)) as GeoJsonData) :
      this.extractGeoJsonAndCache(locationName, osmCode);
  }

  private extractGeoJsonAndCache(locationName: string, osmCode: string): Observable<GeoJsonData> {
    return this.http.get<any>('http://localhost:8080/location/' + locationName).pipe(
      map((response: any) => {
        const geoJson = new GeoJsonData(
          locationName,
          osmCode,
          this.getPolygon(assocPath(['features'], this.getFilter(response), response)),
          this.getPolygon(assocPath(['features'], response.features.filter(f => f.geometry.type === 'Point'), response)),
        );
        localStorage.setItem(locationName, JSON.stringify(geoJson));
        return geoJson;
      }));
  }

  private getFilter(response: any) {
    return [response.features.filter(f => f.geometry.type === 'Polygon')[0]];
  }

  private getPolygon(data: any): Polygon {
    return (L.geoJSON().addData(data) as Polygon);
  }
}
