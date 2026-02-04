import { Injectable } from '@angular/core';
import { Product } from '../interface/Product';


@Injectable({
  providedIn: 'root'
})
export class PriceService {

  getDiscountPrice(product: Product): number {
    if (!product.promotion) {
      return product.price;
    }

    const price = product.price;
    const promo = product.promotion;

    if (promo.typePromotion === 'PERCENT') {
      return Math.round(price * (1 - promo.promotionalValue / 100));
    }

    if (promo.typePromotion === 'MONEY') {
      return Math.max(0, price - promo.promotionalValue);
    }

    return price;
  }

  hasDiscount(product: Product): boolean {
    return !!product.promotion;
  }
}
