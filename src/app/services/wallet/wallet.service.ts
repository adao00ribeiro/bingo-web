import { Injectable } from '@angular/core';
import { ethers, parseEther } from 'ethers';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private provider!: ethers.BrowserProvider;
  private signer!: ethers.Signer;

  /** Conecta à carteira do usuário (MetaMask) */
  public async connectWallet(): Promise<void> {
    if (!window.ethereum) {
      console.warn('MetaMask não encontrada!');
      alert('MetaMask não encontrada!');
      return ;
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);

    try {
      let accounts: string[] = await this.provider.send('eth_accounts', []);

      if (!accounts.length) {
        accounts = await this.provider.send('eth_requestAccounts', []);
      }

      if (!accounts.length) return ;

      this.signer = await this.provider.getSigner();

    } catch (error) {
      console.error('Erro ao conectar carteira:', error);

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

  /** Calcula a taxa de gas estimada para transações nativas ou ERC20 */
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
    return !!this.provider && !!this.signer;
  }

  /** Retorna o endereço conectado */
  public async getCurrentAddress(): Promise<string | null> {
    if (!this.isWalletConnected()) return null;
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return '';
    }
  }

  /** Troca de rede na carteira */
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

  /** Deposita USDT */
  public async depositUSDT(destino: string, valor: number, usdtContractAddress: string): Promise<string> {
    if (!this.signer) throw new Error('Carteira não conectada');

    const abi = ['function transfer(address to, uint amount) returns (bool)', 'function decimals() view returns (uint8)'];
    const contract = new ethers.Contract(usdtContractAddress, abi, this.signer);

    const decimals = await contract['decimals']();
    const amount = ethers.parseUnits(valor.toString(), decimals);

    const tx = await contract['transfer'](destino, amount);
    await tx.wait();

    console.log('Transação USDT confirmada:', tx.hash);
    return tx.hash;
  }

  /** Envia BNB ou ETH */
  public async sendNative(destino: string, valor: number): Promise<string> {
    if (!this.signer) throw new Error('Carteira não conectada');

    const tx = await this.signer.sendTransaction({
      to: destino,
      value: parseEther(valor.toString())
    });

    await tx.wait();
    console.log('Transação nativa confirmada:', tx.hash);
    return tx.hash;
  }
}
