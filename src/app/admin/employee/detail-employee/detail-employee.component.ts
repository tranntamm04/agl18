import {Component, Inject, OnInit} from '@angular/core';
import {EmployeeService} from "../../../services/employee.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Employee} from "../../../interface/Employee";
import {AccountEmployee} from "../../../interface/AccountEmployee";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-employee',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './detail-employee.component.html',
  styleUrls: ['./detail-employee.component.css']
})
export class DetailEmployeeComponent implements OnInit {
  id: string = '';
  employee!: AccountEmployee;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialogRef<DetailEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string }
  ) {}

  ngOnInit(): void {
    this.id = this.data.employeeId;

    this.employeeService.getEmployeeById(this.id).subscribe(data => {
      this.employee = data;
    });
  }

  close(): void {
    this.dialog.close();
  }
}

