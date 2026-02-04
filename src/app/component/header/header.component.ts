import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Profile } from '../../interface/Profile';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../interface/Product';
import { AlertService } from '../../admin/product/alert.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, RouterLink, ReactiveFormsModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthPage = false;
  totalItem = 0;
  profile!: Profile;
  isAccountOpen = false;
  searchItem = new FormGroup({
    itemSearch: new FormControl('')
  });
  productList: Product[] = [];
  totalPagination = 0;
  totalElements = 0;

  private subs = new Subscription();
  private readonly AUTH_PATHS = ['/login'];

  constructor(
    private login: LoginService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private alertService: AlertService,
    private renderer: Renderer2
  ) {}

  get role(): string {
    return this.login.role;
  }

  get isLoggedIn(): boolean {
    return this.login.isLoggedIn;
  }

  ngOnInit(): void {

    this.subs.add(
      this.cartService.soLuong$.subscribe((soLuong: number) => {
        this.totalItem = soLuong;
      })
    );

    const setAuthPage = (url: string) =>
      (this.isAuthPage = this.AUTH_PATHS.some(p => url.startsWith(p)));

    setAuthPage(this.router.url);

    this.subs.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: any) => setAuthPage(e.urlAfterRedirects))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  resetSearch(): void {
    this.productService.key = '';
  }

  logout(): void {
    this.login.logout();
    this.router.navigateByUrl('/');
  }

  openSearch(): void {
    const keyword = this.searchItem.value.itemSearch || '';

    this.productService.searchItem(keyword).subscribe(data => {
      this.productList = data.content;
      this.totalPagination = data.totalPages;
      this.totalElements = data.totalElements;
      this.alertService.showAlertSuccess(
        `Tìm thấy ${this.totalElements} sản phẩm!`
      );
      this.scrollToProduct();
    });
  }

  private scrollToProduct(): void {
    try {
      this.renderer
        .selectRootElement('.sanPham')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  toggleAccount() {
    this.isAccountOpen = !this.isAccountOpen;
  }

  closeAccount() {
    this.isAccountOpen = false;
  }
}
