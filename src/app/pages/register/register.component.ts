import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IRegister } from '../../interfaces/IRegister';
import { RegisterService } from '../../services/auth/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Location } from '@angular/common';
import { confirmPasswordValidator, passwordValidator } from '../../utils/password';

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
    NgxMaskDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',

})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(/\s/), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    dateBirth: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator]),
    confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator])
  },);

  private registerService: RegisterService = inject(RegisterService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);

  hide1 = true;
  hide2 = true;
  constructor(private location: Location) {
  }
  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('passwordConfirmed')?.updateValueAndValidity();
    });
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

    let tag: string = '';

    if (this.route.snapshot.queryParamMap.get('tag')) {
      tag = this.route.snapshot.queryParamMap.get('tag')!;
    }

    const registerData: IRegister = {
      name: this.registerForm.value.name ?? '',
      userName: this.registerForm.value.email ?? '',
      email: this.registerForm.value.email ?? '',
      phone: this.registerForm.value.phone ?? '',
      cpf: this.registerForm.value.cpf ?? '',
      password: this.registerForm.value.password ?? "",
      passwordConfirmed: this.registerForm.value.confirmPassword ?? '',
      dateBirth: this.registerForm.value.dateBirth ? this.convertToIso8601(this.registerForm.value.dateBirth) : '',
      sellerId: 'b9c2d2b5-eeae-486c-85ea-06dd5cfe0c06',
      registeredWithTag: tag,
    };

    this.registerService.Register(registerData).subscribe({
      next: (data) => {

      },
      error: (err) => {
        const validationErrors = err.error.errors;
        let errorMessage = err?.error?.detail || err?.error?.erros || '';
        if (validationErrors) {
          errorMessage = ''; // sobrescreve para concatenar as mensagens
          for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
              const messages = validationErrors[field];
              errorMessage += `${messages.join(', ')}\n`;
            }
          }
        }

        // fallback para erro desconhecido
        if (!errorMessage) {
          errorMessage = 'Erro desconhecido.';
        }
        this.snackBar.open(errorMessage, 'Ok', {
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
      // O valor do input type="date" vem como uma string 'YYYY-MM-DD'
      let [dia, mes, ano] = [inputDate.substr(0, 2), inputDate.substr(2, 2), inputDate.substr(4, 4)]
      inputDate = `${ano}-${mes}-${dia}`;

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
