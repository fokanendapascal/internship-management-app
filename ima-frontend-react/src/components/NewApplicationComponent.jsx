import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../services/ApplicationService';
import { listInternships } from '../services/InternshipService';
import { listStudents } from '../services/StudentService';

const NewApplicationComponent = () => {

    const navigator = useNavigate();
    
    const [internships, setInternships] = useState([]);
    const [students, setStudents] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Nouvel état pour stocker le fichier binaire PDF
    const [cvFile, setCvFile] = useState(null);

    const [newApplication, setNewApplication] = useState({
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        coverLetter: '',
        internshipId: '', // Simplifié pour faciliter le mapping avant envoi
        studentId: ''
    });

    useEffect(() => {
        // Appels API pour remplir les listes (à décommenter selon vos services)
        listInternships().then(res => setInternships(res.data));

        listStudents().then(res => {
            console.log("Structure des données étudiants :", res.data);
            // Si c'est un tableau direct :
            setStudents(res.data);
            // Si c'est paginé (Spring Data JPA) :
            // setStudents(res.data.content || res.data);
        }
           
        );
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewApplication({ ...newApplication, [name]: value });
    };

    // Gestion spécifique pour le fichier
    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!cvFile) {
            alert("Veuillez sélectionner un fichier PDF pour le CV.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. On récupère l'ID du stage depuis l'état du formulaire
            const idFromForm = newApplication.internshipId; 

            // 2. On prépare l'objet JSON
            const applicationRequest = {
                applicationDate: newApplication.applicationDate,
                status: newApplication.status,
                coverLetter: newApplication.coverLetter,
                internshipId: idFromForm, // On s'assure qu'il est ici
                studentId: newApplication.studentId
            };

            // 3. Appel au service : On passe idFromForm comme premier argument
            await createApplication(idFromForm, applicationRequest, cvFile);
            
            navigator('/applications');
        } catch (error) {
            console.error("Erreur détaillée:", error.response?.data || error.message);
            alert("Erreur lors de la création de la candidature.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-success text-white">
                    <h3 className="mb-0">Nouvelle Candidature</h3>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Étudiant</label>
                                <select name="studentId" className="form-select" onChange={handleChange} required>
                                    <option value="">Choisir un étudiant...</option>
                                    {students.map(st => <option key={st.id} value={st.id}>{st.lastName} {st.firstName}</option>)}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Offre de Stage</label>
                                <select name="internshipId" className="form-select" onChange={handleChange} required>
                                    <option value="">Choisir un stage...</option>
                                    {internships.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                                </select>
                            </div>

                            {/* Changement ici : type="file" au lieu de type="url" */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Document CV (PDF)</label>
                                <input 
                                    type="file" 
                                    name="cvFile" 
                                    className="form-control" 
                                    accept=".pdf" 
                                    onChange={handleFileChange} 
                                    required 
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Date de candidature</label>
                                <input type="date" name="applicationDate" className="form-control" value={newApplication.applicationDate} onChange={handleChange} required />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold">Lettre de motivation</label>
                                <textarea name="coverLetter" className="form-control" rows="5" value={newApplication.coverLetter} onChange={handleChange} placeholder="Décrivez votre motivation..."></textarea>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button type="button" className="btn btn-outline-secondary me-2" onClick={() => navigator(-1)}>Annuler

                            </button>
                            

                            <button type="submit" className="btn btn-success px-5" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Envoi en cours...
                                    </>
                                ) : "Soumettre la candidature"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewApplicationComponent;