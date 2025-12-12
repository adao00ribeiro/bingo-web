import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageDatabaseService {
  private dbName = 'imageDatabase';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    // this.initDatabase();
  }

  public async initDatabase(): Promise<void> {
    const dbExists = await this.checkDatabaseExists();
    if (!dbExists) {
      console.log("Banco não existe ainda. Nenhuma imagem será pré-carregada automaticamente.");
    }
  }

  private async checkDatabaseExists(): Promise<boolean> {
    try {
      if (!(indexedDB as any).databases) {
        console.error("indexedDB.databases() não é suportado neste navegador.");
        return false;
      }

      const databases = await (indexedDB as any).databases();
      return databases.some((db: any) => db.name === this.dbName);

    } catch (error) {
      console.error("Erro ao verificar o banco de dados:", error);
      return false;
    }
  }

  async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        console.log("Banco deletado com sucesso.");
        resolve();
      };

      deleteRequest.onerror = event => {
        console.error("Erro ao deletar o banco:", (event.target as any).error);
        reject((event.target as any).error);
      };
    });
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "url" });
        }
      };

      request.onsuccess = event => {
        this.db = (event.target as any).result;
        resolve(this.db!);
      };

      request.onerror = event => {
        reject((event.target as any).error);
      };
    });
  }

  async saveImage(url: string, blob: Blob): Promise<void> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction("images", "readwrite");
      const store = tx.objectStore("images");

      store.put({ url, blob });

      return new Promise(resolve => {
        tx.oncomplete = () => resolve();
      });

    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
    }
  }

  async loadImage(url: string): Promise<string | null> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction("images", "readonly");
      const store = tx.objectStore("images");
      const request = store.get(url);

      return new Promise((resolve, reject) => {
        request.onsuccess = (event: any) => {
          const data = event.target.result;
          if (!data?.blob) {
            return resolve(null);
          }
          resolve(URL.createObjectURL(data.blob));
        };

        request.onerror = () => reject(null);
      });

    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      return null;
    }
  }

  async preloadImage(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await this.saveImage(url, blob);
    } catch (error) {
      console.error("Erro ao pré-carregar imagem:", error);
    }
  }
}
