import {Account} from "./Account";

export interface AccountCustomer {
  idCustomer: string;
  surname: string;
  name: string;
  gender: string;
  phone: string;
  email:string;
  address: string;
  status: number;
  account: Account
} 
