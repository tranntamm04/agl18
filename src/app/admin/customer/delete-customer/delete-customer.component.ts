import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AlertService} from "../../employee/alert.service";
import {CustomerService} from "../../../services/customer.service";

@Component({
  selector: 'app-delete-customer',
  standalone: true,
  imports: [ MatDialogModule],
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.css']
})
export class DeleteCustomerComponent implements OnInit {
  name: any;
  // @ts-ignore
  id: String;

  constructor(public dialog: MatDialogRef<DeleteCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private customerService: CustomerService,private alertService: AlertService) { }

  ngOnInit(): void {
    this.id = this.data.customerId;
    this.name = this.data.name;
  } 

  close() {
    this.dialog.close();
  }

  delete() {
    this.customerService.deleteCustomer(this.id).subscribe(() => {
      this.dialog.close();
      this.alertService.showAlertSuccess('Xóa nhân viên thành công!');
    });
  }
}
