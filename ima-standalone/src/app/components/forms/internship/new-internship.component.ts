import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternshipService } from '../../../services/internship/internship-service';
import { CompanyService } from '../../../services/company/company-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-internship',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-internship.component.html',
  styleUrl: './new-internship.component.css',
})
export class NewInternshipComponent implements OnInit {
    internshipForm: FormGroup;
    companies: any[] = [];
    loading = false;

    constructor(
        private fb: FormBuilder,
        private internshipService: InternshipService,
        private companyService: CompanyService,
        public router: Router
    ) {
        // Structure du formulaire avec objet imbriqué pour la compagnie
        this.internshipForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        isActive: [true],
        isPaid: [true],
        company: this.fb.group({
            id: ['', Validators.required]
        })
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
    }

    loadCompanies(): void {
        this.companyService.getAllCompanies().subscribe({
            next: async(response: any) => {

                let data = response;

                // Si c'est un Blob, on doit le convertir en texte puis en JSON
                if (response instanceof Blob) {
                    const text = await response.text();
                    data = JSON.parse(text);
                }

                // Une fois converti, on applique la logique de vérification
                if(Array.isArray(data)){
                    this.companies = data;
                }else if (data && Array.isArray(data.body)) {
                    this.companies = data.body;
                } else {
                    this.companies = [];
                }
                this.loading = false;

            },
            error: (err) => console.error("Erreur chargement entreprises", err)
        });
    }

    onSubmit(): void {
        if (this.internshipForm.invalid) {
            this.internshipForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.internshipService.createInternship(this.internshipForm.value).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/internships']);
            },
            error: (err) => {
                this.loading = false;
                console.error("Erreur création stage", err);
            }
        });
    }
}
