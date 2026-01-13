// Pour rendre le texte plus joli (ex: TEACHER -> Enseignant ou Teacher)
export const formatRole = (role) => {
    switch (role) {
        case 'ADMIN': return 'Administrateur';
        case 'TEACHER': return 'Enseignant';
        case 'STUDENT': return 'Étudiant';
        case 'COMPANY': return 'Entreprise';
        case 'USER': return 'Utilisateur';
        default: return role;
    }
};

// Pour changer la couleur du badge Bootstrap selon le rôle
export const getRoleColor = (role) => {
    switch (role) {
        case 'ADMIN': return 'bg-danger';      // Rouge
        case 'TEACHER': return 'bg-primary';   // Bleu
        case 'STUDENT': return 'bg-success';   // Vert
        case 'COMPANY': return 'bg-warning text-dark'; // Jaune
        default: return 'bg-secondary';        // Gris
    }
};


export const getStatusBadge = (status) => {
    switch (status) {
        case 'VALIDATED': return 'bg-success';
        case 'PENDING_VALIDATION': return 'bg-warning text-dark';
        case 'DRAFT': return 'bg-info text-dark';
        case 'SENT_FOR_SIGNATURE': return 'bg-primary';
        case 'SIGNED': return 'bg-dark';
        case 'CANCELED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};