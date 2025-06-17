import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { PunterService } from '../../../services/punter/punter.service';
import { IIndicateTagResponse } from '../../../interfaces/IIndicateTagResponse';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
  ],
  templateUrl: './indique-ganhe.component.html',
  styleUrl: './indique-ganhe.component.scss'
})
export class IndiqueGanheComponent implements OnInit {

  isCopied = false;
  private punterService: PunterService = inject(PunterService);
  indicateTag: string = '';
 steps = [
    { icon: '📋', text: 'Copie seu código acima' },
    { icon: '📤', text: 'Envie para seus amigos por onde preferir: WhatsApp, Telegram, redes sociais...' },
    { icon: '✍️', text: 'Peça para eles inserirem o código no momento do cadastro' },
    { icon: '🎉', text: 'Pronto! Assim que seu amigo completar o cadastro, os bônus serão ativados para ambos' }
  ];
  constructor() { }
 copyCode() {
  /*
    navigator.clipboard.writeText(this.indicateTag);
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
    */

  const textarea = document.createElement('textarea');
  textarea.value = this.indicateTag;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  this.isCopied = copied;
  setTimeout(() => {
    this.isCopied = false;
  }, 2000);

  }
  ngOnInit(): void {
    this.punterService.GetIndicateTag().subscribe({
      next: (data: IIndicateTagResponse) => {
        this.indicateTag = data.indicateTag;
      },
      error: (err) => {
        console.log(">> err: ", err)
      },
      complete: () => {
        console.log(">> complete: ")
      }
    })
  }


  sendWhatsApp() {
    const message = `Olá! 🎉 Venha se juntar a mim na plataforma! Use meu código de indicação: ${this.indicateTag} e ganhe bônus especiais no seu cadastro! 💰`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
