import { Component } from '@angular/core';
import { UserRegisterRequest } from '../../core/api/models';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-inscription',
    imports: [
        CommonModule,
        FormsModule,

    ],
    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.css',
})
export class InscriptionComponent {


    userRegisterRequest: UserRegisterRequest = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        roles: [],
        telephone: ''

    }

    errorsMsg: string[] = [];
    isLoading = false;

    constructor(
        private router: Router,
        private authService: AuthService

    ){}

    register(): void {
        this.errorsMsg = [];
        this.isLoading = true;

        this.authService.register(this.userRegisterRequest).subscribe({
            next: () => {
                this.isLoading = false;
                // Après inscription, on redirige vers le login
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                if (err.error && err.error.validationErrors) {
                    this.errorsMsg = err.error.validationErrors;
                } else {
                    this.errorsMsg.push("Une erreur est survenue lors de l'inscription.");
                }
            }
        });
    }

    login(): void {
        this.router.navigate(['/login']);
    }
}
