import {Account} from "./Account";
import {Bill} from "./Bill";

export interface Customer {
  idCustomer: string;
  surname: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  registerDate: string;
  status: number;
  account: Account;
  bills: Bill[];
} 
