import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BillService} from "../../../services/bill.service";
import {EmployeeService} from "../../../services/employee.service";
import {AlertService} from "../../employee/alert.service";

@Component({
  selector: 'app-delete-bill',
  standalone: true,
  imports: [ MatDialogModule],
  templateUrl: './delete-bill.component.html',
  styleUrls: ['./delete-bill.component.css']
})
export class DeleteBillComponent implements OnInit {
  id: any;

  constructor(public dialog: MatDialogRef<DeleteBillComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private billService: BillService, private alertService: AlertService) { }
 
  ngOnInit(): void {
    this.id= this.data.id;
  }

  close() {
    this.dialog.close();
  }

  delete() {
    this.billService.delete(this.id).subscribe((data) =>{
      this.dialog.close();
      this.alertService.showAlertSuccess('Xóa đơn hàng thành công!');
    })
  }
}
