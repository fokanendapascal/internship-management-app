import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStyleService {

    // Pour rendre le texte plus joli (ex: TEACHER -> Enseignant ou Teacher)
    formatRole = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'Administrateur';
            case 'TEACHER': return 'Enseignant';
            case 'STUDENT': return 'Étudiant';
            case 'COMPANY': return 'Entreprise';
            case 'USER': return 'Utilisateur';
            default: return role;
        }
    };


    getRoleColor(role: string): string {
        switch (role) {
        case 'ADMIN': return 'bg-danger';
        case 'TEACHER': return 'bg-primary';
        case 'STUDENT': return 'bg-success';
        case 'COMPANY': return 'bg-warning text-dark';
        default: return 'bg-secondary';
        }
    }

    getStatusBadge(status: string): string {
        switch (status) {
        case 'VALIDATED': return 'bg-success';
        case 'PENDING_VALIDATION': return 'bg-warning text-dark';
        case 'DRAFT': return 'bg-info text-dark';
        case 'SENT_FOR_SIGNATURE': return 'bg-primary';
        case 'SIGNED': return 'bg-dark';
        case 'CANCELED': return 'bg-danger';
        default: return 'bg-secondary';
        }
    }
}
