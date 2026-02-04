import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interface/CartItem';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private soLuongSubject = new BehaviorSubject<number>(0);
  soLuong$ = this.soLuongSubject.asObservable();

  constructor(private loginService: LoginService) {
    this.emitSoLuong();
  }

  private getCartKey(): string {
    return `cart_user_${this.loginService.username}`;
  }

  private getCheckoutKey(): string {
    return `checkout_user_${this.loginService.username}`;
  }

  getListGioHang(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.getCartKey()) || '[]');
  }

  setListGioHang(list: CartItem[]): void {
    localStorage.setItem(this.getCartKey(), JSON.stringify(list));
    this.emitSoLuong();
  }

  addToGioHang(
    masp: number,
    productName: string,
    price: number,
    avt: string,
    tonKho: number
  ): boolean {
    const list = this.getListGioHang();
    const item = list.find(p => p.idProduct === masp);
    if (item) {
      if (item.quantity >= tonKho) {
        item.quantity = tonKho;
        this.setListGioHang(list);
        return false;
      }
      item.quantity += 1;
    } else {
      if (tonKho <= 0) return false;
      list.push({ idProduct: masp, quantity: 1, productName, price, avt
      });
    }
    this.setListGioHang(list);
    return true;
  }

  updateSoLuongSanPham( id: number, soLuongMoi: number, tonKho: number): void {
    const list = this.getListGioHang();
    const item = list.find(p => p.idProduct === id);
    if (!item) return;

    if (soLuongMoi < 1) {
      item.quantity = 1;
    } else if (soLuongMoi > tonKho) {
      item.quantity = tonKho;
    } else {
      item.quantity = soLuongMoi;
    }

    this.setListGioHang(list);
  }

  xoaSanPham(id: number): void {
    this.setListGioHang(
      this.getListGioHang().filter(p => p.idProduct !== id)
    );
  }

  xoaHet(): void {
    this.setListGioHang([]);
  }

  getSoLuongGioHang(): number {
    return this.getListGioHang()
      .reduce((sum, p) => sum + p.quantity, 0);
  }

  private emitSoLuong(): void {
    this.soLuongSubject.next(this.getSoLuongGioHang());
  }

  setCheckoutItems(items: CartItem[]): void {
  localStorage.setItem(this.getCheckoutKey(), JSON.stringify(items));
}

getCheckoutItems(): CartItem[] {
  return JSON.parse(localStorage.getItem(this.getCheckoutKey()) || '[]');
}

clearCheckoutItems(): void {
  localStorage.removeItem(this.getCheckoutKey());
}

getCheckoutTotal(): number {
  return this.getCheckoutItems()
    .reduce((sum, p) => sum + p.price * p.quantity, 0);
}

}
