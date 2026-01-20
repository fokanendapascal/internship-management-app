import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../core/api/models';
import { AuthService } from '../../services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        FormsModule,

    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {

    // 1. Déclarez la propriété avec son type (sans assignation immédiate)
    connectedUser$!: Observable<UserResponse | null>;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        // On récupère le flux de données déjà présent dans le service
        this.connectedUser$ = this.authService.currentUser$;
    }

    getInitials(user: UserResponse | null): string {
        if (!user) return '?';

        // On essaie de récupérer les initiales, sinon on prend l'email ou 'U'
        const first = user.firstName?.trim().charAt(0) || '';
        const last = user.lastName?.trim().charAt(0) || '';
        const initials = (first + last).toUpperCase();

        return initials.length > 0 ? initials : 'U';
    }

}
