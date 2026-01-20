import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher/teacher-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teachers',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css',
})
export class TeachersComponent implements OnInit { // Ajout de l'interface OnInit

    teachers: any[] = [];
    searchTerm: string = '';
    loading: boolean = false;
    error: string | null = null;

    constructor(
        private teacherService: TeacherService,
        private router: Router

    ) {}

    ngOnInit(): void {
        this.fetchTeachers();
    }

    fetchTeachers(): void {
        this.loading = true;
        this.teacherService.getAllTeachers().subscribe({
            next: async (response: any) => {
                let data = response;

                // Si c'est un Blob, on doit le convertir en texte puis en JSON
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if (Array.isArray(data)) {
                    this.teachers = data;
                } else if (data && Array.isArray(data.body)) {
                    this.teachers = data.body;
                } else {
                    this.teachers = [];
                }
                this.loading = false;
            },
            error: (err) => {
                this.error = "Erreur lors du chargement.";
                this.loading = false;
            }
        });
    }

    get filteredTeachers() {
        // SÉCURITÉ : On vérifie que teachers est bien un tableau avant de filtrer
        if (!Array.isArray(this.teachers)) return [];

        const search = this.searchTerm.toLowerCase();
        return this.teachers.filter(teacher => {
            // SÉCURITÉ : On utilise l'optional chaining (?.) au cas où des champs sont null
            const dept = teacher.department?.toLowerCase() || '';
            const spec = teacher.specialty?.toLowerCase() || '';
            return dept.includes(search) || spec.includes(search);
        });
    }

    removeTeacher(id: number): void {
        if (confirm("Supprimer cet enseignant ?")) {
            this.teacherService.deleteTeacher(id).subscribe({
                next: () => this.fetchTeachers(),
                error: (err) => {
                    console.error("Erreur suppression:", err);
                    alert("Erreur lors de la suppression.");
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

    editTeacher(id: number): void {
        this.router.navigate([`/teachers/edit/${id}`]);
    }
}

