import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private toastController: ToastController
  ) { }

  async login() {
    this.errorMsg = '';
    this.loading = true;

    console.log('🔄 Iniciando login...');

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos';
      this.loading = false;
      return;
    }

    try {
      // 1. Realizar el login
      console.log('📧 Autenticando usuario...');
      const result = await this.supabase.signIn(this.email, this.password);
      
      console.log('✅ Resultado completo del login:', result);
      console.log('✅ Usuario autenticado:', result.user);
      console.log('✅ User ID:', result.user?.id);

      // 2. Esperar múltiples intentos para obtener el perfil
      let profile = null;
      let intentos = 0;
      const maxIntentos = 5;

      while (!profile && intentos < maxIntentos) {
        intentos++;
        console.log(`🔄 Intento ${intentos} de obtener perfil...`);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        profile = this.supabase.userProfile;
        
        console.log(`📊 Perfil en intento ${intentos}:`, profile);
      }

      // 3. Si después de 5 intentos no hay perfil, algo está mal
      if (!profile) {
        console.error('❌ No se pudo cargar el perfil después de', maxIntentos, 'intentos');
        console.log('🔍 Verificando si el usuario existe en la tabla usuarios...');
        
        // Navegar de todos modos pero advertir
        const toast = await this.toastController.create({
          message: '⚠️ Bienvenido! (Perfil no cargado)',
          duration: 2000,
          color: 'warning',
          position: 'top'
        });
        await toast.present();
        
        await this.router.navigate(['/my-readings']);
        return;
      }

      // 4. Si hay perfil, mostrar bienvenida personalizada
      console.log('✅ Perfil cargado exitosamente:', profile);
      
      const toast = await this.toastController.create({
        message: `¡Bienvenido ${profile.nombre}!`,
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // 5. Navegar según el rol
      if (profile.rol === 'admin') {
        console.log('🔐 Navegando a panel de administrador...');
        await this.router.navigate(['/admin']);
      } else {
        console.log('📊 Navegando a mis lecturas...');
        await this.router.navigate(['/my-readings']);
      }

    } catch (error: any) {
      console.error('❌ Error completo en login:', error);
      console.error('❌ Mensaje de error:', error.message);
      console.error('❌ Stack trace:', error.stack);
      
      // Manejo de errores más específico
      if (error.message?.includes('Invalid login credentials')) {
        this.errorMsg = 'Email o contraseña incorrectos';
      } else if (error.message?.includes('Email not confirmed')) {
        this.errorMsg = 'Por favor confirma tu email antes de iniciar sesión';
      } else {
        this.errorMsg = error.message || 'Error al iniciar sesión. Intenta nuevamente.';
      }
      
      // Mostrar toast de error
      const toast = await this.toastController.create({
        message: this.errorMsg,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      
    } finally {
      this.loading = false;
      console.log('🏁 Proceso de login finalizado');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}