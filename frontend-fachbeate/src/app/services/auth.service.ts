import { Injectable, inject } from '@angular/core';
import { RoleService } from './role.service';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private roleService: RoleService, private router: Router) { }

  canActivate(requiredRoles: number[]): boolean{
    if(this.roleService.checkPermission(requiredRoles)){
      return true
    } else {
      //this.router.navigate(['/not-found'])
      return true;
    }
  }

}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).canActivate(route.data['requiredRoles']);
};