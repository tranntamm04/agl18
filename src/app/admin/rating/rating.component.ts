import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';
import { Rating } from '../../interface/Rating';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  ratings: Rating[] = [];
  loading = false;

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings() {
    this.loading = true;
    this.ratingService.getAllRatings().subscribe({
      next: res => {
        this.ratings = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleStatus(r: Rating) {
    const newStatus = r.status === 1 ? 0 : 1;

    this.ratingService
      .updateStatus(
        r.customer.idCustomer,
        r.product.idProduct,
        newStatus
      )
      .subscribe(() => r.status = newStatus);
  }

  deleteRating(r: Rating) {
    if (!confirm('Xóa đánh giá này?')) return;

    this.ratingService
      .deleteRating(
        r.customer.idCustomer,
        r.product.idProduct
      )
      .subscribe(() => {
        this.ratings = this.ratings.filter(x => x !== r);
      });
  }
}
