import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { IRegister } from '../../interfaces/IRegister';
import { RegisterService } from '../../services/auth/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRegisterResponse } from '../../interfaces/response/IRegisterResponse';
import { CommonModule } from '@angular/common'; 
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Location } from '@angular/common';

// --- Validador Customizado para CPF ---
export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = control.value;

  if (!cpf) {
    return null;
  }

  // Remove caracteres não numéricos
  const cpfNumerico = cpf.replace(/\D/g, '');

  if (cpfNumerico.length !== 11 || /^(\d)\1{10}$/.test(cpfNumerico)) {
    return { cpfInvalido: true };
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfNumerico.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpfNumerico.charAt(9))) {
    return { cpfInvalido: true };
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpfNumerico.charAt(10))) {
    return { cpfInvalido: true };
  }

  return null;
}

// --- Validador Customizado para Idade  ---
export function idadeValidator(idadeMinima: number) {
  return (control: AbstractControl): ValidationErrors | null => {

    console.log(">> control.value: ", control.value)
    // Se o campo estiver vazio, deixa o validador 'required' cuidar disso
    if (!control.value) {
      return null;
    }

    // O valor do input type="date" vem como uma string 'YYYY-MM-DD'
    let [dia, mes, ano] = [control.value.substr(0, 2), control.value.substr(2, 2), control.value.substr(4, 4)]
    const dataNascimento = new Date(`${ano}-${mes}-${dia}`);
    
    // Checa se a data é válida (ex: evita datas como 31/02/2023)
    if (isNaN(dataNascimento.getTime())) {
      return { dataErro: true };
    }

    const hoje = new Date();
    
    // Checa se a data de nascimento não é no futuro
    if (dataNascimento > hoje) {
      return { dataErro: true };
    }
    
    // Calcula a data limite para ter a idade mínima
    const dataMinima = new Date(hoje.getFullYear() - idadeMinima, hoje.getMonth(), hoje.getDate());

    // Se a data de nascimento for depois da data mínima, o usuário não tem a idade necessária
    if (dataNascimento > dataMinima) {
      return { dataErro: true };
    }

    // Se passou por todas as validações, a data é válida
    return null;
  };
}

// --- Validador Customizado para Força da Senha ---
export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const errors: ValidationErrors = {};

    if (!value) {
        return null;
    }

    // Regex para verificar cada requisito
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasNumber = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);

    // Adiciona um erro específico para cada regra não cumprida
    if (!hasUpperCase) {
        errors['requiresUppercase'] = true;
    }
    if (!hasNumber) {
        errors['requiresNumber'] = true;
    }
    if (!hasSpecialChar) {
        errors['requiresSpecialChar'] = true;
    }

    // Retorna o objeto de erros se houver algum, ou null se a senha for válida
    return Object.keys(errors).length ? errors : null;
}

// Esta função recebe o FormGroup inteiro como argumento
export function  passwordsMatchValidator(form: FormGroup): ValidationErrors | null {
  // 1. Pega o valor do controle 'password'
  const senha = form.get('password')?.value;
  // 2. Pega o valor do controle 'passwordConfirmed'
  const repetirsenha = form.get('passwordConfirmed')?.value;
  // 3. Compara os dois valores.
  // Se forem iguais, retorna null (sem erro).
  // Se forem diferentes, retorna um objeto de erro.
  return senha === repetirsenha ? null : { passwordsDontMatch: true };
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',

})
export class RegisterComponent {
  registerForm: FormGroup;
  private registerService: RegisterService = inject(RegisterService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  hide1 = true;
  hide2 = true;
  constructor(private location: Location) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
      cpf: ['', [Validators.required, cpfValidator]],
      dateBirth: ['', [Validators.required, idadeValidator(18)]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
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
      this.snackBar.open("Campos invalidos, preencha novamente", 'Ok', {
        duration: 10 * 1000, // Set the duration in milliseconds
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

      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 10 * 1000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
        // Aqui você pode implementar a lógica para lidar com o erro, como exibir uma mensagem ao usuário
      },
      complete: () => {
        //console.log('Operação concluída.');
        this.router.navigate(['/login']); // Redireciona para a página de login
      }
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  get rf() {
    return this.registerForm;
  }

  goBack(): void {
    this.location.back();
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
