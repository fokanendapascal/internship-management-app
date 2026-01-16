import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGuardService implements CanActivate {


    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable <boolean> {

        return this.authService.getAuth().pipe(
            map(user => {

                // !!user convertit l'objet en true s'il existe, false s'il est null/undefined
                if (!!user) {
                    return true;
                }

                // Redirection vers login avec l'URL de retour (optionnel mais recommandé)
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                return false;

            })
        );

    }

}
