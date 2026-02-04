import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AlertService } from "../../admin/employee/alert.service";
import { CustomerService } from "../../services/customer.service";
import { BillService } from "../../services/bill.service";
import { CartService } from "../../services/cart.service";
import { LoginService } from "../../services/login.service";

import { AccountDTO } from "../../interface/AccountDTO";
import { BillDTO } from "../../interface/BillDTO";
import { CartItem } from '../../interface/CartItem';
import { PaymentProductDTO } from '../../interface/PaymentProductDTO';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  totalPay: number = 0;
  userName: string = '';
  account!: AccountDTO;
  payment!: FormGroup;
  product: PaymentProductDTO[] = [];
  cartItems: CartItem[] = [];
  bill!: BillDTO;
  recived: string = '';
  private char: string = '';

  constructor(
    private alertService: AlertService,
    private customerService: CustomerService,
    private billService: BillService,
    private cartService: CartService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.loginService.username;
    if (!this.userName) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartItems = this.cartService.getCheckoutItems();

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.totalPay = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    this.customerService.getCustomerUser(this.userName).subscribe(data => {
      this.account = data;
        this.payment.patchValue({
    shippingAddress: this.account.address
  });
    });

    this.payment = new FormGroup({
      selectHinhThucTT: new FormControl('', Validators.required),
      shippingAddress: new FormControl('', Validators.required)
    });
  }

  thanhtoan(): void {

    this.recived = this.account.surname + ' ' + this.account.name;
    this.product = this.cartItems.map(item => ({
      idProduct: item.idProduct,
      quantity: item.quantity
    }));

    this.bill = new BillDTO(
      this.recived,
      this.account.phone,
      this.payment.value.shippingAddress,
      this.payment.value.selectHinhThucTT,
      this.totalPay,
      this.userName,
      this.product
    );

    this.billService.payment(this.bill).subscribe(() => {
      this.alertService.showAlertSuccess("Thanh toán thành công!");
      this.cartItems.forEach(item =>
        this.cartService.xoaSanPham(item.idProduct)
      );

      this.cartService.clearCheckoutItems();
      this.router.navigate(['/']);
    });
  }

  numToString(num: number): string {
    return num.toLocaleString().split(',').join(this.char || '.');
  }
}
