import {Employee} from "./Employee";

export interface Position {
  positionId: number;
  positionName: string;
  employees: Employee[];
}
 