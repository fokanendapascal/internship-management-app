import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInternship } from '../services/InternshipService'; 
import { listCompanies } from '../services/CompanyService';

const NewInternshipComponent = () => {

    const [companies, setCompanies] = useState([]);

    const navigator = useNavigate();
    const [newInternship, setNewInternship] = useState({
        title: '',
        description: '',
        city: '',
        country: '',
        startDate: '',
        endDate: '',
        isActive: true,
        isPaid: true,
        company: { id: '' } // On stocke généralement l'ID de l'entreprise sélectionnée
    });

    // 1. Charger les entreprises au montage du composant
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await listCompanies();
                setCompanies(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des entreprises", error);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // 2. Gestion spécifique pour l'ID de l'entreprise
        if (name === "companyId") {
            setNewInternship({ 
                ...newInternship, 
                company: { id: value } 
            });
        } else {
            setNewInternship({
                ...newInternship,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Envoi des données:", newInternship);
            await createInternship(newInternship);
            navigator('/internships');
        } catch (error) {
            console.error("Erreur lors de la création", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Publier une offre de stage</h3>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Entreprise partenaire</label>
                    <select 
                        name="companyId" 
                        className="form-select" 
                        value={newInternship.company.id} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Sélectionner une entreprise --</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name} ({company.city})
                            </option>
                        ))}
                    </select>
                    <div className="form-text">L'entreprise doit être déjà enregistrée dans le système.</div>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Titre du stage</label>
                                <input type="text" name="title" className="form-control" 
                                    value={newInternship.title} onChange={handleChange} required />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Ville</label>
                                <input type="text" name="city" className="form-control" 
                                    value={newInternship.city} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pays</label>
                                <input type="text" name="country" className="form-control" 
                                    value={newInternship.country} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Date de début</label>
                                <input type="date" name="startDate" className="form-control" 
                                    value={newInternship.startDate} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Date de fin</label>
                                <input type="date" name="endDate" className="form-control" 
                                    value={newInternship.endDate} onChange={handleChange} required />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">Description</label>
                                <textarea name="description" className="form-control" rows="4"
                                    value={newInternship.description} onChange={handleChange}></textarea>
                            </div>

                            <div className="col-md-12 mb-3 d-flex gap-4">
                                <div className="form-check">
                                    <input type="checkbox" name="isPaid" className="form-check-input" id="isPaid"
                                        checked={newInternship.isPaid} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="isPaid">Stage rémunéré</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="isActive" className="form-check-input" id="isActive"
                                        checked={newInternship.isActive} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="isActive">Activer l'offre</label>
                                </div>
                            </div>
                        </div>

                        <div className="text-end mt-4">
                            <button type="button" className="btn btn-secondary me-2" onClick={() => navigator(-1)}>Annuler</button>
                            <button type="submit" className="btn btn-success px-4">Enregistrer le stage</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewInternshipComponent;