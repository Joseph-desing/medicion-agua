import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService, Lectura } from '../../services/supabase';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminPage implements OnInit {
  readings: any[] = [];
  loading = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadAllReadings();
  }

  async ionViewWillEnter() {
    await this.loadAllReadings();
  }

  async loadAllReadings() {
    try {
      this.loading = true;
      const data = await this.supabase.getTodasLecturas();
      this.readings = data || [];
      console.log('Todas las lecturas cargadas:', this.readings);
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

  async logout() {
    try {
      await this.supabase.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}