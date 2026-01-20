import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message/message-service';
import { UserService } from '../../../services/user/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-message.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.css',
})
export class NewMessageComponent implements OnInit {

    @Output()
    messageCreated = new EventEmitter<void>();

    messageForm: FormGroup;
    users: any[] = [];
    loading = false;
    usersLoading = true;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private userService: UserService
    ){
        // Initialisation du formulaire (Équivalent des useState)
        this.messageForm = this.fb.group({
            recipientId: ['', Validators.required],
            content: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    ngOnInit(): void {
        this.fetchUsers();
    }

    fetchUsers(): void {
        this.usersLoading = true;
        this.userService.getAllUsers().subscribe({
            next: async(response: any) => {
                let userData = response.content || response || [];
                const currentUserId = Number(localStorage.getItem("userId"));

                if(response instanceof Blob){
                    const text = await response.text();
                    userData = JSON.parse(text);
                }

                // Filtrage et tri (Logique identique à votre useEffect)
                this.users = userData
                .filter((u: any) => u.id !== currentUserId)
                .sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));

                this.usersLoading = false;
            },
            error: (err) => {
                console.error("Erreur chargement utilisateurs", err);
                this.users = [];
                this.usersLoading = false;
            }
        });
    }

    handleSubmit(): void {
        if(this.messageForm.invalid){
            return;
        }

        this.loading = true;
        const payload = {
            recipientId: parseInt(this.messageForm.value.recipientId),
            content: this.messageForm.value.content
        };

        this.messageService.createMessage(payload).subscribe({
            next: () => {
                this.messageForm.reset({ recipientId: '', content: '' });
                this.messageCreated.emit(); // Informe le parent
                this.loading = false;
            },
            error: (err) => {
                console.error("Erreur création:", err);
                this.loading = false;
            }
        });
    }

    // Helper pour formater les rôles (optionnel, pour garder le HTML propre)
    formatRoles(roles: any[]): string {
        if (!roles || roles.length === 0) return '';
        return ` (${roles.map(r => r.replace('ROLE_', '')).join(', ')})`;
    }

}

