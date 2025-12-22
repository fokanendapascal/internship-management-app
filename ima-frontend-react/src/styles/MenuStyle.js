import styled, { keyframes } from "styled-components";

/*Container general du menu */
export const MenuContainer = styled.div`
    width: 100%;
    padding: 10px;
`;

/* Chaque section (Bloc menu et sous-menu) */
export const MenuSection = styled.div`
    margin-bottom: 12px;
`;

/** Header du menu principal */
export const MenuHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f4f6f9;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;

    /* Couleur si actif */
    background-color: ${props => props.$isActive ? '#e3f2fd' : 'transparent'};
    color: ${props => props.$isActive ? '#1976d2' : '#333'};

    &:hover {
        background: #f5f5f5;
    }

    i {
        font-size: 18px;
        margin-right: 10px;
        color: ${props => props.$isActive ? '#1976d2' : '#666'};
    }
`;

/**Titre du menu */
export const MenuTitle = styled.span`
    font-weight: 600;
    font-size: 15px
`;

/**Chevron ouverture/fermeture */
export const ChevronIcon = styled.i`
    margin-left: auto;
    font-size: 13px;
    opacity: 0.6;
`;

/**Sous-menu (animé) */
export const SubMenuList = styled.ul`
    list-style: none;
    padding-left: 0;
    margin: 0;
    margin-top: 5px;
    border-left: 2px solid #dcdcdc;
    
    max-height: ${({ $isOpen }) => ($isOpen ? "300px" : "0px")};
    overflow: hidden;
    transition: max-height 0.35s ease-out;

    opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
    transition: max-height 0.35s ease-out, opacity 0.2s ease-in-out;
`;

/* Items du sous-menu */
export const SubMenuItem = styled.li`
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    border-radius: 5px;
    margin: 5px 0;
    background: #fff;
    border: 1px solid transparent;

    /* Style si sous-menu actif */
    color: ${props => props.$isActive ? '#1976d2' : '#555'};
    font-weight: ${props => props.$isActive ? '600' : '400'};

    &:hover {
        background: #eef2f5;
        border-color: #d0d7dd;
        color: #1976d2;
    }

    i {
        font-size: 16px;
        margin-right: 8px;
    }
`;

// 1. Définition de l'animation de battement
const pulseAnimation = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
    }
    70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 6px rgba(255, 77, 79, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
    }
`;

// 2. Application au composant Badge
export const Badge = styled.span`
    position: absolute;
    top: -8px;
    right: -5px;
    background-color: #ff4d4f; // Rouge vif
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 10px;
    border: 1px solid white;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 16px;
    height: 16px;

    /* On applique l'animation ici */
    animation: ${pulseAnimation} 2s infinite;
    
    /* Empêche l'animation de gêner si l'utilisateur survole le menu */
    pointer-events: none; 
`;

