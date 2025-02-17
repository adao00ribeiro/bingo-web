import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const tokenData = sessionStorage.getItem('token-data');
  const IsAuthentication = !!tokenData; // Transforma em um booleano (true se token existir)
   if(IsAuthentication  ){
    return true;
  }else{
    router.navigateByUrl('/login')
    return false;
  }

};
