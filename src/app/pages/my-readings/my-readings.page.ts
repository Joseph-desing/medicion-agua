import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService, Lectura } from '../../services/supabase';

@Component({
  selector: 'app-my-readings',
  templateUrl: './my-readings.page.html',
  styleUrls: ['./my-readings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MyReadingsPage implements OnInit {
  readings: Lectura[] = [];
  loading = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadReadings();
  }

  async ionViewWillEnter() {
    await this.loadReadings();
  }

  async loadReadings() {
    try {
      this.loading = true;
      const data = await this.supabase.getLecturasUsuario();
      this.readings = data || [];
      console.log('Lecturas cargadas:', this.readings);
    } catch (error) {
      console.error('Error cargando lecturas:', error);
      this.readings = [];
    } finally {
      this.loading = false;
    }
  }

  getGoogleMapsLink(lat: number, lng: number): string {
    return this.supabase.getGoogleMapsLink(lat, lng);
  }

  goToRegisterReading() {
    this.router.navigate(['/register-reading']);
  }

  async logout() {
    try {
      await this.supabase.signOut();
      this.router.navigate(['/login']);  // ⬅️ Te envía al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
