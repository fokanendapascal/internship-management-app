import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application/application-service';
import { Router } from '@angular/router';
import { ApplicationResponse } from '../../core/api/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
    applications: ApplicationResponse[] = [];
    loading = true;
    errors: string | null = null;
    searchTerm: string = '';

    constructor(
        private applicationService: ApplicationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchApplications();
    }

    fetchApplications(): void {
        this.loading = true;
        this.errors = null;

        this.applicationService.getAllApplications().subscribe({
        next: async (res: any) => {
            let data = res;

            // Gestion du format Blob (spécifique à ng-openapi-gen)
            if (res instanceof Blob) {
                const text = await res.text();
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("Erreur parsing JSON", e);
                }
            }

            console.log("Données reçues :", data);
            if (Array.isArray(data)) {
                this.applications = data;
            } else {
                this.applications = [];
            }

            this.loading = false;
            console.log("Applications stockées :", this.applications);

        },
        error: (err) => {
            console.error("Erreur lors du chargement", err);
            this.errors = "Erreur lors du chargement des candidatures.";
            this.loading = false;
        }
        });
    }

    // Équivalent du filtrage React
    get filteredApplications(): ApplicationResponse[] {
        if (!this.searchTerm.trim()) {
            return this.applications;
        }
        const search = this.searchTerm.toLowerCase();
        return this.applications.filter(app => {
            const studentName = `${app.student?.firstName} ${app.student?.lastName}`.toLowerCase();
            const internshipTitle = app.internship?.title?.toLowerCase() || "";
            return studentName.includes(search) || internshipTitle.includes(search);
        });
    }

    addNewApplication(): void {
        this.router.navigate(['/applications/new']);
    }

    editApplication(id: number): void {
        this.router.navigate([`/applications/edit/${id}`]);
    }

    removeApplication(id: number): void {
        if (confirm("Êtes-vous sûr de vouloir désactiver cette candidature?")) {
            this.applicationService.deleteApplication(id).subscribe({
                next: () => this.fetchApplications(),
                error: () => alert("Erreur lors de la suppression.")
            });
        }
    }
}
