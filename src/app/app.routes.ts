import { Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { CreateAccountComponent } from './components/accounts/create-account/create-account.component';
import { ListAccountComponent } from './components/accounts/list-account/list-account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'accounts', component: AccountsComponent, canActivate: [], children: [
      { path: 'new', component: CreateAccountComponent },
      { path: 'list', component: ListAccountComponent },
    ]
  },
];
