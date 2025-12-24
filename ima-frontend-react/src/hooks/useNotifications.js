import { useState, useEffect, useCallback } from 'react';
import { listNotifications } from '../services/NotificationService';
import { listMessages } from '../services/MessageService';
import { listApplications } from '../services/ApplicationService';
import { listInternships } from '../services/InternshipService';
import { listAgreements } from '../services/AgreementService';

export const useNotifications = () => {
    const [counts, setCounts] = useState({
        messages: 0,
        notifications: 0,
        applications: 0,
        internships: 0,
        agreements: 0
    });

    // Utilisation de useCallback pour éviter de recréer la fonction à chaque rendu
    const fetchAllCounts = useCallback(async () => {
        const token = localStorage.getItem("token");
            if (!token) return;

        try {
            // On récupère bien les 4 promesses en parallèle
            const [msgRes, appRes, intRes, notifRes, agreeRes] = await Promise.all([
                listMessages(0, 100),
                listApplications(),
                listInternships(),
                listNotifications(),
                listAgreements() 
            ]);

            setCounts({
                // On s'assure que data existe pour éviter les erreurs "undefined"
                messages: msgRes.data?.content?.filter(m => !m.isRead).length || 0,
                applications: appRes.data?.filter(a => a.status === 'PENDING').length || 0,
                internships: intRes.data?.filter(i => i.active).length || 0,
                notifications: notifRes.data?.filter(n => !n.isRead).length || 0, // Ajouté
                agreements: agreeRes.data?.filter(agr => agr.status === 'DRAFT').length || 0, 
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour des compteurs", error);
        }
    }, []);

    useEffect(() => {
        let isMounted = true; // Empêche les fuites de mémoire si le composant est démonté

        const tick = async () => {
            if (isMounted) {
                await fetchAllCounts();
            }
        };

        // On lance l'appel initial
        tick();

        // On configure l'intervalle
        const interval = setInterval(tick, 60000);

        // Nettoyage
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchAllCounts]);
    

    return { counts, refresh: fetchAllCounts };
};