import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, computed, effect, inject, Input, OnDestroy, OnInit, signal, Signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonMenuComponent } from '../../components/button-menu/button-menu.component';
import { IPunter } from '../../interfaces/IPunter';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { MatDialog } from '@angular/material/dialog';
import { DialogDepositComponent } from '../../components/dialogs/dialog-deposit/dialog-deposit.component';
import { SocketService } from '../../services/socket/socket.service';
import { PunterMeResourceService } from '../../resource/punter/punter-me-resource.service';
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '../../constants/storage.service.constants';
import { ThemeService } from '../../services/theme.service';
import { DialogQrcodeComponent } from '../../components/dialogs/dialog-qrcode/dialog-qrcode.component';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, ButtonMenuComponent, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, CurrencyPipe],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',

})
export class IndexComponent implements OnInit {
  @ViewChild('snav') sidenav!: MatSidenav; // Referência ao MatSidenav
  isSidenavOpen = false;
  showFiller = true;
  mobileQuery: MediaQueryList;
  private router: Router = inject(Router);
  private socketService: SocketService = inject(SocketService)
  protected readonly themeService = inject(ThemeService);

  readonly dialog = inject(MatDialog);
  private _mobileQueryListener: () => void;
  isVisible: boolean = false;

  protected readonly PunterMeResourceService = inject(PunterMeResourceService);

  user = signal<IPunter | undefined>(undefined);
  lastBalance: number | null = null;

  total_credit = computed(() => {
    const userData = this.user(); // Supondo que user seja um `ref` ou `computed`
    return userData ? (userData.balance + userData.prizeBalance) : 0;
  })

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.socketService.connect();
    effect(() => {
      this.user.set(this.PunterMeResourceService.resource.value());
      if (this.socketService.IsConnected() && this.user() != null) {
        console.log(this.user()?.seller.rooms[0].id)
        this.socketService.subscribeToChannel(`room_${this.user()?.seller.rooms[0].id}`);
        this.socketService.subscribeToChannel(`chat_room_${this.user()?.seller.rooms[0].id}`);
        this.socketService.subscribeToChannel(`cash_box_${this.user()?.id}`);
      }
    })

    effect(() => {
      const cashBoxmessage = this.socketService.CashBoxLastMessage();

      if (!cashBoxmessage || !this.user() || cashBoxmessage.punterId !== this.user()?.id) return;
      // Só recarrega se o saldo mudou
      if (cashBoxmessage.balance !== this.lastBalance) {
        this.lastBalance = cashBoxmessage.balance;
        this.PunterMeResourceService.reload();
      }
    })


  }
  ngOnInit(): void {
    this.PunterMeResourceService.reload();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  handleClick(route: string, sidenav?: MatSidenav) {
    this.router.navigate([route]);

    if (this.mobileQuery.matches && sidenav) {
      this.toggleSidenav()
    }
  }
  handleVisibity() {
    this.isVisible = !this.isVisible;
  }
  deposit() {
    this.dialog.open(DialogDepositComponent, {
      disableClose: true,
      data: {

      },
    });
  }
  wallet() {
    this.router.navigate(['/wallet']);
  }
  myAccount() {
    this.router.navigate(['/account']);
  }
  logout() {
    // Limpa o token de autenticação do sessionStorage
    sessionStorage.removeItem(STORAGE_TOKEN);
    sessionStorage.removeItem(STORAGE_REFRESH_TOKEN);

    // Opcional: Limpa outros dados relacionados ao usuário, se necessário
    // this.userService.clearUser(); // Certifique-se de ter um método na UserService para limpar o estado do usuário

    // Redireciona para a página de login
    this.router.navigate(['/login']);
  }
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenav.toggle(); // Alterna o estado do sidenav
  }

  closeSidenav() {
    this.isSidenavOpen = false;
    this.sidenav.close(); // Fecha o sidenav
  }

  openSidenav() {
    this.isSidenavOpen = true;
    this.sidenav.open(); // Abre o sidenav
  }


}
