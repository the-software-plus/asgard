import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon,  IonGrid, IonRow, IonCol, IonImg, CommonModule]
})
export class Tab2Page implements OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  private stream?: MediaStream;
  private burstInterval?: any;
  public photos: string[] = [];

  async ionViewDidEnter() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
    }
  }

  ionViewWillLeave() {
    this.stopBurst();
    this.stopCamera();
  }

  /** Captura quadros por 5 segundos, a cada 0.5s */
  startBurstCapture() {
    const duration = 5000;
    const intervalMs = 500;
    let elapsed = 0;
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // configura canvas com a resolução do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    this.burstInterval = setInterval(() => {
      // desenha frame e coleta dataURL
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      this.photos.unshift(dataUrl);
      elapsed += intervalMs;
      if (elapsed >= duration) this.stopBurst();
    }, intervalMs);
  }

  private stopBurst() {
    if (this.burstInterval) {
      clearInterval(this.burstInterval);
      this.burstInterval = undefined;
    }
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = undefined;
    }
  }

  ngOnDestroy() {
    this.stopBurst();
    this.stopCamera();
  }
}
