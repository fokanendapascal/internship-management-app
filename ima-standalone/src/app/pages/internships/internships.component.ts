import { Component, OnInit } from '@angular/core';
import { InternshipService } from '../../services/internship/internship-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internships',
  imports: [
    CommonModule
  ],
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css',
})
export class InternshipsComponent implements OnInit {
    internships: any[] = [];
    loading: boolean = false;
    errors: string | null = null;

    constructor(
        private internshipService: InternshipService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchInternships();
    }

    fetchInternships(): void {
        this.loading = true;
        this.errors = null;

        this.internshipService.getAllInternships().subscribe({
        next: async (response: any) => {
            let data = response;

            // Sécurité pour le format Blob (fréquent avec OpenAPI)
            if (response instanceof Blob) {
            const text = await response.text();
            data = JSON.parse(text);
            }

            // Extraction des données (selon si l'API renvoie le tableau directement ou dans .data)
            if (Array.isArray(data)) {
            this.internships = data;
            } else if (data && Array.isArray(data.data)) {
            this.internships = data.data;
            } else if (data && Array.isArray(data.body)) {
            this.internships = data.body;
            } else {
            this.internships = [];
            }
            this.loading = false;
        },
        error: (error) => {
            console.error("Erreur lors de la récupération des offres", error);
            this.errors = "Erreur lors du chargement des offres de stage.";
            this.loading = false;
        }
        });
    }

    addNewInternship(): void {
        this.router.navigate(['/internships/new']);
    }

    editInternship(id: number): void {
        this.router.navigate([`/internships/edit/${id}`]);
    }

    removeInternship(id: number): void {
        if (confirm("Êtes-vous sûr de vouloir désactiver cette offre de stage ?")) {
        this.internshipService.deactivateInternship(id).subscribe({
            next: () => this.fetchInternships(),
            error: (error) => {
            console.error("Erreur suppression", error);
            alert("Erreur lors de la suppression.");
            }
        });
        }
    }

    formatWebsiteUrl(url: string): string {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    }
}
