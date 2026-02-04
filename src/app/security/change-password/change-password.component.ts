import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { AlertService } from '../../admin/product/alert.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  return !newPwd || !confirmPwd || newPwd === confirmPwd ? null : { passwordMismatch: true };
}

function newPasswordNotEqualOld(control: AbstractControl): ValidationErrors | null {
  const oldPwd = control.get('password')?.value;
  const newPwd = control.get('passwordGroup.newPassword')?.value;
  return !oldPwd || !newPwd || oldPwd !== newPwd ? null : { sameAsOldPassword: true };
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  isSubmit = false;
  username = '';

  readonly formChangePassword = new FormGroup(
    {
      password: new FormControl('', { nonNullable: true, validators: Validators.required }),
      passwordGroup: new FormGroup(
        {
          newPassword: new FormControl('', {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.pattern('^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&\'()*+,-.:;<=>?@[\\]^_`{|}~]).{6,15})$'),
            ],
          }),
          confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
        },
        { validators: passwordMatchValidator }
      ),
    },
    { validators: newPasswordNotEqualOld }
  );

  constructor(
    private loginService: LoginService,
    private alertService: AlertService,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.username = this.loginService.username;
    this.title.setTitle('Đổi mật khẩu');
  }

  doSubmit(): void {
    this.isSubmit = true;
    if (this.formChangePassword.invalid) return;

    const { password } = this.formChangePassword.controls;
    const { newPassword } = this.passwordGroup.controls;

    this.loginService
      .changePassword(this.username, password.value, newPassword.value)
      .subscribe({
        next: () => {
          this.alertService.showAlertSuccess('Đổi mật khẩu thành công!');
          this.router.navigateByUrl('/profile');
        },
        error: (err) => {
          if (err.status === 400) {
            this.alertService.showMessageWarning('Mật khẩu cũ không đúng!');
          } else {
            this.alertService.showMessageWarning('Có lỗi xảy ra, vui lòng thử lại!');
          }
        }
      });
  }


  get form() {
    return this.formChangePassword.controls;
  }

  get passwordGroup() {
    return this.formChangePassword.controls.passwordGroup;
  }

  get newPassword() {
    return this.passwordGroup.controls.newPassword;
  }

  get confirmPassword() {
    return this.passwordGroup.controls.confirmPassword;
  }

  cancel(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }
}
