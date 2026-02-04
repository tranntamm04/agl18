import {Promotion} from "./Promotion";
import {ProductType} from "./ProductType";
import { Rating } from "./Rating";

export interface Product {
  idProduct: number;
  productName: string;
  price: number;
  quantity: number;
  avt: string;
  numOfStar:number;
  numOfReview: number;
  enteredDate: string;
  description: string;
  sold: number;
  status: number;
  productType?: ProductType | null;
  promotion?: Promotion | null;
  rating: Rating[];
}
