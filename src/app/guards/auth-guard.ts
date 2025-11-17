import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

export const authGuard = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  if (supabase.user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};