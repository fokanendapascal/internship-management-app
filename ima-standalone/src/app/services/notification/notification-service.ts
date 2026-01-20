import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, interval, map, Observable, startWith, Subscription, switchMap, tap } from 'rxjs';
import { MessageService } from '../message/message-service';
import { ApplicationService } from '../application/application-service';
import { InternshipService } from '../internship/internship-service';
import { AgreementService } from '../agreement/agreement-service';
import { NotificationResponse } from '../../core/api/models';
import * as notificationFunctions from '../../core/api/functions';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { getAllNotifications } from '../../core/api/fn/notifications/get-all-notifications';

export interface NotificationCounts {
    messages: number;
    notifications: number;
    applications: number;
    internships: number;
    agreements: number;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService implements OnDestroy {
    // BehaviorSubject pour stocker l'état actuel et permettre aux composants de s'y abonner
    private countsSubject = new  BehaviorSubject<NotificationCounts>({
        messages: 0,
        notifications: 0,
        applications: 0,
        internships: 0,
        agreements: 0
    });

    // Observable public que les composants vont consommer
    public counts$ = this.countsSubject.asObservable();

    private pollingSubscription: Subscription;

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration,
        private messageService: MessageService,
        private appService: ApplicationService,
        private internService: InternshipService,
        private agreeService: AgreementService
    ) {
        // Initialisation du polling (toutes les 60 secondes)
        this.pollingSubscription = interval(60000)
        .pipe(
            startWith(0), // Lance l'appel immédiatement au chargement
            switchMap(() => this.fetchAllCounts())
        )
        .subscribe();
    }

    public fetchAllCounts() {
        const token = localStorage.getItem("token");
        if (!token) return Promise.resolve();

        // forkJoin est l'équivalent RxJS de Promise.all
        return forkJoin({
            messages: this.messageService.getAllMessages(0, 100),
            applications: this.appService.getAllApplications(),
            internships: this.internService.getAllInternships(),
            notifications: this.getAllNotifications(),
            agreements: this.agreeService.getAllAgreements()
        }).pipe(
        map(res => ({
            messages: res.messages?.content?.filter((m: any) => !m.isRead).length || 0,
            applications: res.applications?.filter((a: any) => a.status === 'PENDING').length || 0,
            internships: res.internships?.filter((i: any) => i.active).length || 0,
            notifications: res.notifications?.filter((n: any) => !n.isRead).length || 0,
            agreements: res.agreements?.filter((agr: any) => agr.status === 'DRAFT').length || 0,
        })),
        tap(newCounts => this.countsSubject.next(newCounts))
        ).toPromise();
    }

    ngOnDestroy() {
        // Nettoyage automatique pour éviter les fuites de mémoire
        this.pollingSubscription?.unsubscribe();
    }

    /**
     * Utilise la fonction générée getAllNotifications
     */
    getAllNotifications(): Observable<NotificationResponse[]> {
        return notificationFunctions.getAllNotifications(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as NotificationResponse[])
        );
    }

}
