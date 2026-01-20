import { StudentRequest } from './../../core/api/models/student-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { StudentResponse } from '../../core/api/models';

import * as studentFunctions from '../../core/api/functions';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée addStudent
     */
    createStudent(studentId: number, student:  StudentRequest): Observable<StudentResponse> {
        return studentFunctions.addStudent(this.http, this.config.rootUrl, {userId: studentId, body: student})
        .pipe(
            map(res => res.body as StudentResponse)
        );
    }

    /**
     * Utilise la fonction générée getStudentByTd
     */
    getStudentById(studentId: number): Observable<StudentResponse>{
        return studentFunctions.getStudentById(this.http, this.config.rootUrl, {id: studentId})
        .pipe(
            map(res => res.body as StudentResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllStudents
     */
    getAllStudents(): Observable<StudentResponse[]> {
        return studentFunctions.getAllStudents(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as StudentResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateStudent
     */
    updateStudent(studentId: number, student: StudentRequest): Observable<StudentResponse> {
        return studentFunctions.updateStudent(this.http, this.config.rootUrl, {id: studentId, body: student})
        .pipe(
            map(res => res.body as StudentResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteStudent
     */
    deleteStudent(studentId: number): Observable<void> {
        return studentFunctions.deleteStudent(this.http, this.config.rootUrl, {id: studentId})
        .pipe(
            map(res => res.body as void)
        );
    }

}

