import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],

})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) { }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Autenticando...',
    });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      error: async () => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'E-mail ou senha inválidos.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  loginTeste() {
    this.navCtrl.navigateRoot('/tabs', { animated: true, replaceUrl: true });

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    console.log('Navegar para cadastro');
  }

  forgotPassword() {
    console.log('Navegar para recuperação de senha');
  }
}
