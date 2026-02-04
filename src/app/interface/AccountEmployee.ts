import {Account} from "./Account";
import {Position} from "./Position";

export interface AccountEmployee {
  idEmployee: number;
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  phone: string;
  registerDate: string;
  userName: string;
  password: string;
  positionId: number;
  account: Account;
  position: Position;
} 
