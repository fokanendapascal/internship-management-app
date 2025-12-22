import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAgreement } from '../services/AgreementService';
import { listTeachers } from '../services/TeacherService';

const NewAgreementComponent = () => {
    const navigate = useNavigate();
    const { applicationId } = useParams(); // Optionnel : si on crée l'accord depuis une candidature spécifique

    const [teachers, setTeachers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [agreement, setAgreement] = useState({
        startDate: '',
        endDate: '',
        status: 'DRAFT',
        validatorId: '',
        documentPdfUrl: ''
    });

    useEffect(() => {
        // Charger la liste des enseignants pour le sélecteur "validatorId"
        listTeachers().then(res => setTeachers(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgreement({ ...agreement, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // On peut passer l'applicationId via l'URL ou le corps de la requête selon votre API
            await createAgreement(applicationId, agreement);
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