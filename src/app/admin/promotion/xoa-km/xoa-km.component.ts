import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PromotionService } from '../../../services/promotion.service';
import { Promotion } from '../../../interface/Promotion';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './xoa-km.component.html'
})
export class XoaKMComponent {

  constructor(
    private promotionService: PromotionService,
    private dialogRef: MatDialogRef<XoaKMComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Promotion
  ) {}

  delete(): void {
    this.promotionService.delete(this.data.idPromotion!)
      .subscribe(() => this.dialogRef.close(true));
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
