import { Injectable } from '@angular/core';
import { ApplicationRequest, ApplicationResponse } from '../../core/api/models';
import { Observable, map } from 'rxjs';
import * as applicationFunctions from '../../core/api/functions';
import { createApplicationWithCv } from '../../core/api/functions';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../core/api/api-configuration';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createApplicationForStudent
     */
    createApplicationForStudent(studentId: number, application: ApplicationRequest ): Observable<ApplicationResponse> {
        return applicationFunctions.createApplicationForStudent(this.http, this.config.rootUrl, {id: studentId, body: application})
        .pipe(
            map(res => res.body as ApplicationResponse)
        );
    }

    /**
     * Envoie une candidature avec un CV
     */
    createApplicationWithCv(application: ApplicationRequest, cv: Blob): Observable<ApplicationResponse> {
        return createApplicationWithCv(this.http, this.config.rootUrl, {
        // Respectez strictement la structure de CreateApplicationWithCv$Params
        body: {
            application: application,
            cvFile: cv
        }
        }).pipe(
        map(res => res.body as ApplicationResponse)
        );
    }


    /**
     * Utilise la fonction générée getApplicationById
     */
    getApplicationById(applicationId: number): Observable<ApplicationResponse>{
        return applicationFunctions.getApplicationById(this.http, this.config.rootUrl, {id: applicationId})
        .pipe(
            map(res => res.body as ApplicationResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllApplications
     */
    getAllApplications(): Observable<ApplicationResponse[]> {
        return applicationFunctions.getAllApplications(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as ApplicationResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateApplication
     */
    updateApplication(applicationId: number, application: ApplicationRequest): Observable<ApplicationResponse> {
        return applicationFunctions.updateApplication(this.http, this.config.rootUrl, {id: applicationId, body: application})
        .pipe(
            map(res => res.body as ApplicationResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteApplication
     */
    deleteApplication(applicationId: number): Observable<void> {
        return applicationFunctions.deleteApplication(this.http, this.config.rootUrl, {id: applicationId})
        .pipe(
            map(res => res.body as void)
        );
    }

}
