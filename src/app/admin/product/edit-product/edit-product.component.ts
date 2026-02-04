import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../services/product.service';
import { ProductTypeService } from '../../../services/product-type.service';
import { PromotionService } from '../../../services/promotion.service';
import { AlertService } from '../alert.service';
import { UploadService } from '../../../services/upload.service';

import { ProductType } from '../../../interface/ProductType';
import { Promotion } from '../../../interface/Promotion';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  createProduct!: FormGroup;
  productType: ProductType[] = [];
  promotion: Promotion[] = [];

  id!: number;
  oldProduct: any;

  images: string[] = [];
  previewImages: string[] = [];
  hasNewUpload = false;
  fallbackImage = '/assets/img/17.jpg';

  constructor(
    private productService: ProductService,
    private productTypeService: ProductTypeService,
    private promotionService: PromotionService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.createProduct = new FormGroup({
      productName: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      idType: new FormControl('', Validators.required),
      idPromotion: new FormControl('', Validators.required),
      avt: new FormControl('')
    });

    this.productTypeService.findAllProductType()
      .subscribe(d => this.productType = d || []);

    this.promotionService.getAll()
      .subscribe(d => this.promotion = d || []);

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(this.id);
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(data => {
      this.oldProduct = data;

      this.images = [];
      this.previewImages = [];

      if (data.avt) {
        const baseUrl = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
        const ids = data.avt.split(';').filter((x: string) => x.trim() !== '');

        ids.forEach(pid => {
          this.images.push(pid);
          this.previewImages.push(baseUrl + pid);
        });
      }

      this.createProduct.patchValue({
        productName: data.productName,
        price: data.price,
        description: data.description,
        idType: '',
        idPromotion: '',
        avt: this.images.join(';')
      });
    });
  }

  onFileSelect(event: any): void {
    if (!event.target.files || event.target.files.length === 0) return;

    const files: FileList = event.target.files;

    if (!this.hasNewUpload) {
      this.images = [];
      this.previewImages = [];
      this.hasNewUpload = true;
    }

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

  update(): void {
    if (this.createProduct.invalid) return;

    const v = this.createProduct.value;

    const payload = {
      ...this.oldProduct,
      ...v,
      price: Number(v.price),
      idType: Number(v.idType),
      idPromotion: Number(v.idPromotion),
      avt: this.images.join(';')
    };

    this.productService.update(payload, this.id).subscribe({
      next: () => {
        this.alertService.showAlertSuccess('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/admin/listProduct']);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/listProduct']);
  }
}
