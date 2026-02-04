import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';;
import { Profile } from '../../interface/Profile';
import { EditProfileComponent } from './edit-profile.component';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, MatDialogModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile!: Profile;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.customerService.getProfile().subscribe(data => {
      this.profile = data;
    });
  }

  openEdit() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '500px',
      data: this.profile,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadProfile();
    });
  }
}
