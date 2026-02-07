import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AlertService } from '../../admin/product/alert.service';
import { LoginService } from '../../services/login.service';
import { CustomerService } from '../../services/customer.service';

import { ProductDTO } from '../../interface/ProductDTO';
import { AccountCustomer } from '../../interface/AccountCustomer';

import { NgbCarouselModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Rating } from '../../interface/Rating';
import { RatingDTO } from '../../interface/RatingDTO';
import { RatingService } from '../../services/rating.service';

type StarFilter = number | 'ALL';

@Component({
  selector: 'app-info-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbCarouselModule,
    NgbRatingModule,
    CommonModule
  ],
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.css'],
})
export class InfoProductComponent implements OnInit {

  product: any = {
    idProduct: 0,
    productName: '',
    price: 0,
    quantity: 0,
    avt: '',
    description: '',
    sold: 0,
    nameType: '',
    numOfStar: 0,
    numOfReview: 0,
    promotion: null
  };

  specs: { label: string; value: string }[] = [];
  relatedProducts: ProductDTO[] = [];
  listBl: Rating[] = [];
  filteredComments: Rating[] = [];
  selectedImage!: string;

  filters: { label: string; value: StarFilter }[] = [
    { label: 'Tất cả', value: 'ALL' },
    { label: '5 sao', value: 5 },
    { label: '4 sao', value: 4 },
    { label: '3 sao', value: 3 },
    { label: '2 sao', value: 2 },
    { label: '1 sao', value: 1 },
  ];

  selectedStar: StarFilter = 'ALL';

  createE!: FormGroup;
  rating!: RatingDTO;
  accountCustomer!: AccountCustomer;

  id!: number;
  name = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private alertService: AlertService,
    private loginService: LoginService,
    private customerService: CustomerService,
    private title: Title,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Chi tiết sản phẩm');
    this.name = this.loginService.username;
    this.createE = new FormGroup({
      numOfStar: new FormControl<number | null>(null),
      comment: new FormControl<string>('', { nonNullable: true }),
    });

    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadProduct(this.id);

      this.productService.getAllBinhLuan(this.id).subscribe(data => {
        this.listBl = data;
        this.filteredComments = data;
      });
    });

    if (this.name) {
      this.customerService
        .getCustomerUser(this.name)
        .subscribe(data => (this.accountCustomer = data));
    }
  }

  loadProduct(id: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.productService.getProductWithPromotion(id).subscribe(p => {
      this.product = p;
      this.parseDescription(p.description);

      const typeId = p.productType?.idType;
      if (typeId) {
        this.productService.getByTypeId(typeId).subscribe(list => {
          this.relatedProducts = list
            .filter(x => x.idProduct !== id)
            .slice(0, 8);
        });
      }
    });
  }

  hasPromotion(p: any): boolean {
    return !!p?.promotion;
  }

  hasDiscount(p: any): boolean {
    return !!p?.promotion && p.promotion.promotionalValue > 0;
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
  
  add(): void {
    if (!this.loginService.isLoggedIn) {
      this.alertService.showMessageWarning('Vui lòng đăng nhập để thêm vào giỏ hàng');
      this.router.navigate(['/login']);
      return;
    }

    const success = this.cartService.addToGioHang(
      this.product.idProduct,
      this.product.productName,
      this.getGiagiam(this.product),
      this.product.avt,
      this.product.quantity
    );

    if (!success) {
      this.alertService.showMessageWarning('Số lượng sản phẩm đã đạt tối đa tồn kho');
      return;
    }
    this.alertService.showAlertSuccess('Thêm sản phẩm thành công');
  }

  filterByStar(value: StarFilter): void {
    this.selectedStar = value;
    this.filteredComments =
      value === 'ALL'
        ? this.listBl
        : this.listBl.filter(c => c.numberOfStar === value);
  }

  parseDescription(description: string): void {
    if (!description) {
      this.specs = [];
      return;
    }

    this.specs = description
      .split('\n')
      .map(line => {
        const index = line.indexOf(':');
        if (index === -1) return null;
        return {
          label: line.substring(0, index).trim(),
          value: line.substring(index + 1).trim()
        };
      })
      .filter(Boolean) as { label: string; value: string }[];
  }

  numToString(num?: number | null): string {
    return num ? num.toLocaleString('vi-VN') : '0';
  }

  getImage(avt?: string | null): string {
    if (!avt) return '/assets/img/17.jpg';
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return base + avt.split(';')[0];
  }

  getImages(avt?: string | null): string[] {
    if (!avt) return [];
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').filter(Boolean).map(id => base + id);
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  getStarCount(star: number): number {
    return this.listBl.filter(c => c.numberOfStar === star).length;
  }

  getStarPercent(star: number): number {
    if (!this.listBl.length) return 0;
    return (this.getStarCount(star) / this.listBl.length) * 100;
  }

  createRating() {
    if (!this.createE.value.numOfStar || !this.createE.value.comment || !this.name) {
      this.alertService.showMessageWarning('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.rating = new RatingDTO(
      this.createE.value.numOfStar,
      this.createE.value.comment,
      this.product.idProduct,
      this.accountCustomer.idCustomer
    );

    this.ratingService.createRating(this.rating).subscribe(() => {
      this.alertService.showAlertSuccess('Cảm ơn bạn đã đánh giá!');
      this.ngOnInit();
    });
  }

  getTimeAgo(date: string | Date): string {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} ngày trước`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} tháng trước`;
    return `${Math.floor(mo / 12)} năm trước`;
  }
  
}
