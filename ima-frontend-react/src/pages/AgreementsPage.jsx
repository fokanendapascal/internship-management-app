import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteAgreement, listAgreements } from '../services/AgreementService';
import { getStatusBadge } from '../styles/Util';

const AgreementsPage = () => {

    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const [statusFilter, setStatusFilter] = useState('ALL');

    const navigator = useNavigate();

    const fetchAgreements = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const response = await listAgreements();
            setAgreements(response.data); 
        } catch (error) {
            console.error("Erreur lors de la récupération des conventions", error);
            setErrors("Erreur lors du chargement des conventions.");
        } finally {
            setLoading(false);
        }
    }

    // Correction ici : Ajout du tableau de dépendances []
    useEffect(() => {
        fetchAgreements();
    }, []); 

    const addNewAgreement = () => navigator(`/agreements/new`);
    const editAgreement = (id) => navigator(`/agreements/edit/${id}`);

    const removeAgreement = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir désactiver cette convention?")) {
            try {
                await deleteAgreement(id);
                // Rafraîchir la liste après désactivation
                fetchAgreements();
            } catch (error) {
                console.error("Erreur suppression", error);
                alert("Erreur lors de la suppression.");
            }
        }
    }

    if (loading && agreements.length === 0) {
        return <div className='text-center my-5'><div className="spinner-border text-primary"></div><p>Chargement...</p></div>
    } 

    // Cette logique doit être placée juste avant le return()
    const filteredAgreements = statusFilter === 'ALL' 
        ? agreements 
        : agreements.filter(agreement => agreement.status === statusFilter);

    return (
        <div className='container my-5'>
            <h2 className="text-center mb-4">Liste des Conventions</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={addNewAgreement}>
                    <i className="fa fa-plus"></i> Ajouter une convention
                </button>
                <button className="btn btn-outline-secondary" onClick={fetchAgreements} disabled={loading}>
                    <i className="fa fa-refresh"></i> Actualiser
                </button>
            </div>

            {errors && <div className='alert alert-danger'>{errors}</div>}
            
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="fa fa-filter"></i></span>
                        <select 
                            className="form-select" 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tous les statuts</option>
                            <option value="DRAFT">Brouillon (DRAFT)</option>
                            <option value="PENDING_VALIDATION">En attente de validation</option>
                            <option value="VALIDATED">Validée</option>
                            <option value="SENT_FOR_SIGNATURE">En cours de signature</option>
                            <option value="SIGNED">Signée (SIGNED)</option>
                            <option value="CANCELED">Annulée</option>
                        </select>
                    </div>
                </div>
            </div>



            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Dates (Début/Fin)</th>
                            <th>Statut</th>
                            <th>Document</th>
                            <th>Candidature / Stage</th>
                            <th>Validateur</th>
                            <th className="text-center">Actions</th>
                        </tr>    
                    </thead>
                    <tbody>
                        {filteredAgreements.map(agreement => (
                            <tr key={agreement.id}>
                                <td>
                                    <div className="small">Du: {new Date(agreement.startDate).toLocaleDateString()}</div>
                                    <div className="small">Au: {new Date(agreement.endDate).toLocaleDateString()}</div>
                                </td>
                                <td>
                                    <span className={`badge ${getStatusBadge(agreement.status)}`}>
                                        {agreement.status}
                                    </span>
                                </td>
                                <td>
                                    {agreement.documentPdfUrl ? (
                                        <a href={agreement.documentPdfUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-link">
                                            <i className="fa fa-file-pdf-o"></i> PDF
                                        </a>
                                    ) : "Pas de doc"}
                                </td>
                                <td>
                                    {agreement.application?.internship?.title || "N/A"}
                                </td>
                                <td>
                                    {agreement.validator ? `${agreement.validator.lastName}` : "En attente"}
                                </td>

                                <td className="text-center">
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => editAgreement(agreement.id)}>
                                            Modifier
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeAgreement(agreement.id)} disabled={loading}>
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {agreements.length === 0 && !loading && <p className="text-center">Aucune convention disponible.</p>}
            </div>   
        </div>
    );
}

export default AgreementsPage;