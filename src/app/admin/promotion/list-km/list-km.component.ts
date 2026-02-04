import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Promotion } from '../../../interface/Promotion';
import { PromotionService } from '../../../services/promotion.service';
import { XoaKMComponent } from '../xoa-km/xoa-km.component';
import { EditKMComponent } from '../edit-km/edit-km.component';

@Component({
  selector: 'app-list-km',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './list-km.component.html',
  styleUrls: ['./list-km.component.css']
})
export class ListKMComponent implements OnInit {

  promotions: Promotion[] = [];
  displayedColumns = [
    'namePromotion',
    'typePromotion',
    'promotionalValue',
    'dateStart',
    'dateEnd',
    'status',
    'actions'
  ];

  constructor(
    private promotionService: PromotionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.promotionService.getAll().subscribe(data => {
      this.promotions = data;
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(EditKMComponent, {
      width: '500px',
      height: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  openEdit(promotion: Promotion): void {
    const dialogRef = this.dialog.open(EditKMComponent, {
      width: '500px',
      height: '450px',
      data: promotion
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  openDelete(promotion: Promotion): void {
    const dialogRef = this.dialog.open(XoaKMComponent, {
      width: '500px',
      height: '190px',
      data: promotion
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  getStatus(p: Promotion): string {
    const today = new Date();
    const start = new Date(p.dateStart);
    const end = new Date(p.dateEnd);

    if (today < start) return 'Sắp diễn ra';
    if (today > end) return 'Hết hạn';
    return 'Đang áp dụng';
  }
}
