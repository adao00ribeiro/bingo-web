import { Component, computed, inject } from '@angular/core';
import { PunterMeResourceService } from '../../../resource/punter/punter-me-resource.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
    protected readonly PunterMeResourceService = inject(PunterMeResourceService);


    punter = computed(()=>{
           return this.PunterMeResourceService.resource.value()
    })
  dadosPrincipais = {
    nome: 'adao correia',
    email: 'adao-eduardo@hotmail.com',
    login: 'adao00ribeiro'
  };

  dadosPessoais = {
    cpf: '093.113.239-85',
    telefone: '(44) 999246859',
    chavePix: 'N/A'
  };

  editarCampo(campo: string): void {
    // Implementação da lógica de edição
    console.log(`Editando campo: ${campo}`);
  }

  irParaCarteira(): void {
    // Implementação da navegação para a carteira
    console.log('Navegando para a carteira');
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
