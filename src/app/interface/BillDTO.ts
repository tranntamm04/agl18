
import { PaymentProductDTO } from "./PaymentProductDTO";

export class BillDTO {
  idBill!: number;
  dateFounded!: string;
  received!: string;
  phone!: string;
  address!: string;
  paymentMethods!: string;
  totalMoney!: number;
  status!: number;
  idCustomer!: string;
  object!: PaymentProductDTO[];
  constructor( received: string, phone: string, address: string, paymentMethods: string, totalMoney: number, idCustomer: string,object:PaymentProductDTO[]) {
    this.received = received;
    this.phone = phone;
    this.address = address;
    this.paymentMethods = paymentMethods;
    this.totalMoney = totalMoney;
    this.idCustomer = idCustomer;
    this.object = object;
  }

}
 
