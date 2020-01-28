export class InvestmentData {
  id: string;
  city: string;
  ratio: number;
  averageRentPrice: number;
  averageSalePrice: number;
  numberOfFlats: number;

  constructor(id: string, city: string, ratio: number, averageRentPrice: number, aaverageSalePrice: number, numberOfFlats: number) {
    this.averageRentPrice = averageRentPrice;
    this.averageSalePrice = aaverageSalePrice;
    this.ratio = ratio;
    this.id = id;
    this.city = city;
    this.numberOfFlats = numberOfFlats;
  }
}
