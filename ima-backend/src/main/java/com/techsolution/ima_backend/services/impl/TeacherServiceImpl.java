package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.TeacherRequest;
import com.techsolution.ima_backend.dtos.response.TeacherResponse;
import com.techsolution.ima_backend.entities.Teacher;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.TeacherMapper;
import com.techsolution.ima_backend.repository.TeacherRepository;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TeacherResponse createTeacher(Long userId, TeacherRequest teacherRequest) {

        // 1️⃣ Récupération du User EXISTANT
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email : " + userId
                        )
                );

        // 2️⃣ Vérification métier (optionnelle mais recommandée)
        if (user.getTeacher() != null) {
            throw new IllegalStateException("This user is already a teacher");
        }

        Teacher teacher = TeacherMapper.toEntity(teacherRequest);

        teacher.setUser(user);
        user.setTeacher(teacher);

        Teacher savedTeacher = teacherRepository.save(teacher);
        return TeacherMapper.toResponseDto(savedTeacher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();

        return teachers.stream()
                .map(TeacherMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Teacher is not exists with given id " + id ));

        return TeacherMapper.toResponseDto(teacher);
    }

    @Override
    @Transactional
    public TeacherResponse updateTeacherById(Long id, TeacherRequest teacherRequest) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Teacher is not exists with given id " + id ));

        teacher.setDepartment(teacherRequest.getDepartment());
        teacher.setGrade(teacherRequest.getGrade());
        teacher.setSpecialty(teacherRequest.getSpecialty());

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return TeacherMapper.toResponseDto(updatedTeacher);
    }

    @Override
    @Transactional
    public void deleteTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Teacher is not exists with given id " + id ));

        teacherRepository.deleteById(id);
    }
}
