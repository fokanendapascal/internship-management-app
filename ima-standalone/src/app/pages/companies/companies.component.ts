import { Component } from '@angular/core';
import { CompanyService } from '../../services/company/company-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-companies',
  imports: [
    CommonModule
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent {

    companies: any[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor(
        private companyService: CompanyService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchCompanies();
    }

    fetchCompanies(): void {
        this.loading = true;
        this.error = null;

        this.companyService.getAllCompanies().subscribe({
        next: async (response: any) => {
            let data = response;

            // Sécurité pour le format Blob (OpenAPI)
            if (response instanceof Blob) {
            const text = await response.text();
            data = JSON.parse(text);
            }

            // Extraction du tableau de données
            if (Array.isArray(data)) {
            this.companies = data;
            } else if (data && Array.isArray(data.body)) {
            this.companies = data.body;
            } else {
            this.companies = [];
            }
            this.loading = false;
        },
        error: (err) => {
            console.error("Erreur chargement entreprises:", err);
            this.error = "Erreur lors du chargement des entreprises.";
            this.loading = false;
        }
        });
    }

    editCompany(id: number): void {
        this.router.navigate([`/companies/edit/${id}`]);
    }

    removeCompany(id: number): void {
        if (confirm("Etes-vous sûr de vouloir supprimer cette entreprise ?")) {
        this.companyService.deleteCompany(id).subscribe({
            next: () => this.fetchCompanies(),
            error: (err) => {
            console.error("Erreur suppression:", err);
            alert("Erreur lors de la suppression. Vérifiez si des données sont liées.");
            }
        });
        }
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

    // Helper pour formater l'URL du site web (identique à la logique React)
    formatWebsiteUrl(url: string): string {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    }

}
