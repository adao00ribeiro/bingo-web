import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_TOKEN } from '../constants/storage.service.constants';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const tokenData = storageService.getSessionItem(STORAGE_TOKEN);
  const IsAuthentication = !!tokenData; // Transforma em um booleano (true se token existir)
   if(IsAuthentication  ){
    return true;
  }else{
    router.navigateByUrl('/login')
    return false;
  }

};
