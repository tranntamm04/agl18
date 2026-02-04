import {Account} from "./Account";
import {Role} from "./Role";

export interface AccountRole {
  id: number;
  account: Account;
  role: Role
}
 