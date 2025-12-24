import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAgreement } from '../services/AgreementService';
import { listTeachers } from '../services/TeacherService';
import { listApplications } from '../services/ApplicationService';

const NewAgreementComponent = () => {
    const navigate = useNavigate();
    
    // États pour les listes déroulantes
    const [teachers, setTeachers] = useState([]);
    const [applications, setApplications] = useState([]); // Ajouté
    
    // États pour la sélection
    const [selectedAppId, setSelectedAppId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [agreement, setAgreement] = useState({
        startDate: '',
        endDate: '',
        status: 'DRAFT',
        validatorId: '',
        documentPdfUrl: ''
    });
    
    useEffect(() => {
        // Charger les enseignants
        listTeachers().then(res => setTeachers(res.data));
        // Charger les candidatures pour obtenir l'applicationId
        listApplications().then(res => setApplications(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgreement({ ...agreement, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppId) {
            alert("Veuillez sélectionner une candidature.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            // On envoie enfin un ID valide au lieu de undefined
            await createAgreement(selectedAppId, agreement);
            navigate('/agreements');
        } catch (error) {
            console.error("Erreur création convention", error);
            alert("Erreur lors de la création de la convention.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-dark text-white text-center">
                    <h3 className="mb-0">Génération de Convention</h3>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* --- AJOUT DU SÉLECTEUR D'APPLICATION (Résout l'erreur 400/401) --- */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold text-primary">Candidature concernée</label>
                                <select 
                                    className="form-select border-primary" 
                                    value={selectedAppId} 
                                    onChange={(e) => setSelectedAppId(e.target.value)} 
                                    required
                                >
                                    <option value="">-- Choisir la candidature --</option>
                                    {applications.map(app => (
                                        <option key={app.id} value={app.id}>
                                            ID: {app.id} - {app.internshipTitle} ({app.studentName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Date de début du stage</label>
                                <input type="date" name="startDate" className="form-control" 
                                    value={agreement.startDate} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Date de fin du stage</label>
                                <input type="date" name="endDate" className="form-control" 
                                    value={agreement.endDate} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Enseignant Validateur</label>
                                <select name="validatorId" className="form-select" 
                                    value={agreement.validatorId} onChange={handleChange} required>
                                    <option value="">-- Sélectionner un enseignant --</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Statut Initial</label>
                                <select name="status" className="form-select" 
                                    value={agreement.status} onChange={handleChange}>
                                    <option value="DRAFT">Brouillon (DRAFT)</option>
                                    <option value="PENDING_VALIDATION">En attente de validation</option>
                                    <option value="VALIDATED">Validée par l'enseignant </option>
                                    <option value="SENT_FOR_SIGNATURE">Envoyée aux parties pour signature </option>
                                    <option value="SIGNED">Convention Signée </option>
                                    <option value="CANCELED">Convention Annulée </option>
                                    
                                </select>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                Retour
                            </button>
                            <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                                {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : "Créer la Convention"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewAgreementComponent;