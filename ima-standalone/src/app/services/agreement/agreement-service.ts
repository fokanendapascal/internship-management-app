import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { AgreementRequest, AgreementResponse } from '../../core/api/models';
import { Observable, map } from 'rxjs';
import * as agreementFunctions from '../../core/api/functions';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {


    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createAgreementForAdmin
     */
    createAgreementForAdmin(applicationId: number, teacherId: number, agreement: AgreementRequest ): Observable<AgreementResponse> {
        return agreementFunctions.createAgreementForAdmin(this.http, this.config.rootUrl, {applicationId: applicationId, teacherId: teacherId, body: agreement})
        .pipe(
            map(res => res.body as AgreementResponse)
        );
    }

    /**
     * Utilise la fonction générée createAgreement
     */
    createAgreement(applicationId: number, agreement: AgreementRequest ): Observable<AgreementResponse> {
        return agreementFunctions.createAgreement(this.http, this.config.rootUrl, {applicationId: applicationId, body: agreement})
        .pipe(
            map(res => res.body as AgreementResponse)
        );
    }



    /**
     * Utilise la fonction générée getAgreementById
     */
    getAgreementById(agreementId: number): Observable<AgreementResponse>{
        return agreementFunctions.getAgreementById(this.http, this.config.rootUrl, {id: agreementId})
        .pipe(
            map(res => res.body as AgreementResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllAgreements
     */
    getAllAgreements(): Observable<AgreementResponse[]> {
        return agreementFunctions.getAllAgreements(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as AgreementResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateAgreement
     */
    updateAgreement(agreementId: number, agreement: AgreementRequest): Observable<AgreementResponse> {
        return agreementFunctions.updateAgreement(this.http, this.config.rootUrl, {id: agreementId, body: agreement})
        .pipe(
            map(res => res.body as AgreementResponse)
        );
    }

    /**
     * Utilise la fonction générée validateAgreement
     */
    validateAgreement(agreementId: number): Observable<AgreementResponse> {
        return agreementFunctions.validateAgreement(this.http, this.config.rootUrl, {id: agreementId})
        .pipe(
            map(res => res.body as AgreementResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteAgreement
     */
    deleteAgreement(agreementId: number): Observable<void> {
        return agreementFunctions.deleteAgreement(this.http, this.config.rootUrl, {id: agreementId})
        .pipe(
            map(res => res.body as void)
        );
    }

}
