import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../interface/ProductType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-type',
  imports: [ ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css'],
})
export class ProductTypeComponent implements OnInit {
  productTypes: ProductType[] = [];
  form: FormGroup;
  isEditMode = false;
  selectedProductType: ProductType | null = null;

  constructor(
    private productTypeService: ProductTypeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nameType: ['', Validators.required],
      description: [''],
      avt: [''],
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.productTypeService.findAllProductType().subscribe({
      next: (data) => (this.productTypes = data || []),
      error: (err) => console.error('Load ProductType lỗi:', err),
    });
  }

  selectProductType(pt: ProductType): void {
    this.selectedProductType = pt;
    this.isEditMode = true;

    this.form.patchValue({
      nameType: pt.nameType,
      description: pt.description,
      avt: pt.avt,
    });
  }

  cancelEdit(): void {
    this.selectedProductType = null;
    this.isEditMode = false;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) return;

    const data: ProductType = this.form.value;
    if (!this.isEditMode) {
      this.productTypeService.create(data).subscribe({
        next: (created) => {
          this.productTypes.push(created);
          this.cancelEdit();
        },
        error: (err) => console.error('Create lỗi:', err),
      });
    }
    else if (this.selectedProductType) {
      data.idType = this.selectedProductType.idType;

      this.productTypeService
        .update(data.idType!, data)
        .subscribe({
          next: (updated) => {
            const index = this.productTypes.findIndex(
              (pt) => pt.idType === updated.idType
            );
            if (index > -1) {
              this.productTypes[index] = updated;
            }
            this.cancelEdit();
          },
          error: (err) => console.error('Update lỗi:', err),
        });
    }
  }

  deleteProductType(id?: number): void {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    this.productTypeService.delete(id).subscribe({
      next: () => {
        this.productTypes = this.productTypes.filter(
          (pt) => pt.idType !== id
        );
      },
      error: (err) => console.error('Delete lỗi:', err),
    });
  }
}
