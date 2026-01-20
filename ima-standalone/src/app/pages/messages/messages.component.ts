import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message/message-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
    messages: any[] = [];
    loading = true;
    currentPage = 0;
    totalPages = 0;
    pageSize = 5;

    constructor(
        private messageService: MessageService,
        private router: Router,
        public notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages(): void {
        this.loading = true;
        this.messageService.getAllMessages(this.currentPage, this.pageSize).subscribe({
        next: async(res: any) => {
            let data = res;

            if(res instanceof Blob){
                const text = await res.text();
                data = JSON.parse(text);
            }

            this.messages = data.content;
            this.totalPages = data.totalPages;
            this.loading = false;
        },
        error: (err) => {
            console.error("Erreur lors du chargement des messages", err);
            this.loading = false;
        }
        });
    }

    handleDelete(id: number): void {
        if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
        this.messageService.deleteMessage(id).subscribe({
            next: () => {
            // Si c'était le dernier message de la page actuelle (sauf page 0)
            if (this.messages.length === 1 && this.currentPage > 0) {
                this.setPage(this.currentPage - 1);
            } else {
                this.loadMessages();
            }
            },
            error: (err) => console.error("Erreur suppression", err)
        });
        }
    }

    markAsRead(id: number): void {
        this.messageService.updateMessage(id, { isRead: true }).subscribe({
        next: () => {
            // Mise à jour locale pour éviter de recharger toute la liste
            this.messages = this.messages.map(msg =>
            msg.id === id ? { ...msg, isRead: true } : msg
            );
        },
        error: (err) => console.error("Erreur mise à jour :", err)
        });
    }

    setPage(page: number): void {
        this.currentPage = page;
        this.loadMessages();
    }

    // Navigation
    addNewMessage(): void {
        this.router.navigate(['/messages/new']);
    }

    editMessage(id: number): void {
        this.router.navigate([`/messages/edit/${id}`]);
    }

    // Helper pour générer le tableau de pagination
    get pagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    // Pour optimiser le rendu de la liste
    trackByMessageId(index: number, msg: any): number {
        return msg.id;
    }

    // Pour déclencher le refresh du service
    refreshCounts(): void {
        this.notificationService.fetchAllCounts();
    }
}
