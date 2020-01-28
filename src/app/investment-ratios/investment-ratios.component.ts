import {Component, OnInit} from '@angular/core';
import {InvestmentData} from '../models/InvestmentData';
import * as L from 'leaflet';
import {LatLng, latLng, LeafletMouseEvent, Polygon, tileLayer} from 'leaflet';
import * as geoData from '../../assets/geo-data-hungary/geoJsonExports';
import {MapOptions} from 'leaflet';


@Component({
  selector: 'app-investment-ratios',
  templateUrl: './investment-ratios.component.html',
  styleUrls: ['./investment-ratios.component.scss']
})
export class InvestmentRatiosComponent implements OnInit {

  investments: InvestmentData[];
  options: MapOptions;
  layers: Polygon[] = [];
  zoom;
  center;

  mapboxAccessToken = 'pk.eyJ1Ijoic290aWNzZW5nZSIsImEiOiJjazV3aGlhNHcwbTBwM2ZsYmo3dTBuMTMxIn0.uPOMV9Od6cMvmghhBZesQg';


  constructor() {
  }

  ngOnInit() {


    this.investments = [
      new InvestmentData('I. kerület', '221984', 45, 60, 700000, 15),
      new InvestmentData('II. kerület', '221980', 40, 60, 700000, 16),
      new InvestmentData('III. kerület', '221976', 4, 60, 700000, 16),
      new InvestmentData('IV. kerület', '367963', 55, 60, 700000, 16),
      new InvestmentData('V. kerület', '1606103', 60, 60, 700000, 1),
      new InvestmentData('VI. kerület', '1606101', 77, 60, 700000, 16),
      new InvestmentData('VII. kerület', '1606102', 88, 60, 700000, 144),
      new InvestmentData('VIII. kerület', '1606100', 99, 60, 700000, 16),
      new InvestmentData('IX. kerület', '1552462', 100, 60, 700000, 166),
      new InvestmentData('X. kerület', '1552463', 70, 60, 700000, 16),
      new InvestmentData('XI. kerület', '221998', 15, 60, 700000, 16),
      new InvestmentData('XII. kerület', '221995', 16, 60, 700000, 16),
      new InvestmentData('XIII. kerület', '1605916', 12, 60, 700000, 16),
      new InvestmentData('XIV. kerület', '1606043', 11, 60, 700000, 16),
      new InvestmentData('XV. kerület', '1606009', 60, 60, 700000, 16),
      new InvestmentData('XVI. kerület', '1552464', 66, 60, 700000, 16),
      new InvestmentData('XVII. kerület', '1550599', 70, 60, 700000, 15),
      new InvestmentData('XVIII. kerület', '1550598', 80, 60, 700000, 16),
      new InvestmentData('XIX. kerület', '1551290', 90, 60, 700000, 16),
      new InvestmentData('XX. kerület', '1551291', 10, 60, 700000, 12),
      new InvestmentData('XXI. kerület', '215618', 8, 60, 700000, 16),
      new InvestmentData('XXII. kerület', '215621', 78, 60, 700000, 177),
      new InvestmentData('XIII. kerület', '1550597', 70, 60, 700000, 16)
    ];

    this.options = {
      layers: [
        tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
          id: 'mapbox/light-v9',
          maxZoom: 18,
          attribution: '...'
        })
      ]
    };
    this.zoom = 11;
    this.center = latLng(47.49745, 19.13);
    const minValue = Math.min(...this.investments.map(x => x.ratio));
    const maxValue = Math.max(...this.investments.map(x => x.ratio));
    this.getPolygonsWithOsmId().forEach(layerWithId => {
      this.layers.push(layerWithId[0]);
      layerWithId[0].setStyle(this.getBaseStyle(maxValue, minValue, layerWithId[1]));
      layerWithId[0].on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature
      });
    });

  }

  private getBaseStyle(maxValue: number, minValue: number, osmId: string) {
    return {
      color: '#0A2F51',
      fillColor: this.getColor(maxValue, minValue, this.investments.find(investment => investment.city === osmId).ratio),
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
   this.layers = [e.target];
   this.center = e.latlng;
   this.zoom = this.zoom + 3;
  };

  resetHighlight = (e) => {
    e.target.setStyle({
      weight: 3,
      color: '#0A2F51',
      dashArray: '',
      fillOpacity: 0.7
    });
  }

  getPolygonsWithOsmId(): [Polygon, string][] {
    return Array.from(Array(23)
      .keys())
      .map(index =>
        [
          L.geoJSON()
            .addData(geoData.geoData[index.toString()].data) as Polygon,
          geoData.geoData[index.toString()].data.features['0'].properties.osm_id
        ]);
  }

  getColor(maxValue: number, minValue: number, currentValue: number): string {
    const percentage: number = currentValue / (maxValue - minValue);
    const r = 10 + ((222 - 10) * (1 - percentage));
    const g = 47 + ((287 - 87) * (1 - percentage));
    const b = 81 + ((207 - 81) * (1 - percentage));
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
