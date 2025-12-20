package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.TeacherRequest;
import com.techsolution.ima_backend.dtos.response.TeacherResponse;

import java.util.List;

public interface TeacherService {
    TeacherResponse createTeacher(Long userId, TeacherRequest teacherRequest);
    List<TeacherResponse> getAllTeachers();
    TeacherResponse getTeacherById(Long id);
    TeacherResponse updateTeacherById(Long id, TeacherRequest teacherRequest);
    void deleteTeacherById(Long id);
}
