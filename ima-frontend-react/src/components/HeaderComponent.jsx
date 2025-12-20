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

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = () => {
        if (!searchValue.trim()) return;

        searchUser(searchValue)
            .then(response => {
                console.log("Résultat :", response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la recherche :", error);
            });
    };

    return (
        <HeaderContainer>

            {/* Search bar */}
            <LeftBlock>
                <SearchGroup>
                <input 
                    type="text" 
                    placeholder="Rechercher…" 
                    className='form-control'
                    id='searchValue'
                    name='searchValue'
                    value={searchValue}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}

                />
                <span onClick={handleSearch} style={{ cursor: 'pointer' }}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </span>

                </SearchGroup>
            </LeftBlock>

            {/* Right side */}
            <RightBlock>
                <UserInfo>Bonjour</UserInfo>
                <Avatar />
            </RightBlock>

        </HeaderContainer>
    );
}

export default HeaderComponent;