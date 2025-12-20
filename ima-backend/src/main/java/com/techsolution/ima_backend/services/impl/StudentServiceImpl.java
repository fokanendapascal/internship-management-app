package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.StudentRequest;
import com.techsolution.ima_backend.dtos.response.StudentResponse;
import com.techsolution.ima_backend.entities.Student;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.StudentMapper;
import com.techsolution.ima_backend.repository.StudentRepository;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------
    @Override
    public StudentResponse createStudent(Long userId, StudentRequest studentRequest) {


        // 1️⃣ Récupération du User EXISTANT
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email : " + userId
                        )
                );

        // 2️⃣ Vérification métier (optionnelle mais recommandée)
        if (user.getStudent() != null) {
            throw new IllegalStateException("This user is already a student");
        }

        // 3️⃣ Création du Student
        Student student = StudentMapper.toEntity(studentRequest);
        student.setUser(user);
        user.setStudent(student);

        Student savedStudent = studentRepository.save(student);

        return StudentMapper.toResponseDto(savedStudent);
    }

    // --------------------------------------------------
    // READ ALL
    // --------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------
    // READ BY ID
    // --------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + studentId
                        )
                );

        return StudentMapper.toResponseDto(student);
    }

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------
    @Override
    public StudentResponse updateStudent(Long studentId, StudentRequest request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + studentId
                        )
                );

        student.setStudentCode(request.getStudentCode());
        student.setLevel(request.getLevel());

        Student updatedStudent = studentRepository.save(student);

        return StudentMapper.toResponseDto(updatedStudent);
    }

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------
    @Override
    public void deleteStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + studentId
                        )
                );

        studentRepository.delete(student);
    }
}


