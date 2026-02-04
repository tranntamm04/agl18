import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RevenueService } from '../../services/revenue.service';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../interface/ProductType';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  template: `
  <div class="card p-3 mb-3">
    <div class="d-flex flex-wrap gap-2 align-items-center">
      <div>
        <div class="text-muted small">Tổng doanh thu</div>
        <div class="h4 m-0">{{ total | currency:'VND':'symbol':'1.0-0' }}</div>
      </div>
      <label>Từ <input type="date" [(ngModel)]="from"></label>
      <label>Đến <input type="date" [(ngModel)]="to"></label>
      <select [(ngModel)]="typeId">
        <option [ngValue]="null">Tất cả danh mục</option>
        <option *ngFor="let c of categories" [ngValue]="c.idType">{{ c.nameType }}</option>
      </select>
      <button (click)="apply()">Lọc</button>
    </div>
  </div>
  <div style="position:relative;height:360px">
    <canvas #revChart></canvas>
    <div *ngIf="noData" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#666">
      Không có dữ liệu
    </div>
  </div>`,
  styles: [``]
})
export class RevenueComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revChart') revChart!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();

  from = RevenueComponent.toISO(new Date(new Date().getFullYear(), 0, 1));
  to   = RevenueComponent.toISO(new Date());
  typeId: number | null = null;

  total = 0;
  categories: ProductType[] = [];
  noData = false;

  constructor(private revenue: RevenueService, private types: ProductTypeService) {}

  ngOnInit() {
    this.types.findAllProductType().pipe(takeUntil(this.destroy$)).subscribe(rs => this.categories = rs);
  }

  ngAfterViewInit() {
    const ctx = this.revChart.nativeElement.getContext('2d'); if (!ctx) return;
    const cfg: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Doanh thu', data: [] }] },
      options: { responsive: true, maintainAspectRatio: false }
    };
    this.chart = new Chart(ctx, cfg);
    this.load();
  }

  apply() { if (this.from <= this.to) this.load(); }

  private load() {
    const typeParam = this.typeId ?? undefined;
    this.revenue.summary(this.from, this.to, typeParam)
      .pipe(takeUntil(this.destroy$)).subscribe(r => this.total = r?.totalRevenue ?? 0);
    this.revenue.byType(this.from, this.to, typeParam)
      .pipe(takeUntil(this.destroy$)).subscribe(rows => {
        this.noData = rows.length === 0;
        this.updateChart(rows.map(x => x.type), rows.map(x => x.amount));
      });
  }

  private updateChart(labels: string[], data: number[]) {
    if (!this.chart) return;
    this.chart.data.labels = labels;
    (this.chart.data.datasets[0].data as number[]) = data;
    this.chart.update();
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); this.chart?.destroy(); }
  private static toISO(d: Date) { return d.toISOString().slice(0,10); }
}
