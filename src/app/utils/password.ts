import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password');
  const confirmPassword = control.parent?.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { 'passwordsDoNotMatch': true }
    : null;
};
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
  const hasSpecialChar = /[!+@#$%^&*(),.?":{}|<>]+/.test(value);

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
export function passwordsMatchValidator(form: FormGroup): ValidationErrors | null {
  // 1. Pega o valor do controle 'password'
  const senha = form.get('password')?.value;
  // 2. Pega o valor do controle 'passwordConfirmed'
  const repetirsenha = form.get('passwordConfirmed')?.value;
  // 3. Compara os dois valores.
  // Se forem iguais, retorna null (sem erro).
  // Se forem diferentes, retorna um objeto de erro.
  return senha === repetirsenha ? null : { passwordsDontMatch: true };
}
