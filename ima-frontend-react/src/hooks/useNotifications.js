import { useState, useEffect } from 'react';
import { listNotifications } from '../services/NotificationService';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // 1. Définition de la fonction interne (évite les avertissements ESLint)
        const fetchNotifications = async () => {
            try {
                const response = await listNotifications();
                const data = response.data || [];
                
                setNotifications(data);
                const count = data.filter(n => !n.isRead).length;
                setUnreadCount(count);
            } catch (error) {
                console.error("Erreur notifications:", error);
            }
        };

        // 2. Appel immédiat au montage du composant
        fetchNotifications();

        // 3. Mise en place du polling
        const interval = setInterval(fetchNotifications, 60000);

        // 4. Nettoyage
        return () => clearInterval(interval);
    }, []); // Dépendances vides : l'effet ne s'exécute qu'une fois au montage

    // On expose une fonction de rafraîchissement manuel si besoin
    const refresh = async () => {
        const response = await listNotifications();
        setNotifications(response.data || []);
    };

    return { notifications, unreadCount, refresh };
};