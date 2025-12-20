import styled from "styled-components";

/* Conteneur global */
export const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    background: ${({ theme }) => theme.colors.background};
`;

/* Wrapper principal : Sidebar + Content */
export const LayoutWrapper = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
`;

/* Sidebar */
export const Sidebar = styled.aside`
    width: 250px;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.colors.blue};
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.15);

    h4 {
        margin: 0;
    }

    small {
        opacity: 0.8;
    }
      
`;

/* Zone principale */
export const ContentColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background};
`;

/* Header */
export const HeaderWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};
    background: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

/* Footer */
export const FooterWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing(2)};
    background: ${({ theme }) => theme.colors.light};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

/* Contenu dynamique */
export const DynamicContent = styled.div`
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing(2)};
    min-height: 520px;
`;
