import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output, signal, OnInit, computed, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IDepositRequest } from '../../../../interfaces/IDepositRequest';
import { NetworksResourceService } from '../../../../resource/blockchain-network/networks-resource.service';
import { INetwork } from '../../../../interfaces/blockchain/INetwork';
import { IToken } from '../../../../interfaces/blockchain/IToken';
import { WalletService } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'app-crypto-deposit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatCardContent,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crypto-deposit.component.html',
  styleUrl: './crypto-deposit.component.scss'
})
export class CryptoDepositComponent {

  @Output() depositChange = new EventEmitter<IDepositRequest>();

  private readonly netwrokResourceService = inject(NetworksResourceService);
  protected readonly walletService = inject(WalletService);
  private readonly snackBar = inject(MatSnackBar);

  cryptoForm: FormGroup;
  networks = signal<INetwork[]>([]);
  availableTokens: IToken[] = [];
  isConnected = false;
  currentAddress: string | null = null;
  isLoading = false;
  balance: string | null = null;
  realValue: number = 0;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
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
    effect(() => {
      const state = this.walletService.walletState();
      if (state) {
        this.currentAddress = state.address
        this.isConnected = state.isConnected
      }
      console.log('Wallet state:', state);
    });
    this.cryptoForm.get('network')?.valueChanges.subscribe(Id => {
      const network = this.networks().find(n => n.id === Id);
      this.availableTokens = network ? network.tokenAddresses.map(x => x.token) : [];
      this.cryptoForm.patchValue({ token: null });
    });

    this.cryptoForm.get('token')?.valueChanges.subscribe(async token => {
      await this.loadBalance();
    });
    this.cryptoForm.get('amount')?.valueChanges.subscribe(async token => {
      this.calculateRealValue();
    });
  }
  get selectedNetworkLabel(): string | undefined {
    const networkValue = this.cryptoForm.get('network')?.value;
    return this.networks().find(n => n.id === networkValue)?.name;
  }
  async connectWallet() {
    this.isLoading = true;
    await this.walletService.connectToWallet()
    this.isLoading = true;
  }
  calculateRealValue(): void {
    const tokenId = this.cryptoForm.get('token')?.value;
    const networkId = this.cryptoForm.get('network')?.value;
    const amount = Number(this.cryptoForm.get('amount')?.value);

    // Reset valor se algum campo essencial não foi preenchido
    if (!tokenId || !networkId || !amount || !this.availableTokens.length) {
      this.realValue = 0;
      return;
    }

    const selectedToken = this.availableTokens.find(t => t.id === tokenId);

    if (!selectedToken) {
      this.realValue = 0;
      return;
    }

    // Se for BNB → busca na API Binance
    if (selectedToken.symbol === 'TBNB') {
      this.walletService.getBNBPriceBRL().subscribe({
        next: ({ price }) => {
          this.realValue = parseFloat(price) * amount;
          console.log(`[Depósito] Preço atualizado: R$ ${this.realValue.toFixed(2)}`);
        },
        error: (err) => {
          console.error('[Depósito] Erro ao buscar preço do BNB:', err);
          this.realValue = 0;
        }
      });
    } else {
      // Aqui você pode implementar lógica para outros tokens futuramente
      console.warn(`[Depósito] Token ${selectedToken.symbol} ainda não possui cálculo de preço em BRL.`);
      this.realValue = 0;
    }
  }

  async loadBalance() {
    const token = this.cryptoForm.get('token')?.value;
    const network = this.cryptoForm.get('network')?.value;
    if (!network || !token || !this.currentAddress) return;

    try {
      const selectedNetwork = this.networks().find(n => n.id === network);
      console.log(token)
      console.log(network)
      console.log(selectedNetwork?.tokenAddresses)
      const tokenAddress = selectedNetwork?.tokenAddresses?.find(ta => ta.token.id == token);

      // Se for token nativo (sem endereço de contrato)
      const contractAddress = tokenAddress?.contractAddress;


      this.balance = await this.walletService.getBalance(this.currentAddress, contractAddress);
      console.log(this.balance)
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
      this.balance = '0';
    } finally {
      //this.isLoadingBalance = false;
    }

  }
  emitDeposit() {
    const token = this.cryptoForm.get('token')?.value;
    const network = this.cryptoForm.get('network')?.value;
    const amount = this.cryptoForm.get('amount')?.value;

    if (this.cryptoForm.valid) {

      const selectedNetwork = this.networks().find(n => n.id === network);
      const selectedToken = this.availableTokens.find(t => t.symbol === token);
      const tokenAddress = selectedNetwork?.tokenAddresses?.find(ta => ta.token.symbol === token);

      this.depositChange.emit({
        network: selectedNetwork?.name,
        token: selectedToken?.name,
        amount: Number(amount),
        value: this.realValue
      });
    }
  }
}
