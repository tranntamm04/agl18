import {ProductDTO} from "./ProductDTO";

export interface ContractDetail {
  id:any;
  idBill: number;
  idProduct: number;
  price: number;
  quantity: number;
  product: ProductDTO;
}
 