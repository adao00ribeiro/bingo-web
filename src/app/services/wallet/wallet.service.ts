import { Injectable, NgZone, signal, effect, computed } from '@angular/core';
import { BrowserProvider, ethers, parseEther, Signer, TransactionResponse } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | undefined;
  error: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private provider: BrowserProvider | undefined;

  // State signals
  public signer = signal<Signer | undefined>(undefined);
  public network = signal<string | undefined>(undefined);
  public connectionError = signal<string | undefined>(undefined);
  private address = signal<string | null>(null);

  // Computed state
  public walletState = computed<WalletState>(() => ({
    isConnected: this.isWalletConnected(),
    address: this.address(),
    network: this.network(),
    error: this.connectionError()
  }));

  constructor(private ngZone: NgZone) {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    effect(() => {
      const signer = this.signer();
      if (signer) {
        console.log('Wallet connected:', signer);
        this.updateAddress();
      }
    });
  }

  private async updateAddress(): Promise<void> {
    try {
      const signerInstance = this.signer();
      if (signerInstance) {
        const addr = await signerInstance.getAddress();
        this.address.set(addr);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      this.address.set(null);
    }
  }

  private async initializeWalletConnection(): Promise<void> {
    if (!this.isWalletAvailable()) {
      this.connectionError.set('No wallet browser extension detected. Please install MetaMask or another compatible wallet.');
      return;
    }

    try {
      await this.setProviderAndSigner();
      this.setupEventListeners();
    } catch (error) {
      this.handleError(error, 'Failed to initialize wallet connection');
    }
  }

  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Remove existing listeners to prevent duplicates
    this.removeEventListeners();

    // Listen for account changes
    window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));

    // Listen for network changes
    window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

    // Listen for disconnection
    window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
  }

  private removeEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    window.ethereum.removeListener('disconnect', this.handleDisconnect);
  }

  private handleAccountsChanged = (accounts: string[]): void => {
    this.ngZone.run(() => {
      if (accounts.length === 0) {
        this.handleWalletDisconnect();
      } else {
        this.setProviderAndSigner();
      }
    });
  };

  private handleChainChanged = (): void => {
    this.ngZone.run(() => {
      this.setProviderAndSigner();
    });
  };

  private handleDisconnect = (): void => {
    this.ngZone.run(() => {
      this.handleWalletDisconnect();
    });
  };

  private isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  private handleWalletDisconnect(): void {
    this.provider = undefined;
    this.signer.set(undefined);
    this.network.set(undefined);
    this.address.set(null);
    this.connectionError.set('Wallet disconnected.');
  }

  private async setProviderAndSigner(): Promise<void> {
    try {
      if (!this.isWalletAvailable()) {
        throw new Error('Wallet not available');
      }

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

  // Public API Methods

  public async connectToWallet(): Promise<void> {
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

  public async disconnectWallet(): Promise<void> {
    this.removeEventListeners();
    this.handleWalletDisconnect();
  }

  public isWalletConnected(): boolean {
    return !!this.provider && !!this.signer();
  }

  public getCurrentAddress(): string | null {
    return this.address();
  }

  // Balance Methods

  public async getBalance(address: string, tokenAddress?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      if (!tokenAddress) {
        // Native token balance (e.g., ETH, BNB)
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }

      // ERC20 token balance
      return await this.getERC20Balance(address, tokenAddress);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getERC20Balance(address: string, tokenAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not available');

    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];

    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    const [balance, decimals] = await Promise.all([
      contract['balanceOf'](address),
      contract['decimals']()
    ]);

    return ethers.formatUnits(balance, decimals);
  }

  public async getUSDTBalance(address: string, usdtContractAddress: string): Promise<string> {
    return this.getBalance(address, usdtContractAddress);
  }

  // Transaction Methods

  public async getNetworkFee(
    tokenAddress: string | null,
    toAddress: string,
    amount: number
  ): Promise<number> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);

      let gasEstimate: bigint;

      if (!tokenAddress) {
        // Native token transfer
        gasEstimate = await this.provider.estimateGas({
          to: toAddress,
          value: parseEther(amount.toString())
        });
      } else {
        // ERC20 token transfer
        gasEstimate = await this.estimateERC20Gas(tokenAddress, toAddress, amount);
      }

      const totalCostWei = gasEstimate * gasPrice;
      return parseFloat(ethers.formatEther(totalCostWei));
    } catch (error) {
      console.warn('Error estimating gas fee, returning default value:', error);
      return tokenAddress ? 0.001 : 0.0005; // Default fallback values
    }
  }

  private async estimateERC20Gas(
    tokenAddress: string,
    toAddress: string,
    amount: number
  ): Promise<bigint> {
    if (!this.signer()) throw new Error('Signer not available');

    const abi = [
      'function transfer(address to, uint amount) returns (bool)',
      'function decimals() view returns (uint8)'
    ];

    const contract = new ethers.Contract(tokenAddress, abi, this.signer());
    const decimals = await contract['decimals']();
    const amountBigInt = ethers.parseUnits(amount.toString(), decimals);

    return contract['transfer'].estimateGas(toAddress, amountBigInt);
  }

  public async sendERC20Token(
    tokenAddress: string,
    toAddress: string,
    amount: number
  ): Promise<string> {
    const signerInstance = this.signer();
    if (!signerInstance) {
      throw new Error("Wallet not connected. Call connectToWallet() first.");
    }

    try {
      const abi = [
        "function transfer(address to, uint amount) returns (bool)",
        "function decimals() view returns (uint8)"
      ];

      const contract = new ethers.Contract(tokenAddress, abi, signerInstance);
      const decimals = await contract['decimals']();
      const amountBigInt = ethers.parseUnits(amount.toString(), decimals);

      const tx: TransactionResponse = await contract['transfer'](toAddress, amountBigInt);
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      return tx.hash;
    } catch (error) {
      console.error('Error sending ERC20 token:', error);
      throw new Error(`Failed to send token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async depositUSDT(
    destination: string,
    amount: number,
    usdtContractAddress: string
  ): Promise<string> {
    return this.sendERC20Token(usdtContractAddress, destination, amount);
  }

  public async sendNativeToken(toAddress: string, amount: number): Promise<string> {
    const signerInstance = this.signer();
    if (!signerInstance) {
      throw new Error("Wallet not connected. Call connectToWallet() first.");
    }

    try {
      const tx: TransactionResponse = await signerInstance.sendTransaction({
        to: toAddress,
        value: parseEther(amount.toString())
      });

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      return tx.hash;
    } catch (error) {
      console.error('Error sending native token:', error);
      throw new Error(`Failed to send native token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async sendBNB(destination: string, amount: number): Promise<string> {
    return this.sendNativeToken(destination, amount);
  }

  // Network Methods

  public async switchNetwork(chainId: string): Promise<boolean> {
    if (!this.isWalletAvailable()) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  }

  public async addNetwork(networkConfig: {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    blockExplorerUrls?: string[];
  }): Promise<boolean> {
    if (!this.isWalletAvailable()) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      });
      return true;
    } catch (error) {
      console.error('Error adding network:', error);
      return false;
    }
  }
}
