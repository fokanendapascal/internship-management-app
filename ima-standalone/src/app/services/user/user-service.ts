import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { UserRegisterRequest, UserResponse } from '../../core/api/models';
import { map, Observable } from 'rxjs';
import * as userFunctions from '../../core/api/functions';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ) {}

    /**
     * Utilise la fonction générée createUser
     */
    createUser(user: UserRegisterRequest): Observable<UserResponse> {
        return userFunctions.createUser(this.http, this.config.rootUrl, { body: user })
        .pipe(
            map(res => res.body as UserResponse) // Simplifie la réponse pour le composant
        );
    }

    /**
     * Utilise la fonction générée getUserById
     */
    getUserById(userId: number): Observable<UserResponse> {
        return userFunctions.getUserById(this.http, this.config.rootUrl, { id: userId })
        .pipe(
            map(res => res.body as UserResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllUsers
     */
    getAllUsers(): Observable<UserResponse[]> {
        return userFunctions.getAllUsers(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as UserResponse[])
        );
    }

    searchUser(keyword: string, email: string, name: string): Observable<UserResponse[]> {
        // Si la fonction générée accepte les paramètres, passez-les ici :
        return userFunctions.searchUser(this.http, this.config.rootUrl, {
            keyword: keyword,
            email: email,
            name: name
        })
        .pipe(
            map(res => res.body as UserResponse[])
        );
    }


    updateUser(userId: number, user: UserRegisterRequest): Observable<UserResponse> {
        return userFunctions.updateUser(this.http, this.config.rootUrl, { id: userId, body: user })
        .pipe(
            map(res => res.body as UserResponse )
        );
    }

    deleteUser(userId: number ): Observable<void> {
        return userFunctions.deleteUser(this.http, this.config.rootUrl, { id: userId} )
        .pipe(
            map(res => res.body as void)
        );
    }
}
