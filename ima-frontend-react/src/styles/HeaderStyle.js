import styled from "styled-components";

/* Conteneur principal du header */
export const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing(2)};
    width: 100%;
`;

/* Bloc gauche (search bar) */
export const LeftBlock = styled.div`
    flex: 1;
    display: flex;
`;

/* Input group style */
export const SearchGroup = styled.div`
    display: flex;
    width: 100%;
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius};
    overflow: hidden;

    input {
        flex: 1;
        padding: ${({ theme }) => theme.spacing(1)};
        border: none;
        outline: none;
        font-size: 0.95rem;
    }

    span {
        padding: ${({ theme }) => theme.spacing(1)};
        background: ${({ theme }) => theme.colors.light};
        border-left: 1px solid ${({ theme }) => theme.colors.border};
        display: flex;
        align-items: center;
        justify-content: center;

        i {
        opacity: 0.7;
        }
    }
`;

/* Bloc droite */
export const RightBlock = styled.div`
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing(2)};
`;

/* Zone du texte "Bonjour" */
export const UserInfo = styled.div`
    font-size: 0.95rem;
    font-weight: 500;
`;

/* Avatar placeholder (tu pourras mettre une image plus tard) */
export const Avatar = styled.div`
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
`;
