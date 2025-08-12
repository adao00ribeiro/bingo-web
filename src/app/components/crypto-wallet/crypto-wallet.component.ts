import { Component } from '@angular/core';
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

  constructor(private walletService: WalletService) { }

  async connect() {
    this.address = await this.walletService.connectWallet();
    console.log(this.address)
    if (this.address) {
      const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // contrato USDT na Ethereum
      this.balance = await this.walletService.getUSDTBalance(this.address, usdtAddress);
          console.log(this.balance)
    }
  }
}
