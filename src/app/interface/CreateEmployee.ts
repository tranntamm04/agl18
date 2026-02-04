import {Position} from "./Position";

export class CreateEmployee {
  idEmployee: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  phone: string;
  registerDate: string;
  userName: string;
  password: string;
  positionId: Position;

 
  constructor(idEmployee: string, fullName: string, dateOfBirth: string, email: string, address: string, phone: string, registerDate: string, userName: string, password: string, positionId: Position) {
    this.idEmployee = idEmployee;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.registerDate = registerDate;
    this.userName = userName;
    this.password = password;
    this.positionId = positionId;
  }
}
