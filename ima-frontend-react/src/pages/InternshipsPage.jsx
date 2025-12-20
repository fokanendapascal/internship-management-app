import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deactivateInternship, listInternships } from '../services/InternshipService';

const InternshipsPage = () => {

    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const navigator = useNavigate();

    const fetchInternships = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const response = await listInternships();
            setInternships(response.data); 
        } catch (error) {
            console.error("Erreur lors de la récupération des offres", error);
            setErrors("Erreur lors du chargement des offres de stage.");
        } finally {
            setLoading(false);
        }
    }
    
    // Correction ici : Ajout du tableau de dépendances []
    useEffect(() => {
        fetchInternships();
    }, []); 

    const addNewInternship = () => navigator('/internships/new');
    const editInternship = (id) => navigator(`/internships/edit/${id}`);

    const removeInternship = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir désactiver cette offre de stage ?")) {
            try {
                await deactivateInternship(id);
                // Rafraîchir la liste après désactivation
                fetchInternships();
            } catch (error) {
                console.error("Erreur suppression", error);
                alert("Erreur lors de la suppression.");
            }
        }
    }

    if (loading && internships.length === 0) {
        return <div className='text-center my-5'><div className="spinner-border text-primary"></div><p>Chargement...</p></div>
    } 

    return (
        <div className='container my-5'>
            <h2 className="text-center mb-4">Liste des Offres de Stage</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={addNewInternship}>
                    <i className="fa fa-plus"></i> Ajouter une offre
                </button>
                <button className="btn btn-outline-secondary" onClick={fetchInternships} disabled={loading}>
                    <i className="fa fa-refresh"></i> Actualiser
                </button>
            </div>

            {errors && <div className='alert alert-danger'>{errors}</div>}
            
            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Titre</th>
                            <th>Ville</th>
                            <th>Dates</th>
                            <th>Statut</th>
                            <th>Rémunéré</th>
                            <th>Entreprise</th>
                            <th className="text-center">Actions</th>
                        </tr>    
                    </thead>
                    <tbody>
                        {internships.map(internship => (
                            <tr key={internship.id}>
                                <td className="fw-bold">{internship.title}</td>
                                <td>{internship.city}, {internship.country}</td>
                                <td>
                                    <small>
                                        Du : {new Date(internship.startDate).toLocaleDateString()}<br/>
                                        Au : {new Date(internship.endDate).toLocaleDateString()}
                                    </small>
                                </td>
                                <td>
                                    <span className={`badge ${internship.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {internship.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td>{internship.isPaid ? '✅ Oui' : '❌ Non'}</td>
                                <td>
                                    {internship.company ? (
                                        <div>
                                            <strong>{internship.company.name}</strong>
                                            <br />
                                            <small>
                                                <a href={internship.company.website.startsWith('http') ? internship.company.website : `https://${internship.company.website}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-decoration-none">
                                                Visiter le site
                                                </a>
                                            </small>
                                        </div>
                                    ) : (
                                        <span className="text-muted">Non spécifiée</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => editInternship(internship.id)}>
                                            Modifier
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeInternship(internship.id)} disabled={loading}>
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {internships.length === 0 && !loading && <p className="text-center">Aucune offre disponible.</p>}
            </div>   
        </div>
    )
}

export default InternshipsPage;