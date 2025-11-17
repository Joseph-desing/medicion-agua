import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';   // 👈 IMPORTANTE

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  rol: 'admin' | 'medidor' = 'medidor';
  errorMsg = '';
  loading = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService        // 👈 INYECTAR
  ) {}

  async register() {
    this.errorMsg = '';

    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;

    try {

      // 👇 AQUÍ YA SE CREA EL USUARIO Y SE INSERTA EN LA TABLA `usuarios`
      await this.supabaseService.signUp(
        this.email,
        this.password,
        this.nombre,
        this.rol
      );

      alert('Cuenta creada exitosamente');
      this.router.navigate(['/login']);

    } catch (error: any) {
      this.errorMsg = error.message || 'Error al crear la cuenta';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
