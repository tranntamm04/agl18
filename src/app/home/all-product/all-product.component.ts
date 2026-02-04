import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Product } from '../../interface/Product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [
    CommonModule,     // ❗❗❗ BẮT BUỘC
    RouterLink        // ❗❗❗ BẮT BUỘC
  ],
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

  productList: Product[] = [];
  brands = ['SamSung', 'Huawei', 'Apple', 'Xiaomi', 'Nokia', 'Vivo'];
  selectedBrand: string | null = null;

  constructor(
    private productService: ProductService,
    private title: Title,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Tất cả sản phẩm');

    // ✅ GIỐNG HOMEPAGE 100%
    this.productService.getAllProductHome().subscribe(data => {
      this.productList = data.content;
      console.log('ALL PRODUCT:', this.productList);
    });
  }

  onBrandChange(brand: string): void {
    this.selectedBrand = brand;

    this.productService.searchItem(brand).subscribe(data => {
      this.productList = data.content;
      console.log('FILTER:', this.productList);
    });
  }

  getImage(avt: string | null | undefined): string {
    if (!avt) return '/assets/img/17.jpg';
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';')[0].includes('http')
      ? avt
      : base + avt.split(';')[0];
  }

  numToString(num: number): string {
    return num.toLocaleString('vi-VN');
  }

    hasDiscount(p: any): boolean {
    if (!p || !p.promotion) return false;
    return p.promotion.promotionalValue > 0;
    }

    getDiscountedPrice(p: any): number {
    if (!p.promotion) return p.price;

    const promo = p.promotion;
    if (promo.typePromotion === 'PERCENT') {
        return Math.round(p.price * (1 - promo.promotionalValue / 100));
    }
    if (promo.typePromotion === 'MONEY') {
        return Math.max(p.price - promo.promotionalValue, 0);
    }
    return p.price;
    }

}
