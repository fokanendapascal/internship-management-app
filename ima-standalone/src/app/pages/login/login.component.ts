import { Component } from '@angular/core';
import { UserLoginRequest } from '../../core/api/models';
import { AuthService } from '../../services/auth/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {

    userLoginRequest: UserLoginRequest = {
        email: '',
        password: ''
    };

    errorMessage = '';
    isLoading = false;

    sessionExpiredMessage: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ){}

    ngOnInit(): void {
        const token = localStorage.getItem('accessToken');

        if (token) {
            this.authService.getAuth().subscribe({
                next: (user) => {
                    console.log("Session active trouvée pour :", user.email);
                    this.router.navigate(['/dashboard']);
                },
                error: () => {
                    // Si le token est expiré ou invalide, on le nettoie
                    localStorage.removeItem('accessToken');
                }
            });
        }

        this.route.queryParams.subscribe(params => {
            if (params['expired']) {
                this.sessionExpiredMessage = true;
            }
        });
    }

    login(): void {

        if (!this.userLoginRequest.email || !this.userLoginRequest.password) {
            this.errorMessage = "Email et mot de passe requis";
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        // Nettoyage de l'email pour éviter les erreurs de casse/espaces
        this.userLoginRequest.email = this.userLoginRequest.email.trim().toLowerCase();

        this.authService.login(this.userLoginRequest).subscribe({
            next: async (response: any) => {
                let data = response;
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                if (data && data.accessToken) {
                    // 1. Stocker le token en PREMIER
                    localStorage.setItem('accessToken', data.accessToken);

                    // 2. Attendre un court instant ou forcer la mise à jour du contexte
                    // On récupère le profil SEULEMENT après avoir confirmé le stockage
                    this.authService.getAuth().subscribe({
                        next: (user) => {
                            localStorage.setItem('user', JSON.stringify(user));
                            this.isLoading = false;
                            this.router.navigate(['/dashboard']);
                        },
                        error: (err) => {
                            console.error("Erreur profil après login:", err);
                            // Si le profil échoue, on redirige quand même ou on gère l'erreur
                            this.errorMessage = 'Profil inexistant';
                        }
                    });
                }
            },
            error: err => {
                this.isLoading = false;
                // Gestion plus précise du message d'erreur
                if (err.status === 401 || err.status === 403) {
                    this.errorMessage = "Email ou mot de passe incorrect.";
                } else {
                    this.errorMessage = "Erreur de connexion au serveur.";
                }
                console.error("Erreur login: ", err);
            }
        });

    }

}
