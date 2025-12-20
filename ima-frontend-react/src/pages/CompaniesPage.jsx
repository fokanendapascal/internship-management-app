import React, { useEffect, useState } from 'react'
import { deleteCompany, listCompanies } from '../services/CompanyService';
import { useNavigate } from 'react-router-dom';

const CompaniesPage = () => {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigator = useNavigate();

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await listCompanies();
            setCompanies(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des entreprises", err);
            setError("Erreur lors du chargement des entreprises.");
        } finally {
            setLoading(false);
        } 
    };
    
    useEffect(() => {
        fetchCompanies();
    }, []);

    const editCompany = (id) => navigator(`/companies/edit/${id}`);

    const removeCompany = async (id) => {
        if(window.confirm("Etes-vous sûr de vouloir supprimer cette entreprise ?")){
            try {
                await deleteCompany(id);
                fetchCompanies();
            } catch (err) {
                console.error(`Erreur lors de la suppression`, err);
                alert("Erreur lors de la suppression. Vérifiez si des données sont liées.");
            }
        }
    };

    if(loading && companies.length === 0) return <div className='text-center my-5'>Chargement...</div>;

    return (
        <div className='container my-5'>
            <h2 className='text-center mb-4 text-primary'>Répertoire des Entreprises</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-outline-secondary" onClick={() => navigator('/users')}>
                    <i className="fa fa-arrow-left"></i> Retour
                </button>
                <button className="btn btn-primary" onClick={fetchCompanies} disabled={loading}>
                    <i className="fa fa-refresh"></i> Actualiser
                </button>
            </div>

            {error && <div className='alert alert-danger text-center'>{error}</div>}

            <div className='table-responsive'>
                <table className='table table-striped table-hover shadow-sm align-middle'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Nom</th>
                            <th>Localisation</th>
                            <th>Contact / Email</th>
                            <th>Site Web</th>
                            <th>Stages Publiés</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id}>    
                                <td className="fw-bold">
                                    {company.name} 
                                    {company.publishedInternships && (
                                        <span className={`badge rounded-pill ms-2 ${company.publishedInternships.length > 0 ? 'bg-primary' : 'bg-secondary opacity-50'}`}>
                                            {company.publishedInternships.length} stage{company.publishedInternships.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </td>
                                <td><small>{company.address}</small></td>
                                <td>
                                    {company.phone}<br/>
                                    <small><a href={`mailto:${company.professionalEmail}`}>{company.professionalEmail}</a></small>
                                </td>
                                <td>
                                    {company.website && (
                                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer">
                                            Lien <i className="fa fa-external-link"></i>
                                        </a>
                                    )}
                                </td>
                                
                                {/* CORRECTION : On traite l'objet InternshipSummaryResponse ici */}
                                <td>
                                    {company.publishedInternships && company.publishedInternships.length > 0 ? (
                                        <ul className="list-unstyled mb-0" style={{ fontSize: '0.8rem' }}>
                                            {company.publishedInternships.map(internship => (
                                                <li key={internship.id} className="text-truncate" style={{ maxWidth: '200px' }}>
                                                    • {internship.title}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="badge bg-light text-dark">Aucun stage</span>
                                    )}
                                </td>
                                
                                <td className="text-center">
                                    <div className="btn-group">
                                        <button className='btn btn-sm btn-outline-warning' onClick={() => editCompany(company.id)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className='btn btn-sm btn-outline-danger' onClick={() => removeCompany(company.id)} disabled={loading}>
                                            <i className='fa fa-trash'></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CompaniesPage;