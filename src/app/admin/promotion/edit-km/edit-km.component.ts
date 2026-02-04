import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PromotionService } from '../../../services/promotion.service';
import { Promotion } from '../../../interface/Promotion';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './edit-km.component.html',
  styleUrls: ['./edit-km.component.css']
})
export class EditKMComponent {

  form = new FormGroup({
    namePromotion: new FormControl('', Validators.required),
    typePromotion: new FormControl<'PERCENT' | 'MONEY'>('PERCENT'),
    promotionalValue: new FormControl(0, [Validators.required, Validators.min(1)]),
    dateStart: new FormControl('', Validators.required),
    dateEnd: new FormControl('', Validators.required)
  });

  constructor(
    private promotionService: PromotionService,
    private dialogRef: MatDialogRef<EditKMComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Promotion | null
  ) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Promotion;

    if (this.data?.idPromotion) {
      this.promotionService.update(this.data.idPromotion, payload)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.promotionService.create(payload)
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
