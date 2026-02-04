import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAuthPage = false;
  isOpen = false;
  private sub?: Subscription;
  private readonly AUTH_PATHS = ['/login'];

  constructor(
    private login: LoginService,
    private router: Router
  ) {}

  get role(): string {
    return this.login.role;
  }

  get isLoggedIn(): boolean {
    return this.login.isLoggedIn;
  }

  ngOnInit(): void {
    const setAuthPage = (url: string) =>
      (this.isAuthPage = this.AUTH_PATHS.some(p => url.startsWith(p)));

    setAuthPage(this.router.url);

    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => setAuthPage(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout(): void {
    this.login.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  closeSidebar() {
    this.isOpen = false;
  }
}
