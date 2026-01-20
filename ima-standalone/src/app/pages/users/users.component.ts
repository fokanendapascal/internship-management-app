import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user-service';
import { Router } from '@angular/router';
import { UserStyleService } from '../../services/user/user-style-service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-users',
    imports: [
        CommonModule,
        
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {

    users: any[] = [];
    loading: boolean = false;
    error: string | null = null;

    // Injection des dépendances
    constructor(
        private userService: UserService,
        private router: Router,
        private userStyleService: UserStyleService
    ) {}

    // Équivalent de useEffect(() => { fetchUsers() }, [])
    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers(): void {
        this.loading = true;
        this.error = null;
        this.userService.getAllUsers().subscribe({
            next: async(response: any) => {

                let data = response;

                // Si c'est un Blob, on doit le convertir en texte puis en JSON
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if(Array.isArray(data)){
                    this.users = data;
                }else if (data && Array.isArray(data.body)) {
                    this.users = data.body;
                } else {
                    this.users = [];
                }
                this.loading = false;
            },
            error: (err) => {
                console.error("Erreur lors de la récupération:", err);
                this.error = "Erreur lors du chargement des utilisateurs. Veuillez vérifier vos permissions.";
                this.loading = false;
            }
        });
    }

    addNewUser(): void {
        this.router.navigate(['/users/add']);
    }

    editUser(id: number): void {
        this.router.navigate([`/users/edit/${id}`]);
    }

    removeUser(id: number): void {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            this.loading = true;
            this.userService.deleteUser(id).subscribe({
                next: () => {
                alert(`Utilisateur avec l'ID ${id} supprimé avec succès.`);
                this.fetchUsers();
                },
                error: (err) => {
                console.error("Erreur lors de la suppression:", err);
                this.error = "Erreur lors de la suppression. L'utilisateur pourrait avoir des données liées.";
                this.loading = false;
                }
            });
        }
    }

    goToSpecialization(user: any): void {
        if (user.roles.includes('STUDENT')) {
        this.router.navigate([`/students/new/${user.id}`]);
        } else if (user.roles.includes('TEACHER')) {
        this.router.navigate([`/teachers/new/${user.id}`]);
        } else if (user.roles.includes('COMPANY')) {
        this.router.navigate([`/companies/new/${user.id}`]);
        } else {
        alert("Aucune spécialisation disponible.");
        }
    }

    // Helpers pour le template
    getRoleBadgeClass(role: string): string {
        return this.userStyleService.getRoleColor(role);
    }

    getFormattedRole(role: string): string {
        return this.userStyleService.formatRole(role);
    }

    hasSpecialRole(roles: string[]): boolean {
        return roles.some(r => ['STUDENT', 'TEACHER', 'COMPANY'].includes(r));
    }

}
