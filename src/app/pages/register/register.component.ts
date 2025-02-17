import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {  RouterLink } from '@angular/router';
import { IRegister } from '../../interfaces/IRegister';
import { RegisterService } from '../../services/auth/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',

})
export class RegisterComponent {
  registerForm: FormGroup;
  private registerService: RegisterService = inject(RegisterService);
  private snackBar: MatSnackBar= inject(MatSnackBar);
  private router: Router= inject(Router);
  private fb: FormBuilder= inject(FormBuilder);

  constructor( ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      dateBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmed: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(form: FormGroup): null | object {
    const senha = form.get('password')?.value;
    const repetirsenha = form.get('passwordConfirmed')?.value;
    return senha === repetirsenha ? null : { passwordsDontMatch: true };
  }

  async submitRegistrar(): Promise<void> {
    if (this.registerForm.invalid) {
      this.snackBar.open("Campo Invalidos", 'Ok', {
        duration: 150000, // Set the duration in milliseconds
       horizontalPosition: 'center', // Options: 'start', 'center', 'end'
        verticalPosition: 'bottom', // Options: 'top', 'bottom'
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    const registerData: IRegister = {
      name: this.registerForm.value.name,
      userName: this.registerForm.value.email,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      cpf: this.registerForm.value.cpf,
      password: this.registerForm.value.password,
      passwordConfirmed: this.registerForm.value.passwordConfirmed,
      dateBirth: this.convertToIso8601(this.registerForm.value.dateBirth),
      sellerId: 'b9c2d2b5-eeae-486c-85ea-06dd5cfe0c06',
    };
      this.registerService.Register(registerData).subscribe({
        next: (data) => {
          console.log('Dados recebidos:', data);
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
          console.log('Operação concluída.');
          this.router.navigate(['/login']); // Redireciona para a página de login
        }
      });


  }
   convertToIso8601(inputDate: string): string {
    try {
        let date: Date;
        // Verifica o formato da data
        if (/^\d{2}-\d{2}-\d{4}$/.test(inputDate)) {
            // Formato dd-MM-yyyy
            const [day, month, year] = inputDate.split("-");
            date = new Date(`${year}-${month}-${day}`);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
            // Formato yyyy-MM-dd
            date = new Date(inputDate);
        } else {
            throw new Error("Formato de data inválido. Use 'dd-MM-yyyy' ou 'yyyy-MM-dd'.");
        }

        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            throw new Error("Data inválida após o parse.");
        }

        // Retorna a data no formato ISO 8601
        return date.toISOString();
    } catch (error) {
        // Trata erros e retorna uma mensagem clara
        return `Erro: ${(error as Error).message}`;
    }
}
}
