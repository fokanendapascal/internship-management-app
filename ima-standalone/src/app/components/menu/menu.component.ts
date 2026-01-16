import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Interface pour sécuriser la structure des données
export interface MenuItem {
    id: string;
    titre: string;
    icon: string;
    url?: string;
    sousMenu?: MenuItem[];
    ouvert?: boolean;
}

@Component({
    selector: 'app-menu',
    imports: [
        CommonModule,
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
})
export class MenuComponent {

    public menuProperties: MenuItem[] = [
        {
            id: '1',
            titre: 'Tableau de bord',
            icon: 'fa-solid fa-chart-line',
            sousMenu: [
                { id: '11', titre: "Vue d'ensemble", icon: 'fa-solid fa-chart-pie', url: '/dashboard' },
                { id: '12', titre: 'Statistiques', icon: 'fa-solid fa-chart-column', url: '/stats' }
            ],
        },
        {
            id: '2',
            titre: 'Utilisateurs',
            icon: 'fa-solid fa-users-gear',
            // Note: pas d'URL ici si on veut que seul le sous-menu gère la navigation
            sousMenu : [
                {id: '21', titre: 'Entreprises', icon: 'fa-solid fa-building', url: '/companies' },
                {id: '22', titre: 'Enseignants', icon: 'fa-solid fa-chalkboard-user', url: '/teachers' },
                {id: '23', titre: 'Étudiants', icon: 'fa-solid fa-graduation-cap', url: '/students' }
            ],
        },
        { id: '3', titre: 'Stages', icon: 'fa-solid fa-briefcase', url: '/internships' },
        { id: '4', titre: 'Candidatures', icon: 'fa-solid fa-file-signature', url: '/applications' },
        { id: '5', titre: 'Conventions', icon: 'fa-solid fa-file-contract', url: '/agreements' },
        { id: '6', titre: 'Messages', icon: 'fa-solid fa-message', url: '/messages' },
    ];

    constructor(private router : Router) {
    }

    /**
     * Méthode de navigation intelligente
     * @param item L'élément de menu cliqué
     */
    public navigate(item: MenuItem): void {
        if (item.url) {
            this.router.navigate([item.url]);
        } else if (item.sousMenu) {
            item.ouvert = !item.ouvert;
        }
    }

}
