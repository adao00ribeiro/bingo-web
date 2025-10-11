import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { confirmPasswordValidator, passwordValidator } from '../../../utils/password';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form: FormGroup;
  token = '';
  email = '';
  hide1 = true;
  hide2 = true;
  private snackBar: MatSnackBar = inject(MatSnackBar);
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.form = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator]),
      confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator])
    },);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }
  get f() {
    return this.form.controls;
  }
  passwordsMatch(group: FormGroup) {
    return group.get('password')!.value === group.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) {
      this.snackBar.open("Campos invalidos, preencha novamente", 'Ok', {
        duration: 10 * 1000, // Set the duration in milliseconds
        horizontalPosition: 'center', // Options: 'start', 'center', 'end'
        verticalPosition: 'bottom', // Options: 'top', 'bottom'
        panelClass: ['warning-snackbar'],
      });
      return;
    }
    this.loading = true;
    this.accountService.resetPassword(this.email, this.token, this.form.value.password).subscribe({
      next: res => {
        //this.successMessage = 'Senha redefinida com sucesso!';
        //this.errorMessage = '';

      },
      error: err => {
         const errorMessage =
          err?.error?.detail ||
          err?.error?.erros ||
          err?.error[0] ||
          err?.message ||
          'Erro desconhecido.';
        this.snackBar.open(errorMessage, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
        this.loading = false;

      },
      complete: () => {
        this.snackBar.open("Senha Redefinada com Sucesso", 'Ok', {
          duration: 150000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['sucess-snackbar'],
        });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    });
  }
}
