package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.StudentRequest;
import com.techsolution.ima_backend.dtos.response.StudentResponse;
import com.techsolution.ima_backend.entities.Student;
import com.techsolution.ima_backend.services.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Students", description = "Api de gestion des etudiants")
public class StudentController {

    private final StudentService studentService;

    //Build add student REST API
    @PostMapping
    public ResponseEntity<StudentResponse> addStudent(@RequestParam Long userId,
                                                      @RequestBody StudentRequest studentRequest) {
        StudentResponse savedStudent = studentService.createStudent(userId, studentRequest);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    //Build get student REST API
    @GetMapping("{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable("id") Long studentId) {
        StudentResponse student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(student);
    }

    //Build all students REST API
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    //Build update student REST API
    @PutMapping("{id}")
    public ResponseEntity<StudentResponse> updateStudent(@PathVariable("id") Long studentId,
                                                         @RequestBody StudentRequest studentRequest) {
        StudentResponse updatedStudent = studentService.updateStudent(studentId, studentRequest);
        return ResponseEntity.ok(updatedStudent);
    }

    //Build delete student REST API
    @DeleteMapping("{id}")
    public ResponseEntity<StudentResponse> deleteStudent(@PathVariable("id") Long studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }
}
