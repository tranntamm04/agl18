import {ProductDTO} from "./ProductDTO";
import {AccountCustomer} from "./AccountCustomer";

export interface Rating {
  id:any;
  product: ProductDTO;
  customer: AccountCustomer;
  numberOfStar: number;
  comment: string;
  dateFounded: Date;
  status: number;
} 
