import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { authGuard } from './guard/auth.guard';
import { RoundsComponent } from './pages/index/rounds/rounds.component';
import { MyAwardsComponent } from './pages/index/my-awards/my-awards.component';
import { MyRefillsComponent } from './pages/index/my-refills/my-refills.component';
import { RoundsRealTimeComponent } from './pages/index/rounds-real-time/rounds-real-time.component';
import { WalletComponent } from './pages/index/wallet/wallet.component';
import { MyAccountComponent } from './pages/index/my-account/my-account.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { SocketComponent } from './pages/socket/socket.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: IndexComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RoundsComponent,
      },
      {
        path: 'premios',
        component: MyAwardsComponent,
      },
      {
        path: 'recargas',
        component: MyRefillsComponent,
      },
      {
        path: 'sorteio/:id',
        component: RoundsRealTimeComponent,
      },
      {
        path: 'wallet',
        component: WalletComponent,
      },
      {
        path: 'account',
        component: MyAccountComponent,
      },
    ],
  },
  {
    path: 'cadastro',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'socket',
    component: SocketComponent,
  },
];

