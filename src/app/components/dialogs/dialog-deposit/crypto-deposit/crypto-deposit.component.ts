import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IDepositRequest } from '../../../../interfaces/IDepositRequest';
import { NetworksResourceService } from '../../../../resource/blockchain-network/networks-resource.service';
import { INetwork } from '../../../../interfaces/blockchain/INetwork';
import { IToken } from '../../../../interfaces/blockchain/IToken';

@Component({
  selector: 'app-crypto-deposit',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    MatCardModule,
    MatCardContent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './crypto-deposit.component.html',
  styleUrl: './crypto-deposit.component.scss'
})
export class CryptoDepositComponent {
  @Output() depositChange = new EventEmitter<IDepositRequest>();
  private readonly netwrokResourceService = inject(NetworksResourceService);

  cryptoForm: FormGroup;
  networks = signal<INetwork[]>([]);
  availableTokens: IToken[] = [];
  realValue: number = 0;

  constructor(private fb: FormBuilder) {
    this.cryptoForm = this.fb.group({
      network: ['', Validators.required],
      token: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.00000001)]]
    });

    effect(() => {
      const networks1 = this.netwrokResourceService.resource.value()?.items;
      if (networks1) {
        this.networks.set(networks1);
      }
    });
  }

  get selectedNetworkLabel(): string | undefined {
    const networkValue = this.cryptoForm.get('network')?.value;
    return this.networks().find(n => n.id === networkValue)?.name;
  }

  ngOnInit(): void {
    this.cryptoForm.get('network')?.valueChanges.subscribe(networkId => {
      // Find the selected network and get its tokens
      const selectedNetwork = this.networks().find(n => n.id === networkId);
      this.availableTokens = selectedNetwork?.tokenAddresses?.map(ta => ta.token) || [];

      // Reset token and amount when network changes
      this.cryptoForm.patchValue({ token: '', amount: '' });
      this.realValue = 0;
    });

    this.cryptoForm.valueChanges.subscribe(() => {
      this.calculateRealValue();
    });
  }

  calculateRealValue(): void {
    const { network, token, amount } = this.cryptoForm.value;
    console.log('Calculating real value:', { network, token, amount, availableTokens: this.availableTokens });

    if (network && token && amount && this.availableTokens.length) {
      const selectedToken = this.availableTokens.find(t => t.symbol === token);
      console.log('Selected token:', selectedToken);

      if (selectedToken) {
        // Se o token tem preço, calcula o valor real
        if (selectedToken.price && selectedToken.price > 0) {
          this.realValue = amount * selectedToken.price;
        } else {
          // Se não tem preço, assume valor 1 para mostrar o resumo
          // Você pode ajustar esta lógica conforme necessário
          this.realValue = amount;
        }
        console.log('Real value calculated:', this.realValue);
      } else {
        this.realValue = 0;
      }
    } else {
      this.realValue = 0;
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  emitDeposit() {
    if (this.cryptoForm.valid) {
      const { network, token, amount } = this.cryptoForm.value;
      const selectedNetwork = this.networks().find(n => n.id === network);
      const selectedToken = this.availableTokens.find(t => t.symbol === token);
      const tokenAddress = selectedNetwork?.tokenAddresses?.find(ta => ta.token.symbol === token);

      this.depositChange.emit({
        network: network,
        token: selectedToken?.id,
        address: tokenAddress?.contractAddress,
        amount: Number(amount),
        value: this.realValue
      });
    }
  }
}
