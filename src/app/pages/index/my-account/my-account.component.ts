import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PunterService } from '../../../services/punter/punter.service';
import { IPunterPatchRequestDto } from '../../../interfaces/request/IPunterPatchRequestDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogInactivateAccountComponent } from '../../../components/dialogs/dialog-inactivate-account/dialog-inactivate-account.component';
import { PunterMeResource } from '../../../resource/punter/punter-me.resource';



@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent implements OnInit {
  form: FormGroup;
  isEditing: { [key in keyof IPunterPatchRequestDto]: boolean } = {
    name: false,
    cpf: false,
    phone: false,
  };
 readonly dialog = inject(MatDialog);
  private router: Router = inject(Router);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private punterService: PunterService = inject(PunterService);
  protected readonly PunterMeResource = inject(PunterMeResource);

  punter = computed(() => {
    return this.PunterMeResource.resource.value();
  });

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      cpf: ['', Validators.required],
      phone: ['', Validators.required],
      chavePix: [''],
    });

    effect(() => {
      let me = this.PunterMeResource.resource.value();
      this.form.patchValue({
        name: me?.name,
        email: me?.user.email,
        cpf: me?.cpf,
        phone: me?.user.phoneNumber,
        chavePix: me?.cpf,
      });
    });
  }

  ngOnInit(): void {
    this.PunterMeResource.reload();
  }

  editarCampo(campo: keyof IPunterPatchRequestDto): void {
    this.isEditing[campo] = true;
  }

  salvarCampo(campo: keyof IPunterPatchRequestDto): void {

    if (!this.form.valid) {
      return;
    }

    const valorAtualizado = this.form.get(campo)?.value;

    const data: IPunterPatchRequestDto = {
      [campo]: valorAtualizado,
    };

    this.punterService.Update(data).subscribe({
      next: () => {
        this.PunterMeResource.resource.reload();
      },
      error: (err) => {
        const validationErrors = err.error.errors;
        let errorMessage = err?.error?.detail || err?.error?.erros || '';
        if (validationErrors) {
          errorMessage = '';
          for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
              const messages = validationErrors[field];
              errorMessage += `${messages.join(', ')}\n`;
            }
          }
        }
        if (!errorMessage) {
          errorMessage = 'Erro desconhecido.';
        }

        this.snackBar.open(errorMessage, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
      },
      complete: () => {
        this.snackBar.open(`Atualizado com sucesso`, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['sucess-snackbar'],
        });
        this.isEditing[campo] = false;
      },
    });
  }

  cancelarEdicao(campo: keyof IPunterPatchRequestDto): void {
    this.isEditing[campo] = false;
    const me = this.PunterMeResource.resource.value();

    const valoresOriginais: Partial<IPunterPatchRequestDto> = {
      name: me?.name,
      phone: me?.user.phoneNumber,
      cpf: me?.cpf,
    };

    this.form.patchValue({ [campo]: valoresOriginais[campo] });
  }

  irParaCarteira(): void {
    this.router.navigate(['/wallet']);
  }

  redefinirSenha(): void {
    console.log('Redefinindo senha');
  }

  inativarConta(): void {
   this.dialog.open(DialogInactivateAccountComponent, {
      data: { },
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms'
    });
  }

  logout(): void {
    console.log('Realizando logout');
  }
}
