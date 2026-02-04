import {Account} from "./Account";
import {Position} from "./Position";

export interface Employee {
  idEmployee: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  phone: string;
  registerDate: string;
  account: Account;
  position: Position;

}
 