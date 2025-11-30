interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  // Adicione outros métodos se necessário
}

interface Window {
   ethereum: any;
}
