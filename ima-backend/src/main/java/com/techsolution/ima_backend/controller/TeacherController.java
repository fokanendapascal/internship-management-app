package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.TeacherRequest;
import com.techsolution.ima_backend.dtos.response.TeacherResponse;
import com.techsolution.ima_backend.entities.Teacher;
import com.techsolution.ima_backend.services.TeacherService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/teachers")
@Tag(name = "Teachers", description = "Api de gestion des enseignants")
public class TeacherController {

    private final TeacherService teacherService;

    //Build add teacher REST API
    @PostMapping
    public ResponseEntity<TeacherResponse> createTeacher(@RequestParam Long userId,
                                                         @RequestBody TeacherRequest teacherRequest) {
        TeacherResponse savedTeacher = teacherService.createTeacher(userId, teacherRequest);
        return new ResponseEntity<>(savedTeacher, HttpStatus.CREATED);
    }

    //Build get teacher REST API
    @GetMapping("{id}")
    public ResponseEntity<TeacherResponse> getTeacher(@PathVariable("id") Long teacherId) {
        TeacherResponse teacher = teacherService.getTeacherById(teacherId);
        return ResponseEntity.ok(teacher);
    }

    //Build get all teachers REST API
    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        List<TeacherResponse> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    //Build update teacher REST API
    @PutMapping("{id}")
    public ResponseEntity<TeacherResponse> updateTeacher(@PathVariable("id") Long teacherId,
                                                         @RequestBody TeacherRequest teacherRequest) {
        TeacherResponse updatedTeacher = teacherService.updateTeacherById(teacherId, teacherRequest);
        return ResponseEntity.ok(updatedTeacher);
    }

    //Build delete teacher REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable("id") Long teacherId) {
        teacherService.deleteTeacherById(teacherId);
        return ResponseEntity.noContent().build();
    }
}
