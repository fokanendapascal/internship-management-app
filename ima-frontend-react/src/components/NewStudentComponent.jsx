import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent } from '../services/StudentService';

const NewStudentComponent = () => {
    const { id, userId } = useParams();
    const navigator = useNavigate();

    const [newStudent, setNewStudent] = useState({
        studentCode: "",
        level: "",
        userId: userId || ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!id) return;

        const fetchStudent = async () => {
            try {
                setLoading(true);
                const response = await getStudent(id);
                const data = response.data;

                setNewStudent({
                    studentCode: data.studentCode || "",
                    level: data.level || "",
                    // On garde le userId de l'URL s'il est présent, sinon celui de la DB
                    userId: userId || data.userId || ""
                });
            } catch (error) {
                console.error("Erreur chargement etudiant", error);
                alert("Impossible de charger les données de l'étudiant.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id, userId]); // Ajout de userId dans les dépendances

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
        // Nettoyer l'erreur dès que l'utilisateur commence à écrire
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!newStudent.studentCode.trim()) validationErrors.studentCode = 'Le matricule est obligatoire';
        if (!newStudent.level.trim()) validationErrors.level = "Le niveau d'étude est obligatoire";
        
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true); // Désactiver le bouton pendant l'envoi
            if (id) {
                await updateStudent(id, newStudent);
                navigator('/students');
            } else {
                if (!userId) {
                    alert("ID Utilisateur manquant pour la création.");
                    return;
                }
                await createStudent(userId, newStudent);
                navigator('/students');
            }
        } catch (error) {
            console.error('Erreur lors de la soumission : ', error);
            alert("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className='text-center my-5'>Chargement....</div>;

    return (
        <div className='container my-4'>
            <h2 className='text-center mb-4'>
                {id ? "Modifier l'étudiant" : "Créer un nouvel étudiant"}
            </h2>

            {userId && !id && (
                <div className="alert alert-info">
                    Création d'un profil étudiant pour l'utilisateur ID : <strong>{userId}</strong>
                </div>
            )}

            <form className='border p-4 rounded shadow-sm bg-light' onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Code Étudiant</label>
                        <input
                            type="text"
                            className={`form-control ${errors.studentCode ? 'is-invalid' : ''}`}
                            name="studentCode"
                            value={newStudent.studentCode}
                            onChange={handleChange}
                        />
                        {errors.studentCode && <div className="invalid-feedback">{errors.studentCode}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Niveau (Level)</label>
                        <input
                            type="text"
                            className={`form-control ${errors.level ? 'is-invalid' : ''}`}
                            name="level"
                            value={newStudent.level}
                            onChange={handleChange}
                        />
                        {errors.level && <div className="invalid-feedback">{errors.level}</div>}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={() => navigator('/students')} className="btn btn-outline-secondary">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "En cours..." : (id ? "Enregistrer" : "Créer")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewStudentComponent;