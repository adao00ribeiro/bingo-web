import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,

  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form: FormGroup;

  private router: Router = inject(Router);

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  goToBack() {
    this.router.navigate(['login']); // Redireciona para a página inicial após 5 segundos

  }
  submit() {
    if (this.form.invalid) return;

    this.accountService.forgotPassword(this.form.value.email).subscribe({
      next: res => {
        //this.successMessage = res.message || 'Se este e-mail estiver registrado, você receberá um link para redefinir a senha.';
        // this.errorMessage = '';
      },
      error: err => {
        //  this.errorMessage = err.error?.message || 'Erro ao solicitar recuperação de senha';
        //this.successMessage = '';
      },
      complete: () => {
        this.router.navigate(['login']); // Redireciona para a página inicial após 5 segundos
      }
    });
  }
}
