import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { CameraService } from '../services/camera.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, CommonModule]
})
export class Tab2Page {

  constructor(public cs: CameraService) {
    addIcons({ camera });
  }

  addPhotoToGallery() {
    this.cs.addNewToGallery();
  }
}
