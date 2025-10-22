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
import { ChatComponent } from './components/chat/chat.component';
import { IndiqueGanheComponent } from './pages/index/indique-ganhe/indique-ganhe.component';
import { unauthenticateGuard } from './guard/unauthenticate.guard';
import { ForgotPasswordComponent } from './pages/account/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/account/reset-password/reset-password.component';
import { ScratchComponent } from './pages/index/scratch/scratch.component';
import { ListScratchGamesComponent } from './pages/index/scratch/list-scratch-games/list-scratch-games.component';

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
        path: 'scratch',
        component: ListScratchGamesComponent,
      },
       {
        path: 'scratch/:scratchSellerGameId',
        component: ScratchComponent,
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
      {
        path: 'socket',
        component: ChatComponent,
      },
      {
        path: 'indicacao',
        component: IndiqueGanheComponent,
      },
    ],
  },
  {
    path: 'cadastro',
    component: RegisterComponent,
    canActivate: [unauthenticateGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthenticateGuard],
  },
    {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [unauthenticateGuard],
  },
    {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [unauthenticateGuard],
  },

];

