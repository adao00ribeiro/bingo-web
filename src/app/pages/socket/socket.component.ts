
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonMenuComponent } from '../../components/button-menu/button-menu.component';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RoundsRealTimeComponent } from '../index/rounds-real-time/rounds-real-time.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { SocketService } from '../../services/socket/socket.service';
import { computed } from '@angular/core';

interface Notification {
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-socket',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    ButtonMenuComponent,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RoundsRealTimeComponent,
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.scss',

})
export class SocketComponent implements OnInit, OnDestroy  {

  showFiller = true;
  mobileQuery: MediaQueryList;
  private router: Router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Signals para notificações
  unreadNotifications = signal(0);
  notifications = signal<Notification[]>([]);

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public socketService: SocketService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
   // this.socketService.disconnect();
  }



  private handleNewMessage(message: any): void {
    // Incrementar contador de notificações não lidas
    this.unreadNotifications.update(count => count + 1);

    // Adicionar à lista de notificações
    this.notifications.update(current => [
      { message: JSON.stringify(message), timestamp: new Date() },
      ...current
    ]);

    // Mostrar snackbar com nova mensagem
    this.showNotification('Nova atualização recebida!');
  }

  showNotifications(): void {
    // Reset contador de não lidas
    this.unreadNotifications.set(0);

    // Mostrar dialog ou menu com notificações
    const notifs = this.notifications();
    if (notifs.length > 0) {
      // Aqui você pode implementar um dialog/menu para mostrar as notificações
      console.log('Notificações:', notifs);
    }
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  private showError(error: string): void {
    this.snackBar.open(`Erro: ${error}`, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  handleClick(route: string): void {
    this.router.navigate([route]);
  }
}
