import { Component } from '@angular/core';
import { StudentService } from '../../services/student/student-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent {

    students: any[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor(
        private studentService: StudentService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchStudents();
    }

    fetchStudents(): void {
        this.loading = true;
        this.studentService.getAllStudents().subscribe({
            next: async (response: any) => {
                let data = response;

                // Si c'est un Blob, on doit le convertir en texte puis en JSON
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if (Array.isArray(data)) {
                    this.students = data;
                } else if (data && Array.isArray(data.body)) {
                    this.students = data.body;
                } else {
                    this.students = [];
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = "Erreur lors du chargement.";
                this.loading = false;
            }
        });
    }

    editStudent(id: number): void {
        this.router.navigate([`/students/edit/${id}`]);
    }

    removeStudent(id: number): void {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
        // On ne met pas loading = true pour ne pas faire disparaître le tableau
        this.studentService.deleteStudent(id).subscribe({
            next: () => {
            this.fetchStudents();
            },
            error: (err) => {
            console.error(`Erreur suppression:`, err);
            alert("Erreur lors de la suppression. L'étudiant peut avoir des candidatures liées.");
            }
        });
        }
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

}
