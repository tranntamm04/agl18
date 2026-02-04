import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Profile } from '../../interface/Profile';
import { CustomerService } from '../../services/customer.service';

@Component({
  standalone: true,
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) data: Profile
  ) {
    this.form = this.fb.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.form.patchValue(data);
  }

  submit() {
    if (this.form.invalid) return;

    this.customerService.updateProfile(this.form.value as Profile)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
