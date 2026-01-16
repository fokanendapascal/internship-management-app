import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthResponse, UserLoginRequest, UserRegisterRequest, UserResponse } from '../../core/api/models';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../core/api/api-configuration';
import * as authFunctions from '../../core/api/functions';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    // 1. On crée un sujet qui stocke l'utilisateur (initialement null)
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);

    // 2. On expose ce sujet sous forme d'Observable pour les composants
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) {
        // Optionnel : Recharger l'utilisateur au démarrage si un token existe
        if (this.isAuthenticated()) {
            this.refreshUser();
        }else {
            console.warn("Aucun token trouvé, refreshUser ignoré.");
        }
    }

    /**
     * Connecte l'utilisateur et gère le stockage du token
     */
    login(authRequest: UserLoginRequest): Observable <AuthResponse> {
        // CORRECTION : On passe uniquement this.config.rootUrl
        return authFunctions.login(this.http, this.config.rootUrl, { body: authRequest })
        .pipe(
            map(res => res.body as AuthResponse),
            tap(authResponse => {
                if (authResponse.accessToken) {
                    localStorage.setItem('accessToken', authResponse.accessToken);
                    // 3. Après login, on récupère les infos user pour remplir le sujet
                    this.refreshUser();
                }
            })
        );
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    register(user: UserRegisterRequest): Observable<UserResponse> {
        return authFunctions.register(this.http, this.config.rootUrl, { body: user })
        .pipe(
            map(res => res.body as UserResponse)
        );
    }

    /**
     * Récupère l'utilisateur actuellement authentifié
     */
    getAuth(): Observable<UserResponse> {
        return authFunctions.getAuth(this.http, this.config.rootUrl, {})
        .pipe(
            // On traite le cas où la réponse est un Blob
            switchMap((res: any) => {
                const body = res.body;
                if (body instanceof Blob) {
                    return from (body.text()).pipe(
                        map(text => JSON.parse(text) as UserResponse)
                    );
                }
                return of (body as UserResponse);
            }),
            tap(user => {
                this.currentUserSubject.next(user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('accessToken');
        this.currentUserSubject.next(null); // 5. On vide l'utilisateur au logout
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    private refreshUser(): void {
        this.getAuth().subscribe({
            next: (user) => console.log("Utilisateur récupéré avec succès:", user),
            error: (err) => console.error("Échec de la récupération utilisateur:", err)
        });
    }

}
