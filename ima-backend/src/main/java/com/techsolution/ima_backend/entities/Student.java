package com.techsolution.ima_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 2. Relation OneToOne: Un étudiant est un utilisateur, l'ID est mappé.
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    private String studentCode;
    private String level;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Application> applications;
}
