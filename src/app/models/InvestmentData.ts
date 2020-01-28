export class InvestmentData {
  id: string;
  locationOsmCode: string;
  locationString: string;
  ratio: number;
  averageRentPrice: number;
  averageSalePrice: number;
  numberOfFlats: number;

  constructor(locationString: string, id: string, locationOsmCode: string,
              ratio: number, averageRentPrice: number, averageSalePrice: number, numberOfFlats: number) {
    this.averageRentPrice = averageRentPrice;
    this.averageSalePrice = averageSalePrice;
    this.ratio = ratio;
    this.id = id;
    this.locationOsmCode = locationOsmCode;
    this.locationString = locationString;
    this.numberOfFlats = numberOfFlats;
  }
}
