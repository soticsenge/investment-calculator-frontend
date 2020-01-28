import {Injectable} from '@angular/core';
import {InvestmentData} from './models/InvestmentData';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  tmp = ['I. kerület', 'II. kerület', 'III. kerület', 'IV. kerület', 'VI. kerület',
    'VIII. kerület', 'IX. kerület', 'XI. kerület', 'XII. kerület', 'XIII. kerület', 'XIV. kerület', 'XV. kerület',
    'XI. kerület', 'V. kerület', 'VII. kerület', 'XVI. kerület', 'XVII. kerület',
    'XVIII. kerület', 'XIX. kerület', 'XXIII. kerület',
    'XXII. kerület', 'XXI. kerület', 'Szeged', 'Székesfehérvár', 'Mór', 'Kiskunmajsa', 'Győr', 'Veszprém', 'Debrecen'];

  randomInstance(nr: number): InvestmentData[] {
    return [...Array(nr)].map(i => new InvestmentData(
      this.tmp[Math.floor(Math.random() * this.tmp.length)],
      '221984',
      '45',
      Math.random(),
      Math.random() * 1000,
      Math.random() * 70000,
      20));
  }

  getInvestments() {
    // return this.http.get<InvestmentData[]>('http://localhost:8080/investments/district', {...this.httpOptions});
    return of(this.randomInstance(500));
  }
}
