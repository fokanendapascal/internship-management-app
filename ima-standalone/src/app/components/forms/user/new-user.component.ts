import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent implements OnInit {

    userForm: FormGroup;
    userId: string | null = null;
    loading = false;

    ROLE_LIST = [
        { id: 'ADMIN', name: 'Administrateur' },
        { id: 'TEACHER', name: 'Enseignant' },
        { id: 'STUDENT', name: 'Étudiant' },
        { id: 'COMPANY', name: 'Entreprise' },
        { id: 'USER', name: 'Utilisateur' },
    ];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {
        // Initialisation du formulaire
        this.userForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''], // Validateur conditionnel ajouté dans ngOnInit
            telephone: ['', Validators.required],
            roles: this.fb.array([], Validators.required)
        });
    }

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');

        // Gestion du mot de passe requis seulement à la création
        if (!this.userId) {
            this.userForm.get('password')?.setValidators([Validators.required]);
        }

        if (this.userId) {
            this.loadUser();
        }
    }

    // --- Gestion des Rôles (Checkboxes) ---
    onRoleChange(event: any) {
        const roles: FormArray = this.userForm.get('roles') as FormArray;
        if (event.target.checked) {
            roles.push(new FormControl(event.target.value));
        } else {
            const index = roles.controls.findIndex(x => x.value === event.target.value);
            roles.removeAt(index);
        }
    }

    isRoleChecked(roleId: string): boolean {
        return (this.userForm.get('roles') as FormArray).value.includes(roleId);
    }

    // --- Actions ---
    loadUser() {
        this.loading = true;
        const idAsNumber = Number(this.userId);

        this.userService.getUserById(idAsNumber!).subscribe({
            next: async(response: any) => {

                let user = response;

                if(response instanceof Blob){
                    const text = await response.text();
                    user = JSON.parse(text);
                }

                const rolesFromApi = user.roles || [];
                // Transformation des rôles comme dans le code React
                const formattedRoles = rolesFromApi.map((role: any) => {
                    if (typeof role === 'string') return role;
                    return role.id || role.name?.replace("ROLE_", "");
                }).filter(Boolean);

                this.userForm.patchValue({ ...user, password: '' });

                // Remplissage du FormArray des rôles
                const rolesArray = this.userForm.get('roles') as FormArray;
                formattedRoles.forEach((role: string) => rolesArray.push(new FormControl(role)));

                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const payload = {
            ...this.userForm.value,
            roles: this.userForm.value.roles.map((r: string) => r.toUpperCase())
        };

        if (this.userId) {
            // Ligne 114 : Conversion en number car le service l'exige
            this.userService.updateUser(Number(this.userId), payload).subscribe({
                next: () => this.router.navigate(['/users']),
                error: (err) => console.error(err)
            });
        } else {
            // Création
            this.userService.createUser(payload).subscribe({
                next: (response) => {
                    // Ligne 121 : Sécurisation de l'ID (en string) et des rôles (par défaut [])
                    const createdId = String(response.id);
                    const roles = response.roles || []; // Évite le 'undefined'
                    this.redirectAfterCreation(createdId, roles);
                },
                error: (err) => console.error(err)
            });
        }
    }

    private redirectAfterCreation(id: string, roles: string[]) {
        if (roles.includes('STUDENT')) this.router.navigate(['/students/new', id]);
        else if (roles.includes('TEACHER')) this.router.navigate(['/teachers/new', id]);
        else if (roles.includes('COMPANY')) this.router.navigate(['/companies/new', id]);
        else this.router.navigate(['/users']);
    }

    cancel() {
        this.router.navigate(['/users']);
    }

}
