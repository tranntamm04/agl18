import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-inventory',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  products: any[] = [];
  indexPagination = 1;
  totalPagination = 0;
  search!: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.search = this.fb.group({
      nameSearch: ['']
    });

    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProduct().subscribe(res => {
      this.products = res.content;
      this.totalPagination = res.totalPages;
    });
  }

  getPage(page: number): void {
    const keyword = this.search.value.nameSearch ?? '';
    this.productService.getSearchProduct2(keyword, page).subscribe(res => {
      this.products = res.content;
      this.indexPagination = res.pageable.pageNumber + 1;
      this.totalPagination = res.totalPages;
    });
  }

  searchP(): void {
    const keyword = this.search.value.nameSearch ?? '';
    this.productService.searchItem2(keyword).subscribe(res => {
      this.products = res.content;
      this.totalPagination = res.totalPages;
      this.indexPagination = 1;
    });
  }

  importStock(p: any, input: HTMLInputElement): void {
    const qty = Number(input.value);

    if (!qty || qty <= 0) {
      alert('Số lượng nhập không hợp lệ');
      return;
    }

    this.productService.importStock(p.idProduct, qty).subscribe({
      next: () => {
        p.quantity += qty;
        input.value = '';
      },
      error: () => {
        alert('Nhập kho thất bại');
      }
    });
  }

  getImage(avt: string | null | undefined): string {
    if (!avt) {
      return '/assets/img/17.jpg';
    }
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }
}
