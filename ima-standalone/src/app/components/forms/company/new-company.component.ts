import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company/company-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-company.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-company.component.html',
  styleUrl: './new-company.component.css',
})
export class NewCompanyComponent implements OnInit {
    companyForm: FormGroup;
    id: string | null = null;
    userId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private companyService: CompanyService
    ) {
        // Définition du formulaire avec validations natives Angular
        this.companyForm = this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        description: ['', Validators.required],
        website: ['', [Validators.required, Validators.pattern('https?://.+')]],
        phone: ['', Validators.required],
        professionalEmail: ['', [Validators.required, Validators.email]],
        userId: ['']
        });
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.userId = this.route.snapshot.paramMap.get('userId');

        if (this.userId) {
        this.companyForm.patchValue({ userId: this.userId });
        }

        if (this.id) {
        this.loadCompany();
        }
    }

    loadCompany(): void {
        this.loading = true;
        this.companyService.getCompanyById(Number(this.id)).subscribe({
        next: async(response: any) => {
            let data = response;

            if(response instanceof Blob){
                const text = await response.text();
                data = JSON.parse(text);
            }

            this.companyForm.patchValue(data);
            // On s'assure que le userId de l'URL reste prioritaire si nécessaire
            if (this.userId) this.companyForm.patchValue({ userId: this.userId });
            this.loading = false;
        },
        error: (err) => {
            console.error("Erreur de chargement", err);
            alert("Impossible de récupérer les données de l'entreprise.");
            this.loading = false;
        }
        });
    }

    onSubmit(): void {
        if (this.companyForm.invalid) {
        this.companyForm.markAllAsTouched();
        return;
        }

        this.loading = true;
        const payload = this.companyForm.value;

        if (this.id) {
        this.companyService.updateCompany(Number(this.id), payload).subscribe({
            next: () => this.handleSuccess(),
            error: (err) => this.handleError(err)
        });
        } else {
        if (!this.userId) {
            alert("ID Utilisateur manquant pour la création.");
            this.loading = false;
            return;
        }
        this.companyService.createCompany(Number(this.userId), payload).subscribe({
            next: () => this.handleSuccess(),
            error: (err) => this.handleError(err)
        });
        }
    }

    private handleSuccess() {
        this.loading = false;
        this.router.navigate(['/companies']);
    }

    private handleError(err: any) {
        this.loading = false;
        const serverMsg = err.error?.message || "Une erreur est survenue.";
        alert(serverMsg);
    }
}

