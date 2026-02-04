import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from '../../services/login.service';
import { AlertService } from '../../admin/product/alert.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  isOpenToast = false;
  isSubmit = false;

  formLogin = new FormGroup({
    userName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true })
  });

  constructor(
    private loginService: LoginService,
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService,
    private cartService: CartService
  ) {}

  get userNameCtrl() { return this.formLogin.controls.userName; }
  get passwordCtrl() { return this.formLogin.controls.password; }
  get rememberMeCtrl() { return this.formLogin.controls.rememberMe; }

  ngOnInit(): void {
    this.titleService.setTitle('Đăng nhập');
    
    this.focusUserName();
  }

  focusUserName(): void {
    this.usernameInput?.nativeElement.focus();
  }

  hideToast(): void {
    this.isOpenToast = false;
  }

  doSubmit(): void {
    this.isSubmit = true;
    if (this.formLogin.invalid) return;

    this.isOpenToast = false;
    this.login();
  }

  private login(): void {
    const { userName, password } = this.formLogin.getRawValue();
    this.loginService.login(userName, password).subscribe({
      next: (res) => {
        if (!res?.token || !res?.role) {
          this.isOpenToast = true;
          this.focusUserName();
          return;
        }
        this.loginService.saveAuth(res.token, res.role, res.userName);

        if (this.rememberMeCtrl.value) {
          localStorage.setItem('username', res.userName);
        } else {
          localStorage.removeItem('username');
        }

        if (res.role === 'ROLE_ADMIN') {
          this.alertService.showAlertSuccess('Chào mừng ADMIN!');
          this.router.navigateByUrl('/admin/chart');
        } else {
          this.alertService.showAlertSuccess(`Chào mừng ${res.userName}!`);
          this.router.navigateByUrl('/');
        }
      },
      error: () => {
        this.isOpenToast = true;
        this.focusUserName();
      }
    });
  }


  showMessage(message: string, mode: number): MatDialogRef<any> {
    return this.dialog.open<any>(null as any, {
      disableClose: true,
      autoFocus: false,
      width: '33%',
      position: { top: '5%' },
      data: { message, mode }
    });
  }
}
