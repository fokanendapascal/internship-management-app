import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { CompanyRequest, CompanyResponse } from '../../core/api/models';
import * as companyFunctions from '../../core/api/functions';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createCompany
     */
    createCompany(companyId: number, company: CompanyRequest): Observable<CompanyResponse> {
        return companyFunctions.createCompany(this.http, this.config.rootUrl, {userId: companyId, body: company})
        .pipe(
            map(res => res.body as CompanyResponse)
        );
    }

    /**
     * Utilise la fonction générée getCompanyById
     */
    getCompanyById(companyId: number): Observable<CompanyResponse>{
        return companyFunctions.getCompanyById(this.http, this.config.rootUrl, {id: companyId})
        .pipe(
            map(res => res.body as CompanyResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllCompanies
     */
    getAllCompanies(): Observable<CompanyResponse[]> {
        return companyFunctions.getAllCompanies(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as CompanyResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateCompany
     */
    updateCompany(companyId: number, company: CompanyRequest): Observable<CompanyResponse> {
        return companyFunctions.updateCompany(this.http, this.config.rootUrl, {id: companyId, body: company})
        .pipe(
            map(res => res.body as CompanyResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteCompany
     */
    deleteCompany(companyId: number): Observable<void> {
        return companyFunctions.deleteCompany(this.http, this.config.rootUrl, {id: companyId})
        .pipe(
            map(res => res.body as void)
        );
    }
}
