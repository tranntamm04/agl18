import { Component, OnInit, Renderer2 } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { ProductService } from "../../services/product.service";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AlertService } from "../../admin/product/alert.service";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { LoginService } from "../../services/login.service";
import { Title } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { CartItem } from '../../interface/CartItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  totalItem: number = 0;
  product: CartItem[] = [];
  grandTotal: number = 0;
  searchItem!: FormGroup;
  name: string = '';

  stockMap = new Map<number, number>();

  private char: any;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private alertService: AlertService,
    private loginService: LoginService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Giỏ Hàng");
    this.name = this.loginService.username;

    this.loadCartAndStock();

    this.totalItem = this.cartService.getSoLuongGioHang();
    this.searchItem = new FormGroup({
      itemSearch: new FormControl('')
    });
  }

  loadCartAndStock(): void {
    this.product = this.cartService.getListGioHang();
    this.product.forEach((item: any) => {
      item.checked = false;

      this.productService.getProductById(item.idProduct).subscribe(prod => {
        this.stockMap.set(item.idProduct, prod.quantity);
      });
    });
    this.grandTotal = 0;
  }

  calculateTotal(): void {
    this.grandTotal = this.product
      .filter((p: any) => p.checked)
      .reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  toggleAll(event: any): void {
    const checked = event.target.checked;
    this.product.forEach((p: any) => (p.checked = checked));
    this.calculateTotal();
  }

  isAllChecked(): boolean {
    return (
      this.product.length > 0 &&
      this.product.every((p: any) => p.checked)
    );
  }

  xoaSP(masp: number): void {
    this.cartService.xoaSanPham(masp);
    this.alertService.showAlertSuccess("Xóa sản phẩm thành công!");
    this.loadCartAndStock();
  }

  xoaHet(): void {
    this.cartService.xoaHet();
    this.alertService.showAlertSuccess("Xóa sản phẩm thành công!");
    this.loadCartAndStock();
  }

  numToString(num: number): string {
    return num.toLocaleString().split(',').join(this.char || '.');
  }

thanhToan(): void {
  if (!this.name) {
    this.alertService.showMessageWarning("Bạn chưa đăng nhập!");
    this.router.navigate(['/login']);
    return;
  }

  const selectedProducts = this.product.filter(p => p.checked);

  if (selectedProducts.length === 0) {
    this.alertService.showMessageWarning("Vui lòng chọn sản phẩm để thanh toán!");
    return;
  }

  this.cartService.setCheckoutItems(selectedProducts);
  this.router.navigate(['/payment']);
}

  getImage(avt: string | null | undefined): string {
    if (!avt) return '/assets/img/17.jpg';
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }

  onSoLuongChange(p: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    const stock = this.stockMap.get(p.idProduct) ?? 1;

    if (value < 1) value = 1;
    if (value > stock) value = stock;

    this.cartService.updateSoLuongSanPham(
      p.idProduct,
      value,
      stock
    );

    p.quantity = value;

    if (p.checked) {
      this.calculateTotal();
    }
  }

  get hasProduct(): boolean {
    return Array.isArray(this.product) && this.product.length > 0;
  }
}
