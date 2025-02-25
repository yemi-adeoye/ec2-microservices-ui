import { Routes } from '@angular/router';
import { CreateAccountComponent } from './components/accounts/create-account/create-account.component';
import { ListAccountComponent } from './components/accounts/list-account/list-account.component';
import { TransferComponent } from './components/accounts/transfer/transfer.component';
import { Four0fourComponent } from './components/four0four/four0four.component';
import { HomeComponent } from './components/home/home.component';
import { LogsComponent } from './components/logs/logs.component';
import { RegisterComponent } from './components/register/register.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logs', component: LogsComponent, canActivate: [authGuard], pathMatch: 'full' },
  { path: 'accounts/new', component: CreateAccountComponent, canActivate: [authGuard], pathMatch: 'full' },
  { path: 'accounts/transfers', component: TransferComponent, canActivate: [authGuard], pathMatch: 'full' },
  {
    path: 'accounts', component: ListAccountComponent, canActivate: [authGuard], pathMatch: 'full',
  },
  { path: '**', component: Four0fourComponent },
];
