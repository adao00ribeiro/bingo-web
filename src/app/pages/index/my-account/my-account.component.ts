import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { PunterMeResourceService } from '../../../resource/punter/punter-me-resource.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
  isEditing = {
    name: false,
    phoneNumber: false,
    chavePix: false,
  };
    private router: Router= inject(Router);
  protected readonly PunterMeResourceService = inject(PunterMeResourceService);

  punter = computed(() => {
    return this.PunterMeResourceService.resource.value()
  })

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      email: ['',Validators.email],
      cpf: [''],
      phoneNumber: [''],
      chavePix: [''],
    });

    effect(() => {
      let me = this.PunterMeResourceService.resource.value()
      this.form.patchValue({
      name: me?.name,
      email: me?.user.email,
      cpf: me?.cpf,
      phoneNumber: me?.user.phoneNumber,
      chavePix: me?.cpf,
      });
    })
  }
  ngOnInit(): void {
    this.PunterMeResourceService.reload();
  }

  editarCampo(campo: string): void {
    // Implementação da lógica de edição
    console.log(`Editando campo: ${campo}`);
  }

  irParaCarteira(): void {
   this.router.navigate(['/wallet']);
  }

  redefinirSenha(): void {
    // Implementação da lógica para redefinir senha
    console.log('Redefinindo senha');
  }

  inativarConta(): void {
    // Implementação da lógica para inativar conta
    console.log('Inativando conta');
  }

  logout(): void {
    // Implementação da lógica de logout
    console.log('Realizando logout');
  }


}
