import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../services/UserService';

const NewUserComponent = () => {
    const { id } = useParams(); 
    const navigator = useNavigate();

    const ROLE_LIST = [
        { id: 'ADMIN', name: 'Administrateur' },
        { id: 'TEACHER', name: 'Enseignant' },
        { id: 'STUDENT', name: 'Étudiant' },
        { id: 'COMPANY', name: 'Entreprise' },
        { id: 'USER', name: 'Utilisateur' },
    ];

    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        telephone: "",
        roles: []
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // --- 1. Chargement des données au montage ---
    useEffect(() => {
        if (id) {        
            getUser(id)
                .then((response) => {
                    const fetchedUser = response.data;
                    // Transformation des rôles : on ne garde que les IDs pour les checkboxes
                    if (fetchedUser.roles) {
                        fetchedUser.roles = fetchedUser.roles.map(role => 
                            typeof role === 'object' ? role.id : role
                        );
                    }
                    // On garde le mot de passe vide à l'édition pour ne pas écraser l'existant par erreur
                    setNewUser({ ...fetchedUser, password: "" });
                })
                .catch(error => {
                    console.error("Erreur chargement utilisateur:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    // --- 2. Gestionnaires d'événements ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (roleId) => {
        setNewUser(prev => {
            const isSelected = prev.roles.includes(roleId);
            const updatedRoles = isSelected
                ? prev.roles.filter(id => id !== roleId) // Retirer
                : [...prev.roles, roleId]; // Ajouter
            return { ...prev, roles: updatedRoles };
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!newUser.firstName.trim()) errors.firstName = 'Prénom requis';
        if (!newUser.lastName.trim()) errors.lastName = 'Nom requis';
        if (!newUser.email.trim()) errors.email = 'Email requis';
        // Mot de passe requis uniquement à la création
        if (!id && !newUser.password.trim()) errors.password = 'Mot de passe requis';
        if (!newUser.telephone.trim()) errors.telephone = 'Téléphone requis';
        if (newUser.roles.length === 0) errors.roles = 'Au moins un rôle requis';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const redirectAfterCreation = (userId, roles) => {
        if (roles.includes('STUDENT')) {
            navigator(`/students/new/${userId}`);
        } else if (roles.includes('TEACHER')) {
            navigator(`/teachers/new/${userId}`);
        } else if (roles.includes('COMPANY')) {
            navigator(`/companies/new/${userId}`);
        } else {
            navigator('/users'); // fallback
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (id) {
                // UPDATE
                await updateUser(id, newUser);
                
                console.log("Utilisateur mis à jour");
            } else {
                // CREATE
                const response = await createUser(newUser);
                const createdUser = response.data;

                redirectAfterCreation(createdUser.id, createdUser.roles);
                console.log("Utilisateur créé");
            } 
            navigator('/users');          
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
        }
    };

    if (loading) return <div className="text-center my-5">Chargement...</div>;

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">
                {id ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}
            </h2>

            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Prénom</label>
                        <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            name="firstName"
                            value={newUser.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Nom</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={newUser.lastName}
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                {!id && (
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                )}


                <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input
                        type="tel"
                        className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                        name="telephone"
                        value={newUser.telephone}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label d-block">Rôles attribués</label>
                    <div className="d-flex flex-wrap gap-3">
                        {ROLE_LIST.map(role => (
                            <div key={role.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`role-${role.id}`}
                                    checked={newUser.roles.includes(role.id)}
                                    onChange={() => handleRoleChange(role.id)}
                                />
                                <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                    {role.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.roles && <div className="text-danger small mt-1">{errors.roles}</div>}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" onClick={() => navigator('/users')} className="btn btn-outline-secondary">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Enregistrer les modifications" : "Créer l'utilisateur"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewUserComponent;








