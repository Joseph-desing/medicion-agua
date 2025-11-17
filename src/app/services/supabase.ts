import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Lectura {
  id?: string;
  usuario_id?: string;
  valor_medidor: number;
  observacion?: string;
  latitud: number;
  longitud: number;
  foto_medidor?: string;
  foto_fachada?: string;
  created_at?: string;
  usuarios?: {
    nombre: string;
    email: string;
  };
}

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'medidor';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);
  private currentUserProfile = new BehaviorSubject<Usuario | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.loadUser();

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔹 Auth state changed:', event);
      this.currentUser.next(session?.user ?? null);
      if (session?.user) {
        // Cargar perfil sin bloquear
        this.loadUserProfile(session.user.id).catch(err => 
          console.error('Error en onAuthStateChange loadProfile:', err)
        );
      } else {
        this.currentUserProfile.next(null);
      }
    });
  }

  private async loadUser() {
    const { data } = await this.supabase.auth.getSession();
    this.currentUser.next(data.session?.user ?? null);
    if (data.session?.user) {
      await this.loadUserProfile(data.session.user.id);
    }
  }

  private async loadUserProfile(userId: string) {
    try {
      console.log('🔹 Cargando perfil para usuario:', userId);
      
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('🔹 Resultado de carga de perfil:', { data, error });

      if (error) throw error;
      if (data) {
        this.currentUserProfile.next(data);
        console.log('✅ Perfil cargado exitosamente:', data);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // No lanzar el error, solo loguearlo
    }
  }

  // ============ GETTERS ============

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  get user(): User | null {
    return this.currentUser.value;
  }

  get userProfile$(): Observable<Usuario | null> {
    return this.currentUserProfile.asObservable();
  }

  get userProfile(): Usuario | null {
    return this.currentUserProfile.value;
  }

  // ============ AUTENTICACIÓN ============

  async signUp(email: string, password: string, nombre: string, rol: 'admin' | 'medidor' = 'medidor') {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en signUp:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      console.log('🔹 SupabaseService: Iniciando signInWithPassword...');
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔹 SupabaseService: Respuesta de auth:', { data, error });

      if (error) {
        console.error('🔹 SupabaseService: Error de autenticación:', error);
        throw error;
      }

      console.log('🔹 SupabaseService: Login exitoso, usuario ID:', data.user?.id);

      // CAMBIO CRÍTICO: No esperar el perfil, dejarlo cargar en background
      if (data.user) {
        console.log('🔹 SupabaseService: Iniciando carga de perfil (sin bloquear)...');
        // Cargar perfil sin await - no bloqueante
        this.loadUserProfile(data.user.id).catch(err => 
          console.error('Error cargando perfil en background:', err)
        );
      }

      console.log('🔹 SupabaseService: Retornando data del login');
      return data;
      
    } catch (error) {
      console.error('❌ SupabaseService: Error en signIn:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      this.currentUserProfile.next(null);
    } catch (error) {
      console.error('Error en signOut:', error);
      throw error;
    }
  }

  // ============ LECTURAS ============

  async createLectura(lectura: Lectura) {
    try {
      const usuario = this.user;
      if (!usuario) throw new Error('Usuario no autenticado');

      const { data, error } = await this.supabase
        .from('lecturas')
        .insert([
          {
            ...lectura,
            usuario_id: usuario.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creando lectura:', error);
      throw error;
    }
  }

  async getLecturasUsuario(usuarioId?: string) {
    try {
      const userId = usuarioId || this.user?.id;
      if (!userId) throw new Error('No hay usuario autenticado');

      const { data, error } = await this.supabase
        .from('lecturas')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo lecturas:', error);
      throw error;
    }
  }

  async getTodasLecturas() {
    try {
      const { data, error } = await this.supabase
        .from('lecturas')
        .select(`
          *,
          usuarios (
            nombre,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo todas las lecturas:', error);
      throw error;
    }
  }

  // ============ STORAGE ============

  async uploadImage(file: Blob, fileName: string): Promise<string> {
    try {
      const usuario = this.user;
      if (!usuario) throw new Error('Usuario no autenticado');

      const filePath = `${usuario.id}/${Date.now()}_${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from('lecturas-fotos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = this.supabase.storage
        .from('lecturas-fotos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  }

  // ============ UTILIDADES ============

  getGoogleMapsLink(lat: number, lng: number): string {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
}