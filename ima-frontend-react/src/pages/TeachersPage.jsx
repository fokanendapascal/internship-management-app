import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteTeacher, listTeachers } from '../services/TeacherService';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Étape 1 : Nouvel état pour la recherche
    const [searchTerm, setSearchTerm] = useState("");

    const navigator = useNavigate();

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await listTeachers();
            setTeachers(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des enseignants", err);
            setError("Erreur lors du chargement des enseignants.");
        } finally {
            setLoading(false);
        } 
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Étape 2 : Filtrage dynamique des enseignants
    const filteredTeachers = teachers.filter(teacher => 
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const removeTeacher = async (id) => {
        if(window.confirm("Supprimer cet enseignant ?")){
            try {
                await deleteTeacher(id);
                fetchTeachers();
            } catch (err) {
                console.error("Erreur lors de la suppression de l'enseignant", err);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    if(loading && teachers.length === 0) return <div className='text-center my-5'>Chargement...</div>;

    return (
        <div className='container my-5'>
            <h2 className='text-center mb-4'>Enseignants enregistrés</h2>

            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <button className="btn btn-outline-secondary" onClick={() => navigator('/users')}>
                    <i className="fa fa-arrow-left"></i> Retour
                </button>

                {/* Étape 3 : Barre de recherche par département ou spécialité */}
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text bg-white border-end-0">
                        <i className="fa fa-search text-muted"></i>
                    </span>
                    <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Rechercher par département ou spécialité..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className='alert alert-danger text-center'>{error}</div>}

            <div className='table-responsive'>
                <table className='table table-striped table-hover shadow-sm align-middle'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Département</th>
                            <th>Grade / Spécialité</th>
                            <th>Conventions</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Étape 4 : On utilise filteredTeachers au lieu de teachers */}
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                            {teacher.department}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>{teacher.grade}</strong><br/>
                                        <small className="text-muted">{teacher.specialty}</small>
                                    </td>
                                    <td>
                                        {teacher.validatedAgreements?.length || 0} convention(s)
                                    </td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            <button className='btn btn-sm btn-outline-warning' onClick={() => navigator(`/teachers/edit/${teacher.id}`)}>
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button className='btn btn-sm btn-outline-danger' onClick={() => removeTeacher(teacher.id)}>
                                                <i className='fa fa-trash'></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    Aucun enseignant ne correspond à votre recherche "<strong>{searchTerm}</strong>"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeachersPage;