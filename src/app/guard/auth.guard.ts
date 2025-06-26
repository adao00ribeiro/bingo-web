import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_TOKEN } from '../constants/storage.service.constants';
import { StorageService } from '../services/storage.service';
export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
    const storageService = inject(StorageService);
    const tokenData = storageService.getSessionItem<string>(STORAGE_TOKEN);
    const IsAuthentication = !!tokenData; // Transforma em um booleano (true se token existir)
  if (IsAuthentication) {
      try {
    const decoded = jwtDecode<{ role?: string }>(tokenData);
    const allowedRoles = ["Punter"];
    if (decoded.role && allowedRoles.includes(decoded.role)) {
      return true;
    }
    router.navigateByUrl('/login');
    return false;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    router.navigateByUrl('/login');
    return false;
  }
  }else{
    router.navigateByUrl('/login');
    return false;
  }
};
