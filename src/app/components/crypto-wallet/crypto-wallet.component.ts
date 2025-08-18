import { Component, effect } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';

@Component({
  selector: 'app-crypto-wallet',
  imports: [],
  templateUrl: './crypto-wallet.component.html',
  styleUrl: './crypto-wallet.component.scss'
})
export class CryptoWalletComponent {
  address: string | null = null;
  balance: string | null = null;

  constructor(private walletService: WalletService) {
    effect(() => {
      const state = this.walletService.walletState();
      if (state) {
        this.address = state.address
      }
      console.log('Wallet state:', state);
    });
  }

  async connect() {
    await this.walletService.connectToWallet();
  }
}
