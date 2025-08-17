import { Injectable, NgZone, signal, effect } from '@angular/core';
import { BrowserProvider, ethers, parseEther, Signer } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private provider: BrowserProvider | undefined;
  public signer = signal<Signer | undefined>(undefined);
  public network = signal<string | undefined>(undefined);
  public connectionError = signal<string | undefined>(undefined);

  constructor(private ngZone: NgZone) {
    // Initialize wallet connection automatically if wallet is available
    effect(() => {
      if (this.signer()) {
        console.log('Wallet connected:', this.signer());
      }
    });
  }

  private async initializeWalletConnection(): Promise<void> {
    if (!this.isWalletAvailable()) {
      this.connectionError.set('No wallet browser extension detected. Please install MetaMask or another compatible wallet.');
      return;
    }

    try {
      this.setProviderAndSigner();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this.ngZone.run(() => {
          if (accounts.length === 0) {
            this.handleWalletDisconnect();
          } else {
            this.handleWalletAccountsChanged();
          }
        });
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        this.ngZone.run(() => {
          this.setProviderAndSigner();
        });
      });
    } catch (error) {
      this.handleError(error, 'Failed to initialize wallet connection');
    }
  }

  private isWalletAvailable(): boolean {
    return typeof window.ethereum !== 'undefined';
  }

  private handleWalletDisconnect(): void {
    this.provider = undefined;
    this.signer.set(undefined);
    this.network.set(undefined);
    this.connectionError.set('Wallet disconnected.');
  }

  private async handleWalletAccountsChanged(): Promise<void> {
    await this.setProviderAndSigner();
  }

  private async setProviderAndSigner(): Promise<void> {
    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      const network = await this.provider.getNetwork();
      this.ngZone.run(() => {
        this.signer.set(signer);
        this.network.set(network.name);
        this.connectionError.set(undefined);
      });
    } catch (error) {
      this.handleError(error, 'Failed to set provider and signer');
    }
  }

  private handleError(error: unknown, context: string): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${context}: ${errorMessage}`);
    this.ngZone.run(() => {
      this.connectionError.set(`${context}: ${errorMessage}`);
    });
  }

  async connectToWallet(): Promise<void> {
    if (!this.isWalletAvailable()) {
      this.connectionError.set('Wallet is not installed. Please install MetaMask or another compatible wallet.');
      return;
    }

    try {
      // Request access to the user's wallet account
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await this.initializeWalletConnection();
    } catch (error) {
      this.handleError(error, 'Failed to connect to wallet');
    }
  }
    /** Retorna o saldo nativo ou de token ERC20 */
  public async getBalance(address: string, tokenAddress?: string): Promise<string> {
    if (!this.provider) throw new Error('Carteira não conectada');

    if (!tokenAddress) {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    }

    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];

    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    const balance = await contract['balanceOf'](address);
    const decimals = await contract['decimals']();
    return ethers.formatUnits(balance, decimals);
  }

  /** Retorna saldo específico de USDT */
  public async getUSDTBalance(address: string, usdtContractAddress: string): Promise<string> {
    return this.getBalance(address, usdtContractAddress);
  }
    public async getNetworkFee(tokenAddress: string | null,Address:string, amount: number): Promise<number> {
    if (!this.provider) throw new Error('Carteira não conectada');

    try {
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      let gasEstimate: bigint;

      if (!tokenAddress) {
        gasEstimate = await this.provider.estimateGas({
          to: Address,
          value: parseEther(amount.toString())
        });
      } else {
        const abi = ['function transfer(address to, uint amount) returns (bool)', 'function decimals() view returns (uint8)'];
        const contract = new ethers.Contract(tokenAddress, abi, this.provider);
        const decimals = await contract['decimals']();
        const amountBigInt = ethers.parseUnits(amount.toString(), decimals);
        gasEstimate = await contract['transfer'].estimateGas(Address, amountBigInt);
      }

      const totalCostWei = gasEstimate * gasPrice;
      return parseFloat(ethers.formatEther(totalCostWei));
    } catch (error) {
      console.warn('Erro ao estimar taxa de gas, retornando valor padrão.', error);
      return tokenAddress ? 0.001 : 0.0005;
    }
  }
    /** Verifica se a carteira está conectada */
  public isWalletConnected(): boolean {
    return !!this.provider && !!this.signer();
  }

  /** Retorna o endereço conectado */
  public async getCurrentAddress(): Promise<string | null> {
    if (!this.isWalletConnected()) return null;
     const signerInstance = this.signer();


    if (!signerInstance) {
      throw new Error("Carteira não conectada. Chame connectWallet() primeiro.");
    }
    try {
      return await signerInstance.getAddress();
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return '';
    }
  }
  public async switchNetwork(chainId: string): Promise<boolean> {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      return true;
    } catch (error) {
      console.error('Erro ao trocar rede:', error);
      return false;
    }
  }
 public async depositUSDT(destino: string, valor: number, usdtContractAddress: string): Promise<string> {
    const signerInstance = this.signer();


    if (!signerInstance) {
      throw new Error("Carteira não conectada. Chame connectWallet() primeiro.");
    }

    // ABI mínima para transferências ERC20
    const abi = [
      "function transfer(address to, uint amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];

    const contract = new ethers.Contract(usdtContractAddress, abi, signerInstance);

    // Descobre quantas casas decimais o token tem
    const decimals = await contract['decimals']();
    const amount = ethers.parseUnits(valor.toString(), decimals);

    // Cria a transação
    const tx = await contract['transfer'](destino, amount);

    console.log("Transação enviada:", tx.hash);

    // Aguarda confirmação
    const receipt = await tx.wait();
    console.log("Transação confirmada:", receipt);

    return tx.hash; // retorna o TXID para salvar no backend
  }

  public async SendBNB(destino: string, valor: number) {
    const signerInstance = this.signer();
    if (!signerInstance) {
      throw new Error("Carteira não conectada. Chame connectWallet() primeiro.");
    }
    const tx = await signerInstance.sendTransaction({
      to: destino,
      value: parseEther(valor.toString()),  // converte BNB para wei
    });

    await tx.wait();
    return tx.hash;
  }
  async disconnectWallet(): Promise<void> {
    if (this.provider) {
      // Remove event listeners to prevent memory leaks
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
      this.handleWalletDisconnect();
    }
  }
}
