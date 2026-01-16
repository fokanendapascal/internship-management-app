import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AgreementsComponent } from './pages/agreements/agreements.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { UsersComponent } from './pages/users/users.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { StudentsComponent } from './pages/students/students.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { InternshipsComponent } from './pages/internships/internships.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ApplicationGuardService } from './services/guard/application-guard.service';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'register', component: InscriptionComponent },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [ApplicationGuardService],
        children: [
            // Redirection par défaut vers 'dashboard' quand on accède à la racine
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            { path: 'dashboard', component: OverviewComponent },
            { path: 'users', component: UsersComponent },
            { path: 'companies', component: CompaniesComponent },
            { path: 'teachers', component: TeachersComponent },
            { path: 'students', component: StudentsComponent },
            { path: 'agreements', component: AgreementsComponent },
            { path: 'applications', component: ApplicationsComponent },
            { path: 'internships', component: InternshipsComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'stats', component: StatistiquesComponent },
        ]
    },
    // Optionnel : Route 404 si l'utilisateur tape n'importe quoi
    { path: '**', redirectTo: 'login' }
];
