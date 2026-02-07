import { Injectable } from '@angular/core';
import { Product } from '../interface/Product';

export interface ProductLogic extends Product {
  image: string;
  finalPrice: number;
  hasDiscount: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductMapper {

  map(p: Product): ProductLogic {
    return {
      ...p,
      image: this.getImage(p.avt),
      finalPrice: this.getFinalPrice(p),
      hasDiscount: this.hasDiscount(p)
    };
  }

  private getImage(avt?: string | null): string {
    if (!avt) return '/assets/img/17.jpg';

    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }

  private getFinalPrice(p: Product): number {
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

  private hasDiscount(p: Product): boolean {
    if (!p || !p.promotion) return false;
    return p.promotion.promotionalValue > 0;
  }
}
