import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgreementService } from '../../../services/agreement/agreement-service';
import { TeacherService } from '../../../services/teacher/teacher-service';
import { ApplicationService } from '../../../services/application/application-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-agreement',
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './new-agreement.component.html',
  styleUrl: './new-agreement.component.css',
})
export class NewAgreementComponent implements OnInit {
    agreementForm: FormGroup;
    teachers: any[] = [];
    applications: any[] = [];
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private agreementService: AgreementService,
        private teacherService: TeacherService,
        private applicationService: ApplicationService,
        private router: Router
    ) {
        // Initialisation du formulaire réactif
        this.agreementForm = this.fb.group({
        selectedAppId: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        validatorId: ['', Validators.required],
        status: ['DRAFT'],
        documentPdfUrl: ['']
        });
    }

    ngOnInit(): void {
        this.loadInitialData();
    }

    loadInitialData(): void {
        // Chargement des enseignants
        this.teacherService.getAllTeachers().subscribe({
            next: async(response) => {
                let data = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if (Array.isArray(data)) {
                    this.teachers = data;
                } else {
                    this.teachers = [];
                }

            },
            error: (err) => console.error("Erreur enseignants", err)
        });

        // Chargement des candidatures
        this.applicationService.getAllApplications().subscribe({
            next: async(response) => {
                let data = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if (Array.isArray(data)) {
                    this.applications = data;
                } else {
                    this.applications = [];
                }

            },
            error: (err) => console.error("Erreur candidatures", err)
        });
    }

    onSubmit(): void {
        if (this.agreementForm.invalid) {
        this.agreementForm.markAllAsTouched();
        return;
        }

        this.isSubmitting = true;
        const { selectedAppId, ...agreementData } = this.agreementForm.value;

        // Appel au service avec l'ID de candidature et les données de convention
        this.agreementService.createAgreement(selectedAppId, agreementData).subscribe({
        next: () => {
            this.router.navigate(['/agreements']);
        },
        error: (error) => {
            console.error("Erreur création convention", error);
            alert("Erreur lors de la création de la convention.");
            this.isSubmitting = false;
        }
        });
    }

    goBack(): void {
        window.history.back();
    }
}
