import { InternshipRequest } from './../../core/api/models/internship-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { InternshipResponse } from '../../core/api/models';
import { map, Observable } from 'rxjs';
import * as internshipFunctions from '../../core/api/functions';

@Injectable({
  providedIn: 'root',
})
export class InternshipService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createInternship
     */
    createInternship(internship: InternshipRequest ): Observable<InternshipResponse> {
        return internshipFunctions.createInternship(this.http, this.config.rootUrl, {body: internship})
        .pipe(
            map(res => res.body as InternshipResponse)
        );
    }

    /**
     * Utilise la fonction générée getInternshipById
     */
    getInternshipById(internshipId: number): Observable<InternshipResponse>{
        return internshipFunctions.getInternshipById(this.http, this.config.rootUrl, {id: internshipId})
        .pipe(
            map(res => res.body as InternshipResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllInternships
     */
    getAllInternships(): Observable<InternshipResponse[]> {
        return internshipFunctions.getAllInternships(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as InternshipResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateInternship
     */
    updateInternship(internshipId: number, internship: InternshipRequest): Observable<InternshipResponse> {
        return internshipFunctions.updateInternship(this.http, this.config.rootUrl, {id: internshipId, body: internship})
        .pipe(
            map(res => res.body as InternshipResponse)
        );
    }

    /**
     * Utilise la fonction générée deactivateInternship
     */
    deactivateInternship(internshipId: number): Observable<void> {
        return internshipFunctions.deactivateInternship(this.http, this.config.rootUrl, {id: internshipId})
        .pipe(
            map(res => res.body as void)
        );
    }

}
