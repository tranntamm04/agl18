import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { ProductDTO } from '../../../interface/ProductDTO';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {

  id!: number;
  product!: ProductDTO;
  selectedImage!: string;
  specs: { label: string; value: string }[] = [];

  constructor(
    private productService: ProductService,
    public dialog: MatDialogRef<DetailProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.id = this.data.idProduct;

    this.productService.getProductById(this.id).subscribe({
      next: data => {
        this.product = data;
        this.parseDescription();
        // LẤY ẢNH ĐẦU TIÊN LÀM ẢNH LỚN
        const images = this.getImages(this.product.avt);
        this.selectedImage = images[0];
      },
      error: err => console.error(err)
    });
  }

  parseDescription(): void {
    if (!this.product?.description) return;

    this.specs = this.product.description
      .split('\n')
      .map(line => {
        const [label, value] = line.split(':');
        return {
          label: label?.trim(),
          value: value?.trim()
        };
      })
      .filter(item => item.label && item.value);
  }

  close(): void {
    this.dialog.close();
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

  selectImage(img: string) {
    this.selectedImage = img;
  }
}
