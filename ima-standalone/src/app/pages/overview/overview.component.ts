import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgreementService } from '../../services/agreement/agreement-service';
import { ApplicationService } from '../../services/application/application-service';
import { StudentService } from '../../services/student/student-service';
import { CompanyService } from '../../services/company/company-service';
import { TeacherService } from '../../services/teacher/teacher-service';
import { forkJoin } from 'rxjs';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import {
  LucideAngularModule,

} from 'lucide-angular';

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule,
    NgxChartsModule,
    LucideAngularModule,



  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
    loading = true;
    error: string | null = null;
    showNotifs = false;

    // Définition d'un objet respectant l'interface Color
    public lineChartScheme: Color = {
        name: 'trendScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#198754'] // Vert pour "isUp", ou ['#dc3545'] pour "isDown"
    };

    // Exemple pour un graphique multicolore (Pie Chart)
    public multiScheme: Color = {
        name: 'multi',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
    };

    data: any = { agreements: [], applications: [], students: [], companies: [], teachers: [] };
    cards: any[] = [];
    alerts: any[] = [];

    constructor(
        private router: Router,
        private agreementService: AgreementService,
        private applicationService: ApplicationService,
        private studentService: StudentService,
        private companyService: CompanyService,
        private teacherService: TeacherService
    ) {}

    ngOnInit(): void {
        this.fetchData();
    }

    // Fermer les notifications si on clique ailleurs
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.showNotifs = false;
    }

    toggleNotifs(event: Event) {
        event.stopPropagation();
        this.showNotifs = !this.showNotifs;
    }

    async fetchData() {
        this.loading = true;
        forkJoin({
        agreements: this.agreementService.getAllAgreements(),
        applications: this.applicationService.getAllApplications(),
        students: this.studentService.getAllStudents(), // Adaptez selon vos noms de méthodes
        companies: this.companyService.getAllCompanies(),
        teachers: this.teacherService.getAllTeachers()
        }).subscribe({
        next: async (result: any) => {
            // Conversion sécurisée des 5 sources (si Blobs)
            const keys = Object.keys(result);
            for (const key of keys) {
            if (result[key] instanceof Blob) {
                const text = await result[key].text();
                const parsed = JSON.parse(text);
                this.data[key] = parsed.body || parsed.data || parsed;
            } else {
                this.data[key] = result[key];
            }
            }
            this.calculateDerivedData();
            this.loading = false;
        },
        error: (err) => {
            this.error = "Erreur lors du chargement des données d'ensemble.";
            this.loading = false;
        }
        });
    }

    calculateDerivedData() {
        const convStats = this.calculateStatsWithTrend(this.data.agreements, 'startDate');
        const appStats = this.calculateStatsWithTrend(this.data.applications, 'applicationDate');

        this.alerts = [];
        if (convStats.percentage <= -20) this.alerts.push({ id: 1, msg: `Forte baisse des conventions (${convStats.percentage}%)` });
        if (appStats.percentage <= -20) this.alerts.push({ id: 2, msg: `Baisse des candidatures (${appStats.percentage}%)` });
        if (this.data.companies.length === 0) this.alerts.push({ id: 3, msg: "Aucune entreprise partenaire enregistrée" });

        this.cards = [
        { title: 'Statistiques', desc: 'Vue globale', icon: 'bar-chart-3', path: '/stats', color: 'text-primary' },
        { title: 'Conventions', desc: 'Dossiers de stage', icon: 'file-check', val: convStats.total, path: '/agreements', color: 'text-success', trend: convStats },
        { title: 'Candidatures', desc: 'Demandes étudiantes', icon: 'building-2', val: appStats.total, path: '/applications', color: 'text-warning', trend: appStats },
        { title: 'Étudiants', desc: 'Inscrits', icon: 'users', val: this.data.students.length, path: '/students', color: 'text-info' },
        { title: 'Entreprises', desc: 'Partenaires', icon: 'building-2', val: this.data.companies.length, path: '/companies', color: 'text-secondary' },
        { title: 'Enseignants', desc: 'Encadreurs', icon: 'graduation-cap', val: this.data.teachers.length, path: '/teachers', color: 'text-dark' }
        ];
    }

    private calculateStatsWithTrend(items: any[] = [], dateKey: string) {
        const now = new Date();
        const trendData: any[] = [];
        let currentWeek = 0;
        let lastWeek = 0;

        const oneWeekAgo = new Date(); oneWeekAgo.setDate(now.getDate() - 7);
        const twoWeeksAgo = new Date(); twoWeeksAgo.setDate(now.getDate() - 14);

        for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i);
        trendData.push({ name: d.toISOString().split('T')[0], value: 0 });
        }

        items.forEach(item => {
        if (!item?.[dateKey]) return;
        const itemDate = new Date(item[dateKey]);
        const dateStr = itemDate.toISOString().split('T')[0];

        const point = trendData.find(p => p.name === dateStr);
        if (point) point.value++;

        if (itemDate >= oneWeekAgo) currentWeek++;
        else if (itemDate >= twoWeeksAgo) lastWeek++;
        });

        let percentage = lastWeek > 0 ? ((currentWeek - lastWeek) / lastWeek) * 100 : (currentWeek > 0 ? 100 : 0);

        return {
        total: items.length,
        series: [{ name: 'Count', series: trendData }], // Format ngx-charts
        percentage: Math.round(percentage),
        isUp: currentWeek >= lastWeek
        };
    }

    navigate(path: string) {
        this.router.navigate([path]);
    }
}
