import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application/application-service';
import { InternshipService } from '../../../services/internship/internship-service';
import { StudentService } from '../../../services/student/student-service';
import { Router } from '@angular/router';
import { ApplicationRequest } from '../../../core/api/models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-new-application',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-application.component.html',
  styleUrl: './new-application.component.css',
})
export class NewApplicationComponent implements OnInit {

    applicationForm: FormGroup;
    internships: any[] = [];
    students: any[] = [];
    isSubmitting = false;
    cvFile: File | null = null;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private applicationService: ApplicationService,
        private internshipService: InternshipService,
        private studentService: StudentService,
        private router: Router
    ) {
        // Initialisation du formulaire avec les valeurs par défaut de votre code React
        this.applicationForm = this.fb.group({
            applicationDate: [new Date().toISOString().split('T')[0], Validators.required],
            status: ['PENDING'],
            coverLetter: ['', Validators.required],
            internshipId: ['', Validators.required],
            studentId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        // Équivalent du useEffect pour charger les listes
        this.internshipService.getAllInternships().subscribe({
            next: async(response: any) =>{
                let data = response;

                // Si c'est un Blob, on doit le convertir en texte puis en JSON
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if (Array.isArray(data)) {
                    this.internships = data;
                } else if (data && Array.isArray(data.body)) {
                    this.internships = data.body;
                } else {
                    this.internships = [];
                }
                this.loading = false;

            } ,

            error: (err) => console.error("Erreur stages:", err)
        });

        this.studentService.getAllStudents().subscribe({
            next: async(response: any) => {
                let data = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                if(Array.isArray(data)){
                    this.students = data;
                } else if(data && Array.isArray(data.body)){
                    this.students = data.body;
                } else {
                    this.students = [];
                }
                this.loading = false;

            },
            error: (err) => console.error("Erreur étudiants:", err)
        });
    }

    // Équivalent de handleFileChange
    onFileChange(event: any): void {
        if (event.target.files.length > 0) {
        this.cvFile = event.target.files[0];
        }
    }

    // Équivalent de handleSubmit
    onSubmit(): void {
        if (!this.cvFile) {
        alert("Veuillez sélectionner un fichier PDF pour le CV.");
        return;
        }

        if (this.applicationForm.invalid) {
        this.applicationForm.markAllAsTouched();
        return;
        }

        this.isSubmitting = true;

        const formValue = this.applicationForm.value;

        /** * Mapping vers l'interface ApplicationRequest (OpenAPI)
         * Note: Selon votre interface définie plus haut, nous n'incluons que les champs connus.
         */
        const applicationRequest: ApplicationRequest = {
        coverLetter: formValue.coverLetter,
        internshipId: Number(formValue.internshipId),
        cvUrl: this.cvFile.name // Requis par votre interface Request
        };

        // Appel au service createApplicationWithCv (Multipart)
        this.applicationService.createApplicationWithCv(applicationRequest, this.cvFile).subscribe({
        next: () => {
            this.router.navigate(['/applications']);
        },
        error: (error) => {
            console.error("Erreur détaillée:", error);
            alert("Erreur lors de la création de la candidature.");
            this.isSubmitting = false;
        }
        });
    }

    cancel(){
        this.router.navigate(['/applications']);
    }
}

