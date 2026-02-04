import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interface/Product';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private alertService = inject(AlertService);
  private titleService = inject(Title);
  private fb = inject(FormBuilder);

  productList: Product[] = [];
  indexPagination = 1;
  totalPagination = 0;

  search = this.fb.group({
    nameSearch: ['']
  });

  ngOnInit(): void {
    this.titleService.setTitle('Quản Lý Sản Phẩm');
    this.loadData();
  }

  loadData(): void {
    this.productService.getAllProduct().subscribe(data => {
      this.productList = data.content;
      this.totalPagination = data.totalPages;
    });
  }

  delete(idProduct: number, productName: string): void {
    (document.activeElement as HTMLElement)?.blur();

    const dialogRef = this.dialog.open(DeleteProductComponent, {
      width: '95vw',
      maxWidth: '900px',
      height: 'auto',
      panelClass: 'product-dialog',
      data: { idProduct, productName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productList = this.productList.filter(
          p => p.idProduct !== idProduct
        );
      }
    });
  }

  view(idProduct: number): void {
    (document.activeElement as HTMLElement)?.blur();

    this.dialog.open(DetailProductComponent, {
      width: '800px',
      data: { idProduct }
    });
  }


  getPage(page: number): void {
    const keyword = this.search.value.nameSearch ?? '';
    this.productService.getSearchProduct2(keyword, page).subscribe(data => {
      this.productList = data.content;
      this.indexPagination = data.pageable.pageNumber + 1;
      this.totalPagination = data.totalPages;
      this.scrollToTable();
    });
  }

  searchP(): void {
    const keyword = this.search.value.nameSearch ?? '';
    this.productService.searchItem2(keyword).subscribe({
      next: data => {
        this.productList = data.content;
        this.totalPagination = data.totalPages;
        this.scrollToTable();
      },
      error: () => this.alertService.showMessageErrors('Không tìm thấy!')
    });
  }

  scrollToTable(): void {
    document.querySelector('.tb')?.scrollIntoView({ behavior: 'smooth' });
  }

  numToString(num: number): string {
    return num.toLocaleString('vi-VN');
  }

  getImages(avt: string | null | undefined): string[] {
    if (!avt) return [];
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt
      .split(';')
      .filter(x => x)
      .map(id => base + id);
  }
}
