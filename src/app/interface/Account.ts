import {Customer} from "./Customer";
import {Employee} from "./Employee";
import {AccountRole} from "./AccountRole";

export interface Account {
  userName: string;
  password: string;
  customer: Customer;
  employee: Employee;
  accountRoleList: AccountRole[];
}
 