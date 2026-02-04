import {AccountRole} from "./AccountRole";

export interface Role {
  roleId: number;
  roleName: string;
  accountRoleList: AccountRole[];
} 
