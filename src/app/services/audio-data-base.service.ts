import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioDataBaseService {
  private dbName = 'audioDatabase';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
   // this.initDatabase();
  }

  public async initDatabase(): Promise<void> {
    const dbExists = await this.checkDatabaseExists();
    if (!dbExists) {
      await this.preloadAudios();
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
      console.error("Erro ao verificar a existência do banco de dados:", error);
      return false;
    }
  }

  async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        console.log("Banco de dados deletado com sucesso.");
        resolve();
      };

      deleteRequest.onerror = (event) => {
        console.error("Erro ao deletar o banco de dados:", (event.target as any).error);
        reject((event.target as any).error);
      };
    });
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("audios")) {
          db.createObjectStore("audios", { keyPath: "url" });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    });
  }

  private async preloadAudios(): Promise<void> {
    const audioUrls: string[] = [
      '/audios/male/vendas_encerradas.mp3',
      '/audios/male/premio_acumulado.mp3',
      '/audios/male/falta1min.mp3',
      '/audios/male/falta3min.mp3',
      '/audios/male/falta5min.mp3',
      '/audios/male/falta10sec.mp3',
      '/audios/male/premio1.mp3',
      '/audios/male/premio2.mp3',
      '/audios/male/premio3.mp3'
    ];

    for (let i = 1; i <= 90; i++) {
      audioUrls.push(`/audios/male/numbers/${i}.mp3`);
    }

    for (const url of audioUrls) {
      await this.loadAndStoreAudio(url);
    }
  }

  private async loadAndStoreAudio(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const audioBlob = await response.blob();

      const db = await this.openDatabase();
      const transaction = db.transaction("audios", "readwrite");
      const store = transaction.objectStore("audios");

      store.put({ url, audioBlob });
    } catch (error) {
      console.error("Erro ao carregar ou armazenar o áudio:", error);
    }
  }

  async getAudio(url: string): Promise<string | void> {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction("audios", "readonly");
      const store = transaction.objectStore("audios");
      const request = store.get(url);

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const audioBlob = (event.target as IDBRequest).result?.audioBlob;
          if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play().catch(reject); // Play audio, reject if any error occurs.
            resolve(audioUrl); // Resolve the URL after successful fetch.
          } else {
            console.log("Nenhum áudio encontrado");
            reject("Nenhum áudio encontrado"); // Reject if no audio is found.
          }
        };

        request.onerror = () => {
          console.log("Erro ao carregar o áudio");
          reject("Erro ao carregar o áudio");
        };
      });
    } catch (error) {
      console.error("Erro ao carregar o áudio:", error);
      throw error; // Rethrow the error for any further handling
    }
  }
}
