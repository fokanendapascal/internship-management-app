import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteStudent, listStudents } from '../services/StudentService';

const StudentsPage = () => {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigator = useNavigate();

    const fetchStudents = async() => {
        try {
            setLoading(true);
            setError(null);
            const response = await listStudents();
            setStudents(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des étudiants', err);
            setError('Erreur lors du chargement des étudiants.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    const editStudent = (id) => navigator(`/students/edit/${id}`); 

    const removeStudent = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
            try {
                // On ne met pas setLoading(true) ici pour éviter de faire disparaître tout le tableau
                await deleteStudent(id);
                fetchStudents(); 
            } catch (err) {
                console.error(`Erreur suppression:`, err);
                alert("Erreur lors de la suppression. L'étudiant peut avoir des candidatures liées.");
            }
        }
    };

    if (loading && students.length === 0) {
        return <div className="text-center my-5">Chargement de la liste...</div>;
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Étudiants enregistrés</h2>

            <button className="btn btn-outline-secondary mb-3" onClick={() => navigator('/users')}>
                <i className="fa fa-arrow-left"></i> Retour
            </button>

            {error && <div className="alert alert-danger text-center">{error}</div>}
            
            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Code Étudiant</th>
                            <th>Niveau</th>
                            <th>User ID</th>
                            <th>Candidatures (Stages)</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td className="fw-bold">
                                    {student.studentCode} 
                                    {student.submittedApplications && student.submittedApplications.length > 0 && (
                                        <span className="badge rounded-pill bg-primary ms-2">
                                            {student.submittedApplications.length}
                                        </span>
                                    )}
                                </td>
                                <td>{student.level}</td>
                                <td><span className="badge bg-light text-dark">ID: {student.userId}</span></td>

                                <td>
                                    {student.submittedApplications && student.submittedApplications.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {student.submittedApplications.map(app => (
                                                <div key={app.id} className="d-flex flex-column border rounded p-1 bg-white shadow-sm" style={{minWidth: '150px'}}>
                                                    <span className="badge bg-primary mb-1">
                                                        {app.internship ? app.internship.title : "Stage inconnu"}
                                                    </span>
                                                    <div className="d-flex justify-content-between align-items-center px-1" style={{fontSize: '0.7rem'}}>
                                                        <span className="text-muted italic">
                                                            {new Date(app.applicationDate).toLocaleDateString()}
                                                        </span>
                                                        <span className={`fw-bold ${app.status === 'ACCEPTED' ? 'text-success' : 'text-warning'}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted small">Aucune candidature</span>
                                    )}
                                </td>    
                                
                                <td className="text-center">
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => editStudent(student.id)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger" 
                                            onClick={() => removeStudent(student.id)}
                                            disabled={loading}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentsPage;