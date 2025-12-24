import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { deleteApplication, listApplications } from '../services/ApplicationService';

const ApplicationsPage = () => {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const navigator = useNavigate();

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const response = await listApplications();
            setApplications(response.data); 
        } catch (error) {
            console.error("Erreur lors de la récupération des candidatures", error);
            setErrors("Erreur lors du chargement des candidatures.");
        } finally {
            setLoading(false);
        }
    }

    // Correction ici : Ajout du tableau de dépendances []
    useEffect(() => {
        fetchApplications();
    }, []); 

    const addNewApplication = () => navigator('/applications/new');
    const editApplication = (id) => navigator(`/applications/edit/${id}`);

    const removeApplication = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir désactiver cette candidature?")) {
            try {
                await deleteApplication(id);
                // Rafraîchir la liste après désactivation
                fetchApplications();
            } catch (error) {
                console.error("Erreur suppression", error);
                alert("Erreur lors de la suppression.");
            }
        }
    }

    if (loading && applications.length === 0) {
        return <div className='text-center my-5'><div className="spinner-border text-primary"></div><p>Chargement...</p></div>
    } 

    const filteredApplications = applications.filter(app => {
        const studentName = `${app.student?.firstName} ${app.student?.lastName}`.toLowerCase();
        const internshipTitle = app.internship?.title?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        
        return studentName.includes(search) || internshipTitle.includes(search);
    });

    return (
        <div className='container my-5'>
            <h2 className="text-center mb-4">Liste des Candidatures</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={addNewApplication}>
                    <i className="fa fa-plus"></i> Ajouter une candidature
                </button>
                <button className="btn btn-outline-secondary" onClick={fetchApplications} disabled={loading}>
                    <i className="fa fa-refresh"></i> Actualiser
                </button>
            </div>

            {errors && <div className='alert alert-danger'>{errors}</div>}
            
            <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Rechercher par étudiant ou titre de stage..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Date Candidature</th>
                            <th>Status</th>
                            <th>cvUrl</th>
                            <th>coverLetter</th>
                            <th>Student</th>
                            <th>Internship</th>
                            <th>Agreement</th>
                            <th className="text-center">Actions</th>
                        </tr>    
                    </thead>
                    <tbody>
                        {filteredApplications.map(app => (
                            <tr key={app.id}>
                                <td className="fw-bold">{new Date(app.applicationDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${
                                        app.status === 'ACCEPTED' ? 'bg-success' : 
                                        app.status === 'REJECTED' ? 'bg-danger' : 
                                        'bg-warning text-dark'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td><a href={app.cvUrl} target="_blank" rel="noreferrer">Voir CV</a></td>
                                <td>{app.coverLetter.substring(0, 20)}...</td>
                                
                                {/* Affichage des noms issus des SummaryResponses */}
                                <td>{app.student?.firstName} {app.student?.lastName}</td>
                                <td>{app.internship?.title} ({app.internship?.city})</td>
                                <td>{app.agreement ? `ID: ${app.agreement.id}` : 'N/A'}</td>

                                <td className="text-center">
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => editApplication(app.id)}>
                                            Modifier
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeApplication(app.id)} disabled={loading}>
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applications.length === 0 && !loading && <p className="text-center">Aucune candidature disponible.</p>}
            </div>   
        </div>
    );
}

export default ApplicationsPage;