import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTeacher, getTeacher, updateTeacher } from '../services/TeacherService';

const NewTeacherComponent = () => {
    const { id, userId } = useParams();
    const navigator = useNavigate();

    const [newTeacher, setNewTeacher] = useState({       
        department: "",
        grade: "",
        specialty: "",
        userId: userId || ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!id) return;

        const fetchTeacher = async () => {
            try {
                setLoading(true);
                const response = await getTeacher(id);
                const data = response.data;

                setNewTeacher({
                    department: data.department || "",
                    grade: data.grade || "",
                    specialty: data.specialty || "",
                    userId: userId || data.userId || ""
                });
            } catch (error) {
                console.error("Erreur chargement enseignant", error);
                alert("Erreur lors de la récupération des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [id, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTeacher(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!newTeacher.department.trim()) validationErrors.department = 'Le département est obligatoire';
        if (!newTeacher.grade.trim()) validationErrors.grade = 'Le grade est obligatoire';
        if (!newTeacher.specialty.trim()) validationErrors.specialty = 'La spécialité est obligatoire';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            if (id) {
                await updateTeacher(id, newTeacher);
                navigator('/teachers');
            } else {
                if (!userId) {
                    alert("ID Utilisateur manquant.");
                    return;
                }
                await createTeacher(userId, newTeacher);
                navigator('/teachers');
            }
        } catch (error) {
            console.error('Erreur lors de la soumission :', error);
            alert("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className="text-center my-5">Chargement...</div>;

    return (
        <div className='container my-4'>
            <h2 className="text-center mb-4">
                {id ? "Modifier l'enseignant" : "Créer un nouvel enseignant"}
            </h2>
            
            {userId && !id && (
                <div className="alert alert-info">
                    Profil enseignant pour l'utilisateur : <strong>{userId}</strong>
                </div>
            )}

            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <div className="row">
                    {/* Department */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Département</label>
                        <input
                            type="text"
                            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                            name="department"
                            value={newTeacher.department}
                            onChange={handleChange}
                        />
                        {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                    </div>

                    {/* Grade */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Grade</label>
                        <input
                            type="text"
                            className={`form-control ${errors.grade ? 'is-invalid' : ''}`}
                            name="grade"
                            value={newTeacher.grade}
                            onChange={handleChange}
                        />
                        {errors.grade && <div className="invalid-feedback">{errors.grade}</div>}
                    </div>
                </div>

                <div className="row">
                    {/* Specialty */}
                    <div className="col-md-12 mb-3">
                        <label className="form-label">Spécialité</label>
                        <input
                            type="text"
                            className={`form-control ${errors.specialty ? 'is-invalid' : ''}`}
                            name="specialty"
                            value={newTeacher.specialty}
                            onChange={handleChange}
                        />
                        {errors.specialty && <div className="invalid-feedback">{errors.specialty}</div>}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button type="button" onClick={() => navigator('/teachers')} className="btn btn-outline-secondary">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Enregistrement..." : (id ? "Enregistrer les modifications" : "Créer l'enseignant")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewTeacherComponent;