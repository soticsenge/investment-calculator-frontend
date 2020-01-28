import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvestmentData} from '../models/InvestmentData';
import * as L from 'leaflet';
import {latLng, Layer, LeafletMouseEvent, MapOptions, TileLayer, tileLayer} from 'leaflet';
import {InvestmentService} from '../investment.service';
import {GeoJsonService} from '../geo-json.service';
import {flatMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-investment-ratios',
  templateUrl: './investment-ratios.component.html',
  styleUrls: ['./investment-ratios.component.scss']
})
export class InvestmentRatiosComponent implements OnInit {

  investments: InvestmentData[] = [];
  options: MapOptions;
  layers: Layer[] = [];
  zoom;
  center;
  mapboxAccessToken = 'pk.eyJ1Ijoic290aWNzZW5nZSIsImEiOiJjazV3aGlhNHcwbTBwM2ZsYmo3dTBuMTMxIn0.uPOMV9Od6cMvmghhBZesQg';

  constructor(private cdr: ChangeDetectorRef, private investmentService: InvestmentService, private geoJsonService: GeoJsonService) {
  }

  private readonly tileLayer: TileLayer =
    tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
      id: 'mapbox/light-v9',
      maxZoom: 18,
      attribution: '...'
    });

  ngOnInit() {
    this.layers.push(this.tileLayer);
    this.zoom = 11;
    this.center = latLng(47.49745, 19.13);

    this.investmentService.getInvestments()
      .pipe(
        flatMap(investments => {
          this.investments = investments as InvestmentData[];
          console.log(investments);
          return forkJoin(investments.map(i => this.geoJsonService.getGeoJson(i.locationString, i.locationOsmCode)));
        }))
      .subscribe(geoJsonList => {
        geoJsonList
          .forEach(geoJsonData => this.setMapAttributes(geoJsonData.polygon, geoJsonData.locationOsmCode));
      });
  }

  private setMapAttributes(layer, osmId) {
    this.layers.push(layer);
    layer.setStyle(this.getBaseStyle(osmId));
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.zoomToFeature
    });
  }

  private getBaseStyle(osmId: string) {
    const minValue = Math.min(...this.investments.map(x => x.ratio));
    const maxValue = Math.max(...this.investments.map(x => x.ratio));
    return {
      color: '#0A2F51',
      fillColor: this.getColor(maxValue, minValue, this.investments.find(investment => investment.locationOsmCode === osmId).ratio),
      fillOpacity: 0.7
    };
  }

  highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  zoomToFeature = (e: LeafletMouseEvent) => {
    console.log(e.target);
    this.layers = [this.tileLayer, e.target];
    this.center = e.latlng;
    this.zoom = this.zoom + 2;
    this.cdr.detectChanges();
  }

  resetHighlight = (e) => {
    e.target.setStyle({
      weight: 3,
      color: '#0A2F51',
      dashArray: '',
      fillOpacity: 0.7
    });
  }


  getColor(maxValue: number, minValue: number, currentValue: number): string {
    const percentage: number = Math.min((currentValue - minValue) / (maxValue - minValue), 1.0);
    const r = 59 + ((255 - 59) * percentage);
    const g = 50;
    const b = 53 + ((173 - 53) * (1 - percentage));
    return this.rgbToHex(r, g, b);
  }

  private componentToHex(c: number) {
    const hex = Math.floor(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  private rgbToHex(r, g, b) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
}
