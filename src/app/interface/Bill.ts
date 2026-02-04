import {Customer} from "./Customer";

export interface Bill {
  idBill: number;
  dateFounded: Date;
  received: string;
  phone: string;
  address: string;
  paymentMethods: string;
  totalMoney: number;
  status: number;
  customer: Customer;
}
