// src/app/tab3/tab3.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router para navegação
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton,
  ToastController, NavController // NavController para navegação em Tabs
} from '@ionic/angular/standalone';

// Importar addIcons e os ícones necessários
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton
  ],
})
export class Tab3Page {
  // Dados de exemplo para o perfil
  userName: string = 'Usuário Exemplo';
  userEmail: string = 'exemplo@email.com';

  constructor(
    private router: Router,
    private navCtrl: NavController, // Ionic NavController
    private toastCtrl: ToastController
    ) {
    // Registrar os ícones
    addIcons({
      'person-circle-outline': personCircleOutline,
      'log-out-outline': logOutOutline
    });

    // Simular carregamento de dados do usuário (substitua por lógica real no futuro)
    this.loadUserData();
  }

  loadUserData() {
    // No futuro, aqui você carregaria os dados de um serviço, API ou storage local
    // Por enquanto, usamos os valores padrão definidos acima.
    // Ex: this.authService.user$.subscribe(user => { /* ... */ });
  }

  async logout() {
    console.log('Ação: Sair');
    // Aqui viria a lógica real de logout (limpar tokens, chamar API de logout, etc.)

    // Simulação de logout
    const toast = await this.toastCtrl.create({
      message: 'Você foi desconectado.',
      duration: 2000,
      color: 'medium',
      position: 'top'
    });
    toast.present();

    // Redirecionar para a página de login
    // Usar NavController para navegação fora do contexto das tabs (se login não for uma tab)
    // ou se for uma navegação raiz.
    // Se '/login' for uma rota gerenciada pelo Angular Router no nível raiz:
    this.router.navigate(['/login'], { replaceUrl: true });
    // O replaceUrl: true impede que o usuário volte para a página de perfil com o botão "voltar" do navegador/dispositivo.

    // Se a página de login estiver dentro da estrutura de tabs, use:
    // this.navCtrl.navigateRoot('/tabs/login'); // Exemplo se login fosse uma tab
    // Mas geralmente a tela de login é fora da navegação principal por abas.
  }
}
