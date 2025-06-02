// src/app/tab1/tab1.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Adicionar DatePipe
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonIcon, IonButton, IonList, IonItem, IonLabel,
  IonThumbnail, IonModal, IonButtons, IonItemSliding, IonItemOptions, IonItemOption,
  AlertController, ToastController, IonListHeader // Adicionados
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { DiagnosisService, AnalysisData } from '../../services/diagnosis.service'; // Ajuste o caminho se necessário
import { ReplaceNewlinesWithBrPipe } from '../../pipes/replace-newlines.pipe'; // Importe o pipe
import {
  saveOutline, eyeOutline, closeCircleOutline, archiveOutline, chevronForwardOutline,
  trashOutline, closeOutline, leafOutline, bugOutline, documentTextOutline, medkitOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule, DatePipe, // Adicionar DatePipe
    ReplaceNewlinesWithBrPipe, // Adicionar o Pipe
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton,
    IonList, IonItem, IonLabel, IonThumbnail, IonModal, IonButtons,
    IonItemSliding, IonItemOptions, IonItemOption, IonListHeader
  ],
  providers: [DatePipe] // Adicionar DatePipe aos providers
})
export class Tab1Page implements OnInit, OnDestroy {
  public latestUnsavedAnalysis: AnalysisData | null = null;
  public savedAnalyses: AnalysisData[] = [];
  public isModalOpen = false;
  public selectedAnalysisForModal: AnalysisData | null = null;

  private latestSub!: Subscription;
  private savedSub!: Subscription;

  constructor(
    private diagnosisService: DiagnosisService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
        // Registrar os ícones que você usará neste componente
    addIcons({
      'save-outline': saveOutline,
      'eye-outline': eyeOutline,
      'close-circle-outline': closeCircleOutline,
      'archive-outline': archiveOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'trash-outline': trashOutline,
      'close-outline': closeOutline, // O ícone que estava faltando!
      'leaf-outline': leafOutline,
      'bug-outline': bugOutline,
      'document-text-outline': documentTextOutline,
      'medkit-outline': medkitOutline
    });
  }

  ngOnInit() {
    this.latestSub = this.diagnosisService.getLatestAnalysis().subscribe(data => {
      this.latestUnsavedAnalysis = data;
    });

    this.savedSub = this.diagnosisService.getSavedAnalyses().subscribe(analyses => {
      // Ordena as análises salvas pela ID (timestamp) mais recente primeiro
      this.savedAnalyses = [...analyses].sort((a, b) => b.id - a.id);
    });
  }

  ionViewWillEnter() {
    // O BehaviorSubject no serviço garante que os dados mais recentes sejam emitidos na subscrição.
    // Se você quisesse forçar uma releitura do localStorage toda vez (desnecessário com BehaviorSubject bem usado):
    // this.diagnosisService.reloadFromFileSystem(); // Método a ser criado no serviço
  }

  async saveCurrentAnalysis() {
    if (this.latestUnsavedAnalysis) {
      try {
        // O serviço já atribui um ID se necessário e limpa o latestUnsavedAnalysisSubject
        this.diagnosisService.saveAnalysis(this.latestUnsavedAnalysis);
        this.presentToast('Análise salva com sucesso na sua biblioteca!', 'success');
        // latestUnsavedAnalysis se tornará null através da subscrição, pois o serviço o limpa.
      } catch (e) {
        console.error("Erro ao salvar análise na Tab1:", e);
        this.presentToast('Falha ao salvar a análise. Tente novamente.', 'danger');
      }
    }
  }

  discardLatestAnalysis() {
    this.diagnosisService.clearAnalysis(); // Limpa a última análise não salva do serviço
    // A subscrição atualizará this.latestUnsavedAnalysis para null
    this.presentToast('Nova análise descartada.', 'medium');
  }

  viewAnalysisDetails(analysis: AnalysisData) {
    this.selectedAnalysisForModal = analysis;
    this.isModalOpen = true;
  }

  closeAnalysisModal() {
    this.isModalOpen = false;
    this.selectedAnalysisForModal = null;
  }

  async confirmDeleteAnalysis(analysisId: number, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      await slidingItem.close(); // Fecha o item deslizante antes de mostrar o alerta
    }
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir esta análise da sua biblioteca? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          cssClass: 'danger',
          handler: async () => {
            try {
              this.diagnosisService.deleteAnalysis(analysisId); // Chama o método do serviço
              this.presentToast('Análise excluída com sucesso.', 'medium');
              if (this.isModalOpen && this.selectedAnalysisForModal?.id === analysisId) {
                this.closeAnalysisModal(); // Fecha o modal se a análise aberta foi excluída
              }
            } catch (e) {
              console.error("Erro ao excluir análise:", e);
              this.presentToast('Falha ao excluir a análise.', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 2500) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  ngOnDestroy() {
    if (this.latestSub) {
      this.latestSub.unsubscribe();
    }
    if (this.savedSub) {
      this.savedSub.unsubscribe();
    }
  }
}
