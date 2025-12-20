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
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    private String department;
    private String grade;
    private String specialty;

    // Si l'enseignant valide les conventions (Agreement), ajouter la relation inverse ici :
    @OneToMany(mappedBy = "validator")
    private List<Agreement> validatedAgreements;
}
