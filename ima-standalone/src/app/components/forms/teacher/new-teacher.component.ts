import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher/teacher-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-teacher.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-teacher.component.html',
  styleUrl: './new-teacher.component.css',
})
export class NewTeacherComponent implements OnInit {
    teacherForm: FormGroup;
    id: string | null = null;
    userId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private teacherService: TeacherService
    ) {
        // Initialisation du formulaire avec validations
        this.teacherForm = this.fb.group({
        department: ['', Validators.required],
        grade: ['', Validators.required],
        specialty: ['', Validators.required],
        userId: ['']
        });
    }

    ngOnInit(): void {
        // Récupération des paramètres de l'URL
        this.id = this.route.snapshot.paramMap.get('id');
        this.userId = this.route.snapshot.paramMap.get('userId');

        if (this.userId) {
        this.teacherForm.patchValue({ userId: this.userId });
        }

        if (this.id) {
        this.loadTeacher();
        }
    }

    loadTeacher(): void {
        this.loading = true;
        this.teacherService.getTeacher(Number(this.id)).subscribe({
            next: async(response:any) => {
                let data = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                this.teacherForm.patchValue({
                department: data.department,
                grade: data.grade,
                specialty: data.specialty,
                userId: data.userId || this.userId
                });
                this.loading = false;
            },
            error: (err) => {
                console.error("Erreur chargement enseignant", err);
                alert("Erreur lors de la récupération des données.");
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.teacherForm.invalid) {
        this.teacherForm.markAllAsTouched();
        return;
        }

        this.loading = true;
        const payload = this.teacherForm.value;

        if (this.id) {
        // Cas de la mise à jour
        this.teacherService.updateTeacher(Number(this.id), payload).subscribe({
            next: () => this.handleSuccess(),
            error: (err) => this.handleError(err)
        });
        } else {
        // Cas de la création (nécessite userId)
        if (!this.userId) {
            alert("ID Utilisateur manquant.");
            this.loading = false;
            return;
        }
        this.teacherService.createTeacher(Number(this.userId), payload).subscribe({
            next: () => this.handleSuccess(),
            error: (err) => this.handleError(err)
        });
        }
    }

    private handleSuccess(): void {
        this.loading = false;
        this.router.navigate(['/teachers']);
    }

    private handleError(err: any): void {
        console.error('Erreur lors de la soumission :', err);
        alert("Une erreur est survenue lors de l'enregistrement.");
        this.loading = false;
    }
}
