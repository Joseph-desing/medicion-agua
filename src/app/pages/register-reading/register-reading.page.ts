import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-register-reading',
  templateUrl: './register-reading.page.html',
  styleUrls: ['./register-reading.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterReadingPage {
  valor = '';
  observaciones = '';
  fotoMedidor = '';
  fotoCasa = '';
  lat: number | null = null;
  lng: number | null = null;
  loading = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) { }

  async obtenerGPS() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.lat = coordinates.coords.latitude;
      this.lng = coordinates.coords.longitude;
      
      const toast = await this.toastController.create({
        message: `GPS obtenido: ${this.lat.toFixed(6)}, ${this.lng.toFixed(6)}`,
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      console.error('Error al obtener GPS:', error);
      
      const toast = await this.toastController.create({
        message: 'Error al obtener ubicación GPS',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  async tomarFoto(tipo: 'medidor' | 'casa') {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar imagen',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera-outline',
          handler: () => {
            this.capturarImagen(tipo, CameraSource.Camera);
          }
        },
        {
          text: 'Elegir de galería',
          icon: 'image-outline',
          handler: () => {
            this.capturarImagen(tipo, CameraSource.Photos);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async capturarImagen(tipo: 'medidor' | 'casa', source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
        promptLabelHeader: 'Seleccionar',
        promptLabelPhoto: 'Desde Galería',
        promptLabelPicture: 'Tomar Foto'
      });

      if (tipo === 'medidor') {
        this.fotoMedidor = image.dataUrl || '';
      } else {
        this.fotoCasa = image.dataUrl || '';
      }

      const toast = await this.toastController.create({
        message: `Foto ${tipo === 'medidor' ? 'del medidor' : 'de la casa'} capturada`,
        duration: 1500,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      console.error('Error al capturar imagen:', error);
    }
  }

  async guardar() {
    if (!this.valor) {
      const toast = await this.toastController.create({
        message: 'El valor del medidor es obligatorio',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    if (!this.lat || !this.lng) {
      const toast = await this.toastController.create({
        message: 'Debes obtener la ubicación GPS primero',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.loading = true;

    try {
      let urlFotoMedidor = '';
      let urlFotoCasa = '';

      // Subir foto del medidor si existe
      if (this.fotoMedidor) {
        const blobMedidor = await (await fetch(this.fotoMedidor)).blob();
        urlFotoMedidor = await this.supabase.uploadImage(blobMedidor, `medidor_${Date.now()}.jpg`);
      }

      // Subir foto de la casa si existe
      if (this.fotoCasa) {
        const blobCasa = await (await fetch(this.fotoCasa)).blob();
        urlFotoCasa = await this.supabase.uploadImage(blobCasa, `casa_${Date.now()}.jpg`);
      }

      const lectura = {
        valor_medidor: parseFloat(this.valor),
        observacion: this.observaciones,
        latitud: this.lat,
        longitud: this.lng,
        foto_medidor: urlFotoMedidor,
        foto_fachada: urlFotoCasa
      };

      await this.supabase.createLectura(lectura);

      const toast = await this.toastController.create({
        message: '¡Lectura guardada exitosamente!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // Limpiar formulario
      this.valor = '';
      this.observaciones = '';
      this.fotoMedidor = '';
      this.fotoCasa = '';
      this.lat = null;
      this.lng = null;

      // Navegar a mis lecturas
      this.router.navigate(['/my-readings']);
    } catch (error: any) {
      console.error('Error al guardar:', error);
      
      const toast = await this.toastController.create({
        message: 'Error al guardar la lectura: ' + error.message,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.router.navigate(['/my-readings']);
  }
}