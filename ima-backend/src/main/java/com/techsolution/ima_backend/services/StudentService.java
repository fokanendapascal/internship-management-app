package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.StudentRequest;
import com.techsolution.ima_backend.dtos.response.StudentResponse;


import java.util.List;

public interface StudentService {
    StudentResponse createStudent(Long userId, StudentRequest studentRequest);
    List<StudentResponse> getAllStudents();
    StudentResponse getStudentById(Long studentId);
    StudentResponse updateStudent(Long studentId, StudentRequest studentRequest);
    void deleteStudent(Long studentId);
}
