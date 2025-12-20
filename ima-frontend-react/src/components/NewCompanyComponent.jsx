import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createCompany, getCompany, updateCompany } from '../services/CompanyService';

const NewCompanyComponent = () => {

    const { id, userId } = useParams();

    const [newCompany, setNewCompany] = useState({       
        name: "",
        address: "",
        description: "",
        website: "",
        phone: "",
        professionalEmail: "",
        userId: userId || ""
    });

    const navigator = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // 1. Chargement des données en mode Edition
    useEffect(() => {
        if (!id) return;

        const fetchCompany = async () => {
            try {
                setLoading(true);
                const response = await getCompany(id);
                const data = response.data;

                setNewCompany({
                    name: data.name || "",
                    address: data.address || "",
                    description: data.description || "",
                    website: data.website || "",
                    phone: data.phone || "",
                    professionalEmail: data.professionalEmail || "",
                    userId: userId || data.userId || ""
                });
            } catch (error) {
                console.error("Erreur lors du chargement :", error);
                alert("Impossible de récupérer les données de l'entreprise.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCompany(prev => ({ ...prev, [name]: value }));
        // Nettoyage de l'erreur en temps réel
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // 2. Validation du formulaire
    const validateForm = () => {
        const newErrors = {};
        if (!newCompany.name.trim()) newErrors.name = "Le nom est obligatoire";
        if (!newCompany.address.trim()) newErrors.address = "L'adresse est obligatoire";
        if (!newCompany.description.trim()) newErrors.description = "La description est obligatoire";
        
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(newCompany.professionalEmail)) {
            newErrors.professionalEmail = "Email professionnel invalide";
        }

        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(newCompany.website)) {
            newErrors.website = "L'URL doit commencer par http:// ou https://";
        }

        if (!newCompany.phone.trim()) newErrors.phone = "Le numéro de téléphone est obligatoire";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) return;

        try {
            setLoading(true);
            if(id) {
                await updateCompany(id, newCompany);
                console.log('Company mis à jour');
                navigator('/companies');
            }else{
                if (!userId) {
                    alert("ID Utilisateur manquant pour la création.");
                    return;
                }
                await createCompany(userId, newCompany);
                console.log('Company créé')
                navigator('/companies');
            }
        }catch (error){
            console.error('Erreur lors de la sauvegarde :', error);
            const serverMsg = error.response?.data?.message || "Une erreur est survenue.";
            alert(serverMsg);
        }finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className="text-center my-5">Chargement des données...</div>;

    return (
        <div className='container my-4'>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h2 className="mb-0">{id ? "Modifier l'entreprise" : "Nouvelle Entreprise"}</h2>
                        </div>

                        {userId && !id && (
                            <div className="alert alert-info">
                                Création d'un profil entreprise pour l'utilisateur ID : <strong>{userId}</strong>
                            </div>
                        )}
                        
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nom de l'entreprise</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        name="name"
                                        value={newCompany.name}
                                        onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">{errors.name}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Adresse</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        name="address"
                                        value={newCompany.address}
                                        onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">{errors.address}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        name="description"
                                        rows="3"
                                        value={newCompany.description}
                                        onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">{errors.description}</div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Site Web</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                                            name="website"
                                            placeholder="https://..."
                                            value={newCompany.website}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.website}</div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Téléphone</label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={newCompany.phone}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.phone}</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Email Professionnel</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.professionalEmail ? 'is-invalid' : ''}`}
                                        name="professionalEmail"
                                        value={newCompany.professionalEmail}
                                        onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">{errors.professionalEmail}</div>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-light border" onClick={() => navigator('/companies')}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? "En cours..." : (id ? "Mettre à jour" : "Créer l'entreprise")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewCompanyComponent