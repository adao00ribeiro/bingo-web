import { inject, Injectable } from '@angular/core';
import { AudioDataBaseService } from './audio-data-base.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  readonly audioDataBaseService = inject(AudioDataBaseService);
  isMuted: boolean = false;
  currentAudio: HTMLAudioElement | null = null;
  audioManager: any;

  constructor() {
    this.audioManager = this.initializeAudioManager();
  }

  playNumber(number: number) {
    this.playAudioOnce(this.audioManager.numbers[number - 1]);
  }

  playSalesClosed() {
    this.playAudioOnce(this.audioManager.salesClosed);
  }

  playAccumulated() {
    this.playAudioOnce(this.audioManager.accumulated);
  }
  playFourInLine() {
    this.playAudioOnce(this.audioManager.FourInLine);
  }
  playFourCorners() {
    this.playAudioOnce(this.audioManager.FourCorners);
  }
  playSingleLine() {
    this.playAudioOnce(this.audioManager.SingleLine);
  }
  playSingleColumn() {
    this.playAudioOnce(this.audioManager.SingleColumn);
   }
  playDiagonal() {  this.playAudioOnce(this.audioManager.Diagonal); }
  playInvertedDiagonal() {  this.playAudioOnce(this.audioManager.InvertedDiagonal); }
  playDoubleLine() {   this.playAudioOnce(this.audioManager.DoubleLine);}
  playDoubleColumn() {   this.playAudioOnce(this.audioManager.DoubleColumn);}
  playFullCard() {   this.playAudioOnce(this.audioManager.FullCard);}
  playTShape() {   this.playAudioOnce(this.audioManager.TShape);}
  playXShape() {   this.playAudioOnce(this.audioManager.XShape);}
  playPlusShape() {  this.playAudioOnce(this.audioManager.PlusShape); }
  playOuterEdge() {   this.playAudioOnce(this.audioManager.OuterEdge);}

  playOneMinuteLeft() {
    this.playAudioOnce(this.audioManager.oneMinuteLeft);
  }

  playThreeMinuteLeft() {
    this.playAudioOnce(this.audioManager.threeMinuteLeft);
  }

  playFiveMinuteLeft() {
    this.playAudioOnce(this.audioManager.fiveMinuteLeft);
  }

  playTenSecondsLeft() {
    this.playAudioOnce(this.audioManager.tenSecondsLeft);
  }

  async playAudioOnce(audio: HTMLAudioElement) {
    if (this.currentAudio && !this.currentAudio.paused) {
      await this.pauseCurrentAudio();
    }

    this.currentAudio = audio;
    this.currentAudio.muted = this.isMuted;
    try {
      this.currentAudio.play();
    } catch (error) {
      console.error('Erro ao tentar reproduzir o áudio:', error);
    }

    this.currentAudio.onended = () => {
      this.currentAudio = null;
    };
  }

  pauseCurrentAudio(): Promise<void> {
    return new Promise((resolve) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onpause = () => resolve();
      } else {
        resolve();
      }
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentAudio) {
      this.currentAudio.muted = this.isMuted;
    }
  }

  private initializeAudioManager() {
    const totalAudios = 90;
    const maleAudios: any = {
      numbers: [],
      salesClosed: new Audio('/audios/male/vendas_encerradas.mp3'),
      accumulated: new Audio('/audios/male/premio_acumulado.mp3'),
      oneMinuteLeft: new Audio('/audios/male/falta1min.mp3'),
      threeMinuteLeft: new Audio('/audios/male/falta3min.mp3'),
      fiveMinuteLeft: new Audio('/audios/male/falta5min.mp3'),
      tenSecondsLeft: new Audio('/audios/male/falta10sec.mp3'),

      Diagonal: new Audio('/audios/male/prizes/Diagonal.mp3'),
      DoubleColumn: new Audio('/audios/male/prizes/DoubleColumn.mp3'),
      DoubleLine: new Audio('/audios/male/prizes/DoubleLine.mp3'),
      FourCorners: new Audio('/audios/male/prizes/FourCorners.mp3'),
      FourInLine: new Audio('/audios/male/prizes/FourInLine.mp3'),
      FullCard: new Audio('/audios/male/prizes/FullCard.mp3'),
      InvertedDiagonal: new Audio('/audios/male/prizes/InvertedDiagonal.mp3'),
      OuterEdge: new Audio('/audios/male/prizes/OuterEdge.mp3'),
      PlusShape: new Audio('/audios/male/prizes/PlusShape.mp3'),
      SingleColumn: new Audio('/audios/male/prizes/SingleColumn.mp3'),
      SingleLine: new Audio('/audios/male/prizes/SingleLine.mp3'),
      TShape: new Audio('/audios/male/prizes/TShape.mp3'),
      XShape: new Audio('/audios/male/prizes/XShape.mp3')

    };

    for (let i = 1; i <= totalAudios; i++) {
      const audio = new Audio(`/audios/male/numbers/${i}.mp3`);
      audio.preload = 'auto';
      maleAudios.numbers.push(audio);
    }

    Object.values(maleAudios).forEach((audioItem: any) => {
      if (Array.isArray(audioItem)) {
        audioItem.forEach((audio) => audio.load());
      } else {
        audioItem.load();
      }
    });

    return maleAudios;
  }
}
