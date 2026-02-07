import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../interface/Product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AlertService } from '../../admin/product/alert.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbCarouselModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  productList: Product[] = [];
  totalItem = 0;

  tag = ['SamSung', 'Huawei', 'Apple', 'Xiaomi', 'Nokia', 'Vivo'];

  images = [
    { src: 'assets/b1.png' },
    { src: 'assets/b2.png' },
    { src: 'assets/banner1.png' },
    { src: 'assets/banner2.png' },
    { src: 'assets/banner3.png' },
    { src: 'assets/banner4.png' },
    { src: 'assets/banner5.png' }
  ];

  indexPagination = 1;
  totalPagination = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private alertService: AlertService,
    private loginService: LoginService,
    private titleService: Title,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Trang Chủ');
    this.totalItem = this.cartService.getSoLuongGioHang();

    if (this.productService.key) {
      this.searchTag(this.productService.key);
      this.productService.key = '';
    } else {
      this.getList();
    }
  }

  getList(): void {
    this.productService.getAllProductHome().subscribe(data => {
      this.productList = data.content;
      this.totalPagination = data.totalPages;
      this.totalItem = this.cartService.getSoLuongGioHang();
    });
  }

  searchTag(tag: string): void {
    this.productService.searchItem(tag).subscribe(data => {
      this.productList = data.content;
      this.totalPagination = data.totalPages;

      this.alertService.showAlertSuccess(
        `Tìm thấy ${data.totalElements} sản phẩm!`
      );

      this.scrollToProduct();
    });
  }

  getPage(page: number): void {
    this.productService.getSearchProduct('', page).subscribe(data => {
      this.productList = data.content;
      this.indexPagination = data.pageable.pageNumber + 1;
      this.totalPagination = data.totalPages;
      this.scrollToProduct();
    });
  }

  add(id: number, name: string, price: number, avt: string, tonkho: number): void {
    if (!this.loginService.isLoggedIn) {
      this.alertService.showMessageWarning(
        'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!'
      );
      this.router.navigate(['/login']);
      return;
    }

    const added = this.cartService.addToGioHang(id, name, price, avt, tonkho);
    if (!added) {
      this.alertService.showMessageWarning('Số lượng sản phẩm trong kho không đủ!');
      return;
    }

    this.alertService.showAlertSuccess('Thêm thành công sản phẩm!');
    this.totalItem = this.cartService.getSoLuongGioHang();
  }

  getGiagiam(p: any): number {
    if (!p.promotion) return p.price;
    const promo = p.promotion;
    if (promo.typePromotion === 'PERCENT') {
      return Math.round(p.price * (1 - promo.promotionalValue / 100) - 1000);
    }
    if (promo.typePromotion === 'MONEY') {
      return Math.max(p.price - promo.promotionalValue, 0);
    }
    return p.price;
  }

  hasDiscount(p: any): boolean {
    return !!p?.promotion && p.promotion.promotionalValue > 0;
  }

  numToString(num: number): string {
    return num.toLocaleString('vi-VN');
  }

  getImage(avt?: string | null): string {
    if (!avt) return '/assets/img/17.jpg';
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }

  private scrollToProduct(): void {
    try {
      this.renderer
        .selectRootElement('.sanPham')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }
}
