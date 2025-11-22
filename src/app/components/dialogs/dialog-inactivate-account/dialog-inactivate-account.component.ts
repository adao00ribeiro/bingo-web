import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InactivateFor30Days } from '../../../services/auth/Inactivate-for-30-days.service';
import { IDeactivateAccountRequestDto } from '../../../interfaces/request/IDeactivateAccountRequestDto';
import { IPunter } from '../../../interfaces/IPunter';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { PunterMeResource } from '../../../resource/punter/punter-me.resource';

export interface IDialogInactivateAccount {

}
@Component({
  selector: 'app-dialog-inactivate-account',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent
  ],
  templateUrl: './dialog-inactivate-account.component.html',
  styleUrl: './dialog-inactivate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInactivateAccountComponent {
  readonly dialogRef = inject(MatDialogRef<DialogInactivateAccountComponent>);
  readonly data = inject<IDialogInactivateAccount>(MAT_DIALOG_DATA);
  readonly inactivateFor30Days = inject(InactivateFor30Days);
  protected readonly punterMeResource = inject(PunterMeResource);
  readonly snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  private router: Router = inject(Router);
  private storageService: StorageService = inject(StorageService);

  user = signal<IPunter | undefined>(undefined);

  constructor() {
    effect(() => {
      this.user.set(this.punterMeResource.resource.value());
    })
  }

  handleInactivateClick() {
    const userId = this.user()?.user.id;

    if (userId == undefined) {
      return;
    }

    const request: IDeactivateAccountRequestDto = {
      userId: userId
    };
    this.inactivateFor30Days.Inactivate(request).subscribe({
      next: (data) => {

      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
      },
      complete: () => {
        this.snackBar.open("Conta Inativado por 30 dias.", 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['sucess-snackbar'],
        });
        this.storageService.clearSession();
        this.dialogRef.close();
        this.router.navigate(['/login']);
      }
    });
  }
}
