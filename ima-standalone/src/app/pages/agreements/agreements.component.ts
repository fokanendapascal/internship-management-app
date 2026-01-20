import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserStyleService } from '../../services/user/user-style-service';
import { Router } from '@angular/router';
import { AgreementService } from '../../services/agreement/agreement-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agreements',
  imports: [
    CommonModule,
    FormsModule

  ],
  templateUrl: './agreements.component.html',
  styleUrl: './agreements.component.css',
})
export class AgreementsComponent implements OnInit {
    agreements: any[] = [];
    loading: boolean = false;
    errors: string | null = null;
    statusFilter: string = 'ALL';

    constructor(
        private agreementService: AgreementService,
        private router: Router,
        public styleService: UserStyleService // Injecté en public pour l'utiliser dans le HTML
    ) {}

    ngOnInit(): void {
        this.fetchAgreements();
    }

    fetchAgreements(): void {
        this.loading = true;
        this.errors = null;

        this.agreementService.getAllAgreements().subscribe({
        next: async (response: any) => {
            let data = response;

            // Sécurité pour le format Blob (OpenAPI)
            if (response instanceof Blob) {
            const text = await response.text();
            data = JSON.parse(text);
            }

            // Extraction du tableau
            if (Array.isArray(data)) {
            this.agreements = data;
            } else if (data && Array.isArray(data.body)) {
            this.agreements = data.body;
            } else if (data && Array.isArray(data.data)) {
            this.agreements = data.data;
            } else {
            this.agreements = [];
            }
            this.loading = false;
        },
        error: (error) => {
            console.error("Erreur lors de la récupération des conventions", error);
            this.errors = "Erreur lors du chargement des conventions.";
            this.loading = false;
        }
        });
    }

    // Logique de filtrage réactive
    get filteredAgreements() {
        if (this.statusFilter === 'ALL') {
        return this.agreements;
        }
        return this.agreements.filter(agreement => agreement.status === this.statusFilter);
    }

    addNewAgreement(): void {
        this.router.navigate(['/agreements/new']);
    }

    editAgreement(id: number): void {
        this.router.navigate([`/agreements/edit/${id}`]);
    }

    removeAgreement(id: number): void {
        if (confirm("Êtes-vous sûr de vouloir désactiver cette convention?")) {
        this.agreementService.deleteAgreement(id).subscribe({
            next: () => this.fetchAgreements(),
            error: (error) => {
            console.error("Erreur suppression", error);
            alert("Erreur lors de la suppression.");
            }
        });
        }
    }
}
