import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ethers, parseEther } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private provider!: ethers.BrowserProvider;
  private signer!: ethers.Signer;
  private url = `${environment.api}/api/v1/punter`
  private httpClient: HttpClient = inject(HttpClient);

  public async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      alert('MetaMask não encontrada!');
      return null;
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    return accounts[0]; // endereço da carteira
  }

  public async getUSDTBalance(address: string, usdtContractAddress: string): Promise<string> {
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    const contract = new ethers.Contract(usdtContractAddress, abi, this.provider);
    console.log(contract)
    const balance = await contract['balanceOf'](address);
    const decimals = await contract['decimals']();
    return ethers.formatUnits(balance, decimals);
  }

  public async depositUSDT(destino: string, valor: number, usdtContractAddress: string): Promise<string> {
    if (!this.signer) {
      throw new Error("Carteira não conectada. Chame connectWallet() primeiro.");
    }

    // ABI mínima para transferências ERC20
    const abi = [
      "function transfer(address to, uint amount) returns (bool)",
      "function decimals() view returns (uint8)"
    ];

    const contract = new ethers.Contract(usdtContractAddress, abi, this.signer);

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
    if (!this.signer) {
      throw new Error("Carteira não conectada. Chame connectWallet() primeiro.");
    }
    const tx = await this.signer.sendTransaction({
      to: destino,
      value: parseEther(valor.toString()),  // converte BNB para wei
    });

    await tx.wait();
    return tx.hash;
  }
}
