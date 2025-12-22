import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    MenuContainer,
    MenuSection,
    MenuHeader,
    MenuTitle,
    ChevronIcon,
    SubMenuList,
    SubMenuItem,
    Badge
} from '../styles/MenuStyle';
import { useNotifications } from '../hooks/useNotifications';

const menuProperties = [
    {
        id: '1',
        titre: 'Tableau de bord',
        icon: 'fa-solid fa-chart-line',
        sousMenu: [
            { id: '11', titre: "Vue d'ensemble", icon: 'fa-solid fa-chart-pie', url: '/dashboard' },
            { id: '12', titre: 'Statistiques', icon: 'fa-solid fa-chart-column', url: '/dashboard' }
        ],
    },
    {
        id: '2',
        titre: 'Utilisateurs',
        icon: 'fa-solid fa-users-gear',
        // Note: pas d'URL ici si on veut que seul le sous-menu gère la navigation
        sousMenu : [
            {id: '21', titre: 'Entreprises', icon: 'fa-solid fa-building', url: '/companies' },
            {id: '22', titre: 'Enseignants', icon: 'fa-solid fa-chalkboard-user', url: '/teachers' },
            {id: '23', titre: 'Étudiants', icon: 'fa-solid fa-graduation-cap', url: '/students' }
        ],
    },
    { id: '3', titre: 'Stages', icon: 'fa-solid fa-briefcase', url: '/internships' }, 
    { id: '4', titre: 'Candidatures', icon: 'fa-solid fa-file-signature', url: '/applications' },
    { id: '5', titre: 'Conventions', icon: 'fa-solid fa-file-contract', url: '/agreements' }, 
    { id: '6', titre: 'Messages', icon: 'fa-solid fa-message', url: '/messages' },
];

const MenuComponent = () => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Récupère l'URL actuelle (ex: /students)

    const { unreadCount } = useNotifications();

    // Effet pour ouvrir automatiquement le dossier parent si une sous-page est active
    useEffect(() => {
        menuProperties.forEach(menu => {
            if (menu.sousMenu) {
                const isActiveChild = menu.sousMenu.some(sm => location.pathname === sm.url);
                if (isActiveChild) {
                    setOpenMenuId(menu.id);
                }
            }
        });
    }, [location.pathname]);

    const handleMenuClick = (menu) => {
        const hasSubMenu = menu.sousMenu && menu.sousMenu.length > 0;

        if (hasSubMenu) {
            setOpenMenuId(prev => (prev === menu.id ? null : menu.id));
        } else if (menu.url) {
            navigate(menu.url);
        }
    };

    return (
        <MenuContainer>
            {menuProperties.map(menu => {
                const hasSubMenu = menu.sousMenu && menu.sousMenu.length > 0;
                const isOpen = openMenuId === menu.id;

                // Vérifier si le menu parent ou un de ses enfants est actif
                const isActive = location.pathname === menu.url || 
                                 (menu.sousMenu?.some(sm => location.pathname === sm.url));


                return (
                    <MenuSection key={menu.id}>
                        {/* HEADER MENU */}
                        <MenuHeader 
                            onClick={() => handleMenuClick(menu)}
                            $isActive={isActive} // On passe la prop de style
                            style={{ cursor: 'pointer' }}
                        >
                            {/* --- CONTENEUR ICÔNE + BADGE --- */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <i className={menu.icon || 'fa-solid fa-circle-notch'}></i>
                                
                                {/* On affiche le badge si c'est l'item Notifications OU Candidatures */}
                                {(menu.titre === 'Notifications' || menu.titre === 'Candidatures') && unreadCount > 0 && (
                                    <Badge>{unreadCount}</Badge> 
                                )}
                            </div>

                            <MenuTitle>{menu.titre}</MenuTitle>

                            {hasSubMenu && (
                                <ChevronIcon
                                    className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`}
                                />
                            )}
                        </MenuHeader>

                        {/* SOUS-MENU : Rendu conditionnel avec Transient Prop $isOpen */}
                        {hasSubMenu && (
                            <SubMenuList $isOpen={isOpen}>
                                {menu.sousMenu.map(sm => {
                                    const isSubActive = location.pathname === sm.url;
                                    return (
                                        <SubMenuItem
                                            key={sm.id}
                                            $isActive={isSubActive} // Prop pour le sous-menu
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(sm.url);
                                            }}
                                        >
                                            <i className={sm.icon}></i>
                                            <span>{sm.titre}</span>
                                        </SubMenuItem>
                                    );
                                })}
                            </SubMenuList>
                        )}    

                    </MenuSection>
                );
            })}
        </MenuContainer>
    );
}

export default MenuComponent;