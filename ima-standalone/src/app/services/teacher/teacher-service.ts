import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../../core/api/api-configuration';
import { TeacherRequest, TeacherResponse } from '../../core/api/models';
import { map, Observable } from 'rxjs';
import * as teacherFunctions from '../../core/api/functions';

@Injectable({
    providedIn: 'root',
})
export class TeacherService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration
    ){}

    /**
     * Utilise la fonction générée createTeacher
     */
    createTeacher(teacherId: number, teacher: TeacherRequest): Observable<TeacherResponse> {
        return teacherFunctions.createTeacher(this.http, this.config.rootUrl, {userId: teacherId, body: teacher})
        .pipe(
            map(res => res.body as TeacherResponse)
        );
    }

    /**
     * Utilise la fonction générée getTeacher
     */
    getTeacher(teacherId: number): Observable<TeacherResponse>{
        return teacherFunctions.getTeacher(this.http, this.config.rootUrl, {id: teacherId})
        .pipe(
            map(res => res.body as TeacherResponse)
        );
    }

    /**
     * Utilise la fonction générée getAllTeachers
     */
    getAllTeachers(): Observable<TeacherResponse[]> {
        return teacherFunctions.getAllTeachers(this.http, this.config.rootUrl)
        .pipe(
            map(res => res.body as TeacherResponse[])
        );
    }

    /**
     * Utilise la fonction générée updateTeacher
     */
    updateTeacher(teacherId: number, teacher: TeacherRequest): Observable<TeacherResponse> {
        return teacherFunctions.updateTeacher(this.http, this.config.rootUrl, {id: teacherId, body: teacher})
        .pipe(
            map(res => res.body as TeacherResponse)
        );
    }

    /**
     * Utilise la fonction générée deleteTeacher
     */
    deleteTeacher(teacherId: number): Observable<void> {
        return teacherFunctions.deleteTeacher(this.http, this.config.rootUrl, {id: teacherId})
        .pipe(
            map(res => res.body as void)
        );
    }

}
