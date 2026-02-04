import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { InfoProductComponent } from './home/info-product/info-product.component';
import { CartComponent } from './home/cart/cart.component';
import { PaymentComponent } from './home/payment/payment.component';
import { ChangePasswordComponent } from './security/change-password/change-password.component';
import { NewsComponent } from './component/news/news.component';
import { AuthGuard } from './services/AuthGuard';
import { LayoutComponent } from './component/layout.component';
import { ListKMComponent } from './admin/promotion/list-km/list-km.component';
import { ProductTypeComponent } from './admin/product-type/product-type.component';
import { ListProductComponent } from './admin/product/list-product/list-product.component';
import { CreateProductComponent } from './admin/product/create-product/create-product.component';
import { EditProductComponent } from './admin/product/edit-product/edit-product.component';
import { ListCustomerComponent } from './admin/customer/list-customer/list-customer.component';
import { CreateCustomerComponent } from './admin/customer/create-customer/create-customer.component';
import { EditCustomerComponent } from './admin/customer/edit-customer/edit-customer.component';
import { ListBillComponent } from './admin/bill/list-bill/list-bill.component';
import { ChartComponent } from './admin/bill/chart/chart.component';
import { ListEmployeeComponent } from './admin/employee/list-employee/list-employee.component';
import { CreateEmployeeComponent } from './admin/employee/create-employee/create-employee.component';
import { EditEmployeeComponent } from './admin/employee/edit-employee/edit-employee.component';
import { AdminComponent } from './admin/admin.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { ProfileComponent } from './home/profile/profile.component';
import { CustomerBillComponent } from './home/customer-bill/customer-bill.component';
import { RatingComponent } from './admin/rating/rating.component';
import { AllProductComponent } from './home/all-product/all-product.component';


const routes: Routes = [
  { path: '', component: LayoutComponent,
    children: [
        { path: '', component: HomePageComponent },
        { path: 'news', component: NewsComponent },
        { path: 'cart', component: CartComponent },
        { path: 'doncuatoi', component: CustomerBillComponent, canActivate: [AuthGuard] },
        { path: 'infoProduct/:id', component: InfoProductComponent },
        { path: 'changePass', component: ChangePasswordComponent },
        { path: 'changePass', component: ChangePasswordComponent },
        { path: 'allproduct', component: AllProductComponent },
        { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
        { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
    ]},
  { path: '',
    children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
    ]
  },
  { 
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: 'list-km', component: ListKMComponent, canActivate: [AuthGuard] },
      { path: 'product-type', component: ProductTypeComponent, canActivate: [AuthGuard] },
      { path: 'listProduct', component: ListProductComponent, canActivate: [AuthGuard] },
      { path: 'createProduct', component: CreateProductComponent, canActivate: [AuthGuard] },
      { path: 'editProduct/:id', component: EditProductComponent, canActivate: [AuthGuard] },
      { path: 'listCustomer', component: ListCustomerComponent, canActivate: [AuthGuard] },
      { path: 'createCustomer', component: CreateCustomerComponent, canActivate: [AuthGuard] },
      { path: 'editCustomer/:id', component: EditCustomerComponent, canActivate: [AuthGuard] },
      { path: 'listBill', component: ListBillComponent, canActivate: [AuthGuard] },
      { path: 'chart', component: ChartComponent, canActivate: [AuthGuard] },
      { path: 'listEmployee', component: ListEmployeeComponent, canActivate: [AuthGuard] },
      { path: 'createEmployee', component: CreateEmployeeComponent, canActivate: [AuthGuard] },
      { path: 'editEmployee/:id', component: EditEmployeeComponent, canActivate: [AuthGuard] },
      { path: 'listPromotion', component: ListKMComponent, canActivate: [AuthGuard] },
      { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
      { path: 'rating', component: RatingComponent, canActivate: [AuthGuard] }       
]},
  { path: '**', redirectTo: '' }
];

export { routes };
