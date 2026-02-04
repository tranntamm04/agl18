export class RatingDTO {
  numberOfStar!: number;
  comment!: string;
  idProduct!: number;
  idCustomer!: string;


  constructor(numberOfStar: number, comment: string, idProduct: number, idCustomer: string) {
    this.numberOfStar = numberOfStar;
    this.comment = comment;
    this.idProduct = idProduct;
    this.idCustomer = idCustomer;
  }
} 
