import { Component, inject } from '@angular/core';
import { InputMaskComponent } from '../../components/ui/input-mask/input-mask.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {  RouterLink, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILoginRequest } from '../../interfaces/ILoginRequest';
import { timer } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputMaskComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',

})
export class LoginComponent {
  loginForm: FormGroup;
  private loginService: LoginService = inject(LoginService);
  private snackBar: MatSnackBar= inject(MatSnackBar);
  private router: Router= inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      this.snackBar.open("Campo Invalidos", 'Ok', {
        duration: 150000, // Set the duration in milliseconds
       horizontalPosition: 'center', // Options: 'start', 'center', 'end'
        verticalPosition: 'bottom', // Options: 'top', 'bottom'
        panelClass: ['warning-snackbar'],
      });
      return;
    }
  const loginRequest: ILoginRequest = {
      Email: this.loginForm.value.email,
      Password: this.loginForm.value.password,
    };
    this.loginService.Login(loginRequest).subscribe({
      next: (data) => {
        if(data.accessToken){
          sessionStorage.setItem("token-data",data.accessToken)
        }
      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000, // Set the duration in milliseconds
         horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
        // Aqui você pode implementar a lógica para lidar com o erro, como exibir uma mensagem ao usuário
      },
      complete: () => {
        this.snackBar.open("Logado com sucesso", 'Ok', {
          duration: 5000, // Set the duration in milliseconds
         horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: ['sucess-snackbar'],
        });
          this.router.navigate(['/']); // Redireciona para a página inicial após 5 segundos
      }
    });

  }
}
