import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { IOnlineHouseResponse } from '../../interfaces/response/bingo/IOnlineHouseResponse';
import { inject } from '@angular/core';
import { OnlineHouseService } from '../../services/online-house/online-house.service';
import { firstValueFrom } from 'rxjs';

export const onlineHouseResolver: ResolveFn<IOnlineHouseResponse> = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const onlineHouseService : OnlineHouseService = inject(OnlineHouseService);
    const hostname = window.location.hostname;



    return firstValueFrom(onlineHouseService.GetByHostname(hostname));
};
