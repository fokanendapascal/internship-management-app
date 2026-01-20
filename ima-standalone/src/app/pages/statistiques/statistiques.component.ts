import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AgreementService } from '../../services/agreement/agreement-service';
import { ApplicationService } from '../../services/application/application-service';
import { forkJoin } from 'rxjs';
import { Color, ScaleType, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-statistiques',
  imports: [
    CommonModule,
    NgxChartsModule,
    LucideAngularModule

  ],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.css',
})
export class StatistiquesComponent implements OnInit {
    loading = true;
    error: string | null = null;

    readonly positionBelow = LegendPosition.Below;

    // Définissez le schéma ici au lieu du HTML
    customScheme: Color = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#0d6efd'] // Votre couleur bleue Bootstrap
    };

    // Pour le Pie Chart (si vous voulez plusieurs couleurs)
    statusScheme: Color = {
        name: 'statusScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#198754', '#ffc107', '#6c757d', '#0dcaf0', '#dc3545']
    };

    // Données pour les graphiques (format ngx-charts)
    barChartData: any[] = [];
    pieChartData: any[] = [];

    // KPIs et compteurs
    stats = {
        totalAgreements: 0,
        totalApplications: 0,
        totalStudents: 0,
        validationRate: '0',
        statusCounts: {
        draft: 0, pendingValidation: 0, validated: 0, sent: 0, signed: 0, canceled: 0
        }
    };

    readonly STATUS_FIELD_MAP: any = {
        DRAFT: 'draft', PENDING_VALIDATION: 'pendingValidation', VALIDATED: 'validated',
        SENT_FOR_SIGNATURE: 'sent', SIGNED: 'signed', CANCELED: 'canceled'
    };

    readonly MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    constructor(
        private agreementService: AgreementService,
        private applicationService: ApplicationService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.error = null;

        forkJoin({
            agreements: this.agreementService.getAllAgreements(),
            applications: this.applicationService.getAllApplications()
        }).subscribe({
            next: async (result: any) => {
            try {
                let agreementsData = result.agreements;
                let applicationsData = result.applications;

                // 1. Conversion du premier Blob (Conventions)
                if (agreementsData instanceof Blob) {
                const text = await agreementsData.text();
                const parsed = JSON.parse(text);
                agreementsData = parsed.body || parsed.data || parsed;
                }

                // 2. Conversion du second Blob (Candidatures)
                if (applicationsData instanceof Blob) {
                const text = await applicationsData.text();
                const parsed = JSON.parse(text);
                applicationsData = parsed.body || parsed.data || parsed;
                }

                // 3. Sécurité ultime : On s'assure que ce sont des tableaux
                const finalAgreements = Array.isArray(agreementsData) ? agreementsData : [];
                const finalApplications = Array.isArray(applicationsData) ? applicationsData : [];

                this.processData(finalAgreements, finalApplications);
                this.loading = false;
            } catch (err) {
                console.error("Erreur de parsing JSON:", err);
                this.error = "Erreur lors de l'analyse des données statistiques.";
                this.loading = false;
            }
            },
            error: (err) => {
            console.error("Erreur forkJoin:", err);
            this.error = "Erreur de chargement des statistiques";
            this.loading = false;
            }
        });
    }


    private processData(agreements: any[], applications: any[]) {

        // Initialisation sécurisée
        const statusCounts: any = { draft: 0, pendingValidation: 0, validated: 0, sent: 0, signed: 0, canceled: 0 };
        const monthlyCounts = Array(12).fill(0);

        // Utilisation de l'optional chaining par précaution
        agreements?.forEach(agg => {
            const field = this.STATUS_FIELD_MAP[agg.status];
            if (field) statusCounts[field]++;
        });

        // Traitement des candidatures (Graphique en barres)
        applications.forEach(app => {
        if (app.createdAt) {
            const monthIndex = new Date(app.createdAt).getMonth();
            monthlyCounts[monthIndex]++;
        }
        });

        this.stats.totalAgreements = agreements.length;
        this.stats.totalApplications = applications.length;
        this.stats.totalStudents = new Set(applications.map(a => a.studentId)).size;
        this.stats.validationRate = agreements.length
        ? ((statusCounts.validated / agreements.length) * 100).toFixed(1) : '0';
        this.stats.statusCounts = statusCounts;

        // Formatage pour ngx-charts
        this.barChartData = this.MONTHS.map((name, i) => ({ name, value: monthlyCounts[i] }));

        this.pieChartData = [
        { name: 'Validé', value: statusCounts.validated, extra: { code: 'VALIDATED' } },
        { name: 'En attente', value: statusCounts.pendingValidation, extra: { code: 'PENDING_VALIDATION' } },
        { name: 'Brouillon', value: statusCounts.draft, extra: { code: 'DRAFT' } },
        { name: 'Signé', value: statusCounts.signed, extra: { code: 'SIGNED' } }
        ].filter(d => d.value > 0);
    }
}
