import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductType } from '../../../interface/ProductType';
import { Promotion } from '../../../interface/Promotion';
import { ProductDTO } from '../../../interface/ProductDTO';

import { ProductTypeService } from '../../../services/product-type.service';
import { PromotionService } from '../../../services/promotion.service';
import { ProductService } from '../../../services/product.service';
import { UploadService } from '../../../services/upload.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {

  createProduct!: FormGroup;
  productType: ProductType[] = [];
  promotion: Promotion[] = [];
  submitting = false;
  images: string[] = [];
  previewImages: string[] = [];
  fallbackImage = '/assets/img/17.jpg';

  constructor(
    private productTypeService: ProductTypeService,
    private promotionService: PromotionService,
    private productService: ProductService,
    private router: Router,
    private alertService: AlertService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.createProduct = new FormGroup({
      productName: new FormControl('', [Validators.minLength(4), Validators.required]),
      price: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      idPromotion: new FormControl(null),
      idType: new FormControl('', Validators.required),
      avt: new FormControl('')
    });

    this.productTypeService.findAllProductType()
      .subscribe(data => this.productType = data || []);

    this.promotionService.getAll()
      .subscribe(data => this.promotion = data || []);
  }

  onFileSelect(event: any): void {
    if (!event.target.files || event.target.files.length === 0) return;
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadService.upload(file).subscribe(res => {
        if (res?.public_id && res?.secure_url) {
          this.images.push(res.public_id);
          this.previewImages.push(res.secure_url);
          this.createProduct.patchValue({
            avt: this.images.join(';')
          });

        }
      });
    }
  }

  create(): void {
    if (this.createProduct.invalid || this.submitting) return;
    this.submitting = true;

    const v = this.createProduct.value;

    const payload: ProductDTO = {
      ...v,
      price: Number(v.price),
      quantity: 0,
      idType: Number(v.idType),
      idPromotion: v.idPromotion !== null ? Number(v.idPromotion) : null,
      avt: this.images.join(';')
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.alertService.showAlertSuccess('Tạo mới sản phẩm thành công!');
        this.router.navigate(['/admin/listProduct']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/listProduct']);
  }
}
