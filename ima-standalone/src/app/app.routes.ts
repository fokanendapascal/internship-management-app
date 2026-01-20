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
import { NewUserComponent } from './components/forms/user/new-user.component';
import { NewCompanyComponent } from './components/forms/company/new-company.component';
import { NewTeacherComponent } from './components/forms/teacher/new-teacher.component';
import { NewStudentComponent } from './components/forms/student/new-student.component';
import { NewAgreementComponent } from './components/forms/agreement/new-agreement.component';
import { NewApplicationComponent } from './components/forms/application/new-application.component';
import { NewInternshipComponent } from './components/forms/internship/new-internship.component';
import { NewMessageComponent } from './components/forms/message/new-message.component';

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

            { path: 'users/add', component: NewUserComponent },
            { path: 'users/edit/:id', component: NewUserComponent },
            { path: 'users', component: UsersComponent },

            { path: 'companies/new/:userId', component: NewCompanyComponent },
            { path: 'companies/edit/:id', component: NewCompanyComponent },
            { path: 'companies', component: CompaniesComponent },

            { path: 'teachers/new/:userId', component: NewTeacherComponent },
            { path: 'teachers/edit/:id', component: NewTeacherComponent },
            { path: 'teachers', component: TeachersComponent },

            { path: 'students/new/:userId', component: NewStudentComponent },
            { path: 'students/edit/:id', component: NewStudentComponent },
            { path: 'students', component: StudentsComponent },

            { path: 'agreements/new', component: NewAgreementComponent },
            { path: 'agreements/edit/:id', component: NewAgreementComponent },
            { path: 'agreements', component: AgreementsComponent },

            { path: 'applications/new', component: NewApplicationComponent },
            { path: 'applications/edit/:id', component: NewApplicationComponent },
            { path: 'applications', component: ApplicationsComponent },

            { path: 'internships/new', component: NewInternshipComponent },
            { path: 'internships/edit/:id', component: NewInternshipComponent },
            { path: 'internships', component: InternshipsComponent },

            { path: 'messages/new', component: NewMessageComponent },
            { path: 'messages/edit/:id', component: NewMessageComponent },
            { path: 'messages', component: MessagesComponent },

            { path: 'stats', component: StatistiquesComponent },
        ]
    },
    // Optionnel : Route 404 si l'utilisateur tape n'importe quoi
    { path: '**', redirectTo: 'login' }
];
