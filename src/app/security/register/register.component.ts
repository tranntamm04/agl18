import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule , RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm!: FormGroup;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [
  Validators.required,
  Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!"#$%&\'()*+,-.:;<=>?@[\\]^_`{|}~]).{6,15}$')]],
      surname: ['', Validators.required],
      name: ['', Validators.required],
      gender: [null, Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });

  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

  this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.message = 'Đăng ký thành công! Đang chuyển về trang đăng nhập...';
        this.error = '';

        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = 'Username đã tồn tại';
        } else {
          this.error = 'Đăng ký thất bại';
        }
        this.message = '';
      }
    });
  }
}
