import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg,
  IonRow, IonTitle, IonToolbar, IonButton, IonSpinner, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, ToastController, NavController,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { DiagnosisService, DiagnosisApiResponse, AnalysisData } from '../../services/diagnosis.service';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
    IonIcon, IonGrid, IonRow, IonCol, IonImg, IonButton, IonSpinner, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent,
  ],
})
export class Tab2Page {
  public selectedImage: Photo | null = null;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  private readonly API_ENDPOINT = environment.API_ENDPOINT;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private diagnosisService: DiagnosisService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async takePicture() {
    this.clearErrorMessage();
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Retorna URI, bom para converter para Blob
        source: CameraSource.Camera,
        saveToGallery: true, // Opcional: salva a foto na galeria do dispositivo
      });
      this.handleImageSelection(image);
    } catch (error: any) {
      console.error('Erro ao tirar foto:', error);
      // O plugin da câmera pode retornar 'USER_CANCELED' como uma string no erro se o usuário cancelar
      if (error && error.message && error.message.includes('User cancelled photos app')) {
        this.presentToast('Seleção de foto cancelada.', 'medium');
      } else if (error && error.message && error.message.includes('No camera available')) {
         this.presentToast('Nenhuma câmera disponível neste dispositivo.', 'danger');
      } else {
        this.presentToast('Não foi possível acessar a câmera.', 'danger');
      }
    }
  }


  async selectFromGallery() {
    this.clearErrorMessage();
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
      this.handleImageSelection(image);
    } catch (error) {
      console.error('Erro ao selecionar da galeria:', error);
      this.presentToast('Não foi possível acessar a galeria de fotos.', 'danger');
      this.clearErrorMessage();
    }
  }

  private handleImageSelection(image: Photo) {
    this.selectedImage = image;
    this.errorMessage = null;
    console.log('Imagem selecionada/capturada:', this.selectedImage);
  }

  async diagnosePlant() {
    if (!this.selectedImage || !this.selectedImage.webPath) {
      this.presentToast('Nenhuma imagem selecionada para diagnóstico.', 'warning');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const response = await fetch(this.selectedImage.webPath);
      const blob = await response.blob();
      const formData = new FormData();
      const fileName = `plant_image_${new Date().getTime()}.${this.selectedImage.format || 'jpg'}`;
      formData.append('file', blob, fileName);

      this.http.post<DiagnosisApiResponse>(this.API_ENDPOINT, formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('Diagnóstico recebido:', res);

          if (this.selectedImage && this.selectedImage.webPath) {
            // Salvar no serviço
            this.diagnosisService.setLatestAnalysis({
              imagePath: this.selectedImage.webPath, // webPath é seguro para exibir em <img>
              diagnosis: res,
            });
            // Navegar para Tab1
            this.navCtrl.navigateRoot('/tabs/tab1', { animated: true }); // Use NavController para tabs
            // this.router.navigate(['/tabs/tab1']); // Alternativa com Angular Router

            // Limpar estado da Tab2 após o envio bem-sucedido e navegação
            this.selectedImage = null;
          } else {
             this.presentToast('Erro ao processar imagem selecionada após diagnóstico.', 'danger');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao diagnosticar planta:', err);
          this.isLoading = false;
          if (err.error && err.error.detail) {
            this.errorMessage = `Erro da API: ${err.error.detail}`;
          } else if (err.status === 0 || err.statusText === "Unknown Error") {
            this.errorMessage = 'Não foi possível conectar à API. Verifique sua conexão ou se o servidor está online.';
          } else {
            this.errorMessage = `Ocorreu um erro (HTTP ${err.status}): ${err.message}`;
          }
          this.presentToast(this.errorMessage, 'danger', 5000);
        },
      });
    } catch (error) {
      console.error('Erro ao preparar imagem para envio:', error);
      this.isLoading = false;
      this.errorMessage = 'Ocorreu um erro ao processar a imagem antes do envio.';
      this.presentToast(this.errorMessage, 'danger');
    }
  }

  clearSelectionAndResult() {
    this.selectedImage = null;
    this.isLoading = false;
    this.errorMessage = null;
  }

  public clearErrorMessage() {
    this.errorMessage = null;
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 3000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
