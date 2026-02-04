import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../../services/employee.service";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-delete-employee',
  standalone: true,
  imports: [ MatDialogModule],
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css']
})
export class DeleteEmployeeComponent implements OnInit {
  name = '';
  // @ts-ignore
  id: string;

  constructor(public dialog: MatDialogRef<DeleteEmployeeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private employeeService: EmployeeService,private alertService: AlertService) { }
 
  ngOnInit(): void {
    this.id = this.data.employeeId;
    this.name = this.data.name;
  }

  delete() {
    this.employeeService.deleteEmployee(this.id).subscribe(() => {
      this.dialog.close();
      this.alertService.showAlertSuccess('Xóa nhân viên thành công!');
    });
  }

  close() {
    this.dialog.close();
  }

}
