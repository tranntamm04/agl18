import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../../services/employee.service";
import {AlertService} from "../../employee/alert.service";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [ MatDialogModule ],
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
}) 
export class DeleteProductComponent implements OnInit {
  name = '';
  id!: number;

  constructor(
    private dialogRef: MatDialogRef<DeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.id = this.data.idProduct;
    this.name = this.data.productName;
  }

  close() {
    this.dialogRef.close();
  }

  delete() {
    this.productService.deleteProduct(this.id).subscribe({
      next: () => {
        this.alertService.showAlertSuccess('Xóa sản phẩm thành công!');
        this.dialogRef.close(true);
      },
      error: () => {
        this.alertService.showMessageErrors('Xóa thất bại!');
      }
    });
  }


}
