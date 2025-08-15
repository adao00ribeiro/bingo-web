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
import { NetworkService } from '../../../../services/blockchain/network.service';
import { NetworksResourceService } from '../../../../resource/blockchain-network/networks-resource.service';
import { INetwork } from '../../../../interfaces/blockchain/INetwork';

interface Token {
  symbol: string;
  name: string;
  price: number;
}
@Component({
  selector: 'app-crypto-deposit',
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule, CommonModule, MatCardModule, MatCardContent, ReactiveFormsModule,
      CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatButtonModule



  ],
  templateUrl: './crypto-deposit.component.html',
  styleUrl: './crypto-deposit.component.scss'
})
export class CryptoDepositComponent {
  @Output() depositChange = new EventEmitter<IDepositRequest>();
  private readonly netwrokResourceService = inject(NetworksResourceService);

  cryptoForm: FormGroup;
  networks = signal<INetwork[]>([])

  tokens: { [key: string]: Token[] } = {
    bitcoin: [
      { symbol: 'BTC', name: 'Bitcoin', price: 150000 }
    ],
    ethereum: [
      { symbol: 'ETH', name: 'Ethereum', price: 12000 },
      { symbol: 'USDT', name: 'Tether', price: 5.20 },
      { symbol: 'USDC', name: 'USD Coin', price: 5.20 }
    ],
    bsc: [
      { symbol: 'BNB', name: 'Binance Coin', price: 1200 },
      { symbol: 'BUSD', name: 'Binance USD', price: 5.20 },
      { symbol: 'USDT', name: 'Tether', price: 5.20 }
    ],
    polygon: [
      { symbol: 'MATIC', name: 'Polygon', price: 4.50 },
      { symbol: 'USDT', name: 'Tether', price: 5.20 }
    ],
    avalanche: [
      { symbol: 'AVAX', name: 'Avalanche', price: 180 },
      { symbol: 'USDT', name: 'Tether', price: 5.20 }
    ],
    solana: [
      { symbol: 'SOL', name: 'Solana', price: 450 },
      { symbol: 'USDT', name: 'Tether', price: 5.20 }
    ]
  };

  availableTokens: Token[] = [];
  realValue: number = 0;

  constructor(private fb: FormBuilder) {
    this.cryptoForm = this.fb.group({
      network: ['', Validators.required],
      token: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.00000001)]]
    });

    effect(()=>{
      const networks1=  this.netwrokResourceService.resource.value()?.items

      if(networks1){
          this.networks.set(networks1);
      }
    })
  }
  get selectedNetworkLabel(): string | undefined {
    const networkValue = this.cryptoForm.get('network')?.value;
    return this.networks().find(n => n.name === networkValue)?.name;
  }
  ngOnInit(): void {
    this.cryptoForm.get('network')?.valueChanges.subscribe(networkValue => {
      this.availableTokens = this.tokens[networkValue] || [];
      this.cryptoForm.patchValue({ token: '', amount: '' });
      this.realValue = 0;
    });

    this.cryptoForm.valueChanges.subscribe(() => {
      this.calculateRealValue();
    });
  }

  calculateRealValue(): void {
    const { network, token, amount } = this.cryptoForm.value;
    if (network && token && amount && this.availableTokens.length) {
      const selectedToken = this.availableTokens.find(t => t.symbol === token);
      if (selectedToken) {
        this.realValue = amount * selectedToken.price;
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
      this.depositChange.emit({
        value: Number(this.cryptoForm.value.value),
      });
    }
  }
}
