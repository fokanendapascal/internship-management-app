import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student/student-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-student.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-student.component.html',
  styleUrl: './new-student.component.css',
})
export class NewStudentComponent implements OnInit {
    studentForm: FormGroup;
    id: string | null = null;
    userId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private studentService: StudentService
    ) {
        this.studentForm = this.fb.group({
        studentCode: ['', Validators.required],
        level: ['', Validators.required],
        userId: ['']
        });
    }

    ngOnInit(): void {
        // Récupération des paramètres (ex: /students/new/12 ou /students/edit/5)
        this.id = this.route.snapshot.paramMap.get('id');
        this.userId = this.route.snapshot.paramMap.get('userId');

        if (this.userId) {
            this.studentForm.patchValue({ userId: this.userId });
        }

        if (this.id) {
            //this.studentForm.get('studentCode')?.disable(); // Empêche la modification du code
            this.loadStudent();
        }
    }

    loadStudent(): void {
        if (!this.id) return; // Sécurité si l'ID est null

        this.loading = true;
        this.studentService.getStudentById(Number(this.id)).subscribe({
            next: async(response: any) => {
                let data = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    data = JSON.parse(text);
                }
                // Remplissage automatique :
                // Angular cherche 'studentCode' et 'level' dans 'data'
                // et les place dans les inputs correspondants.
                this.studentForm.patchValue({
                    studentCode: data.studentCode,
                    level: data.level,
                    userId: data.userId || this.userId
                });
                console.log(data);
                this.loading = false;
            },
            error: (err) => {
                console.error("Erreur chargement étudiant", err);
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.studentForm.invalid) {
        this.studentForm.markAllAsTouched();
        return;
        }

        this.loading = true;
        const payload = this.studentForm.value;

        if (this.id) {
        // UPDATE
        this.studentService.updateStudent(Number(this.id), payload).subscribe({
            next: () => this.navigateToList(),
            error: (err) => this.handleError(err)
        });
        } else {
        // CREATE
        if (!this.userId) {
            alert("ID Utilisateur manquant.");
            this.loading = false;
            return;
        }
        this.studentService.createStudent(Number(this.userId), payload).subscribe({
            next: () => this.navigateToList(),
            error: (err) => this.handleError(err)
        });
        }
    }

    private navigateToList() {
        this.loading = false;
        this.router.navigate(['/students']);
    }

    private handleError(err: any) {
        this.loading = false;
        console.error('Erreur :', err);
        alert("Une erreur est survenue lors de l'enregistrement.");
    }
}
