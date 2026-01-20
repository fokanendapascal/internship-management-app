import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { MessageRequest, MessageResponse, PageMessageResponse } from '../../core/api/models';
import { map, Observable } from 'rxjs';
import * as messageFunctions from '../../core/api/functions';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createMessage
     */
    createMessage(message: MessageRequest): Observable<MessageResponse> {
        return messageFunctions.createMessage(this.http, this.config.rootUrl, {body: message})
        .pipe(
            map(res => res.body as MessageResponse)
        );
    }

    /**
     * Utilise la fonction générée getMessageById
     */
    getMessageById(messageId: number): Observable<MessageResponse>{
        return messageFunctions.getMessageById(this.http, this.config.rootUrl, {id: messageId})
        .pipe(
            map(res => res.body as MessageResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllMessages
     */
    getAllMessages(page: number, size: number): Observable<PageMessageResponse> {
        return messageFunctions.getAllMessages(this.http, this.config.rootUrl, {page: page, size: size})
        .pipe(
            map(res => res.body as PageMessageResponse)
        );
    }

    /**
     * Utilise la fonction générée updateMessage
     * On utilise Partial<MessageRequest> | any pour autoriser des mises à jour partielles (comme isRead)
     */
    updateMessage(messageId: number, message: Partial<MessageRequest> | any): Observable<MessageResponse> {
        return messageFunctions.updateMessage(this.http, this.config.rootUrl, {
            id: messageId,
            body: message as MessageRequest // On cast ici pour satisfaire la fonction générée
        })
        .pipe(
            map(res => res.body as MessageResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteMessage
     */
    deleteMessage(messageId: number): Observable<void> {
        return messageFunctions.deleteMessage(this.http, this.config.rootUrl, {id: messageId})
        .pipe(
            map(res => res.body as void)
        );
    }

}
