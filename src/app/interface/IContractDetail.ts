import {Bill} from "./Bill";
import {Product} from "./Product";

export interface IContractDetail {
  id: number;
  bill: Bill;
  product: Product;
  quantity: number;
  price: number;
} 
