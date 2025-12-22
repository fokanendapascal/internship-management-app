import React, { useState } from 'react'
import {
    HeaderContainer,
    LeftBlock,
    SearchGroup,
    RightBlock,
    UserInfo,
    Avatar
} from "../styles/HeaderStyle";
import { searchUser } from '../services/UserService';

const HeaderComponent = () => {
    const [searchValue, setSearchValue] = useState("");

    // Initialisation sécurisée
    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Erreur de lecture du localStorage", error);
            return null;
        }
    });

    const handleChange = (e) => setSearchValue(e.target.value);

    const handleSearch = () => {
        if (!searchValue.trim()) return;
        searchUser(searchValue)
            .then(response => console.log("Résultat :", response.data))
            .catch(error => console.error("Erreur recherche :", error));
    };

    const getInitials = (user) => {
        if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
        if (user?.username) return user.username.charAt(0).toUpperCase();
        return "?";
    };

    return (
        <HeaderContainer>
            <LeftBlock>
                <SearchGroup>
                    <input 
                        type="text" 
                        placeholder="Rechercher…" 
                        className='form-control'
                        value={searchValue}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <span onClick={handleSearch} style={{ cursor: 'pointer' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </SearchGroup>
            </LeftBlock>

            <RightBlock>
                <UserInfo>
                    <span>Bonjour, <strong>{user?.firstName || user?.username || 'Utilisateur'}</strong></span>
                </UserInfo>
                {/* L'initiale est calculée dynamiquement */}
                <Avatar title={user?.firstName || 'User'}>
                    {getInitials(user)}
                </Avatar>
            </RightBlock>
        </HeaderContainer>
    );
}

export default HeaderComponent;