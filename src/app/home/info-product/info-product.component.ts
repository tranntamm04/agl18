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
  finalPrice = 0;
  selectedImage!: string

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
  totalItem = 0;
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
  ){}

  ngOnInit(): void {
    this.title.setTitle('Chi tiết sản phẩm');

    this.name = this.loginService.username;
    this.totalItem = this.cartService.getSoLuongGioHang();
    
    this.createE = new FormGroup({
      numOfStar: new FormControl<number | null>(null),
      comment: new FormControl<string>('', { nonNullable: true }),
    });

    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));

      this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.loadProduct(this.id);
    });
    
    this.productService.getAllBinhLuan(this.id).subscribe((data) => {
      this.listBl = data;
    });

    });

    if (this.name) {
      this.customerService.getCustomerUser(this.name)
        .subscribe(data => this.accountCustomer = data);
    }
  }

  loadProduct(id: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.productService.getProductWithPromotion(id).subscribe(promoData => {
      this.product = promoData;
      this.finalPrice = this.getDiscountedPrice(promoData);
      this.parseDescription(promoData.description);

      this.productService.getProductById(id).subscribe(fullData => {
        this.product.nameType = fullData.nameType;

        if (fullData.nameType) {
          this.productService
            .getByCategoryPublic(fullData.nameType)
            .subscribe(list => {
              this.relatedProducts = list
                .filter(p => p.idProduct !== id)
                .slice(0, 8);
            });
        }
      });
    });

    this.productService.getAllBinhLuan(id).subscribe(data => {
      this.listBl = data;
      this.filteredComments = data;
    });
  }


  filterByStar(value: StarFilter): void {
    this.selectedStar = value;

    if (value === 'ALL') {
      this.filteredComments = this.listBl;
      return;
    }

    this.filteredComments = this.listBl.filter(
      c => c.numberOfStar === value
    );
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
      .filter(
        (item): item is { label: string; value: string } => item !== null
      );
  }

  numToString(num?: number | null): string {
    if (num === null || num === undefined) {
      return '0';
    }
    return num.toLocaleString('vi-VN');
  }


  getDiscountedPrice(p: any): number {
    if (!this.hasDiscount(p)) {
      return p.price;
    }

    const promo = p.promotion;

    if (promo.typePromotion === 'PERCENT') {
      return Math.round(p.price * (1 - promo.promotionalValue / 100));
    }

    if (promo.typePromotion === 'MONEY') {
      return Math.max(p.price - promo.promotionalValue, 0);
    }

    return p.price;
  }

  hasPromotion(p: any): boolean {
    return !!p?.promotion;
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
      this.getDiscountedPrice(this.product),
      this.product.avt,
      this.product.quantity
    );

    if (!success) {
      this.alertService.showMessageWarning('Số lượng sản phẩm đã đạt tối đa tồn kho');
      return;
    }

    this.alertService.showAlertSuccess('Thêm sản phẩm thành công');
    this.totalItem = this.cartService.getSoLuongGioHang();
  }

  createRating() {
    if (this.createE.value.numOfStar < 1) {
      this.alertService.showMessageWarning('Bạn chưa đánh giá!');
      return;
    }
    if (this.createE.value.comment === '') {
      this.alertService.showMessageWarning('Bạn chưa bình luận!');
      return;
    }
    if (this.name === '') {
      this.alertService.showMessageWarning('Bạn chưa đăng nhập!');
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

  getStarCount(star: number): number {
    return this.listBl.filter(
      (c: Rating) => c.numberOfStar === star
    ).length;
  }

  getStarPercent(star: number): number {
    if (!this.listBl.length) return 0;
    return (this.getStarCount(star) / this.listBl.length) * 100;
  }

  getImage(avt: string | null | undefined): string {
    if (!avt) {
      return '/assets/img/17.jpg';
    }
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }

  getImages(avt: string | null | undefined): string[] {
    if (!avt) return [];
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt
      .split(';')
      .filter(x => x)
      .map(id => base + id);
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  hasDiscount(p: any): boolean {
    if (!p?.promotion) return false;

    const promo = p.promotion;

    if (promo.typePromotion === 'PERCENT') {
      return promo.promotionalValue > 0;
    }

    if (promo.typePromotion === 'MONEY') {
      return promo.promotionalValue > 0;
    }

    return false;
  }

  getTimeAgo(date: string | Date): string {
    const past = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) {
      return `${diff} giây trước`;
    }

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) {
      return `${minutes} phút trước`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} giờ trước`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ngày trước`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} tháng trước`;
    }

    const years = Math.floor(months / 12);
    return `${years} năm trước`;
  }

}
