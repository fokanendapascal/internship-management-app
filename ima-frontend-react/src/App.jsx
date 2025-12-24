import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout'; // On utilise celui qui contient le MenuComponent

// Pages & Components
import LoginPage from './pages/LoginPage';
import InscriptionPage from './pages/InscriptionPage';
import ProtectedRoute from './routes/ProtectedRoute';
import StatistiquesPage from './pages/StatistiquesPage';
import UsersPage from './pages/UsersPage';
import NewUserComponent from './components/NewUserComponent';
import StudentsPage from './pages/StudentsPage';
import NewStudentComponent from './components/NewStudentComponent';
import TeachersPage from './pages/TeachersPage';
import NewTeacherComponent from './components/NewTeacherComponent';
import CompaniesPage from './pages/CompaniesPage';
import NewCompanyComponent from './components/NewCompanyComponent';
import InternshipsPage from './pages/InternshipsPage';
import NewInternshipComponent from './components/NewInternshipComponent';
import ApplicationsPage from './pages/ApplicationsPage';
import NewApplicationComponent from './components/NewApplicationComponent';
import AgreementsPage from './pages/AgreementsPage';
import NewAgreementComponent from './components/NewAgreementComponent';
import { ToastContainer } from 'react-toastify';
import MessagesPage from './pages/MessagesPage';
import NewMessageComponent from './components/NewMessageComponent';

function App() {  
    // Initialisation basée sur la présence d'un token
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return !!savedToken;
    });

    // Fonction pour gérer la connexion
    const handleLogin = (token) => {
        localStorage.setItem('token', token); // On stocke le token
        setIsAuthenticated(true);
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token'); // On vide le stockage
        setIsAuthenticated(false);
    };

    return (
        
        <BrowserRouter>
            {/* On le place ici pour qu'il soit au-dessus de tout le contenu visuel */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <Routes>
                {/* ------------ ROUTES PUBLIQUES ---------------- */}
                <Route element={<PublicLayout />}>
                    <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />
                    <Route path='/register' element={<InscriptionPage />} />
                </Route>

                {/* ------------ ROUTES PROTÉGÉES ---------------- */}
                {/* On enveloppe tout dans ProtectedRoute qui vérifie l'accès */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>

                    {/* Le PrivateLayout contient le Menu, le Header et l'Outlet */}
                    <Route element={<PrivateLayout onLogout={handleLogout}/>}>
                        
                        {/* Redirection automatique de "/" vers le dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        <Route path="/dashboard" element={<StatistiquesPage />} />

                        {/* Groupes de routes pour la clarté */}
                        <Route path='/messages'> 
                            <Route index element={<MessagesPage/>} />
                            <Route path='new' element={<NewMessageComponent/>} />
                            <Route path='edit/:id' element={<NewMessageComponent/>} />
                        </Route>

                        <Route path='/internships'>
                            <Route index element={<InternshipsPage />} />
                            <Route path='new' element={<NewInternshipComponent />} />
                            <Route path='edit/:id' element={<NewInternshipComponent />} />
                        </Route>

                        <Route path='/applications'>
                            <Route index element={<ApplicationsPage />} />
                            <Route path='new' element={<NewApplicationComponent />} />
                            <Route path='edit/:id' element={<NewApplicationComponent />} />
                        </Route>

                        <Route path='/agreements'>
                            <Route index element={<AgreementsPage />} />
                            <Route path='new' element={<NewAgreementComponent />} />
                            <Route path='edit/:id' element={<NewAgreementComponent />} />
                        </Route>

                        <Route path='/teachers'>
                            <Route index element={<TeachersPage />} />
                            <Route path="new/:userId" element={<NewTeacherComponent />} />
                            <Route path="edit/:id" element={<NewTeacherComponent />} />
                        </Route>

                        <Route path='/students'>
                            <Route index element={<StudentsPage />} />
                            <Route path="new/:userId" element={<NewStudentComponent />} />
                            <Route path='edit/:id' element={<NewStudentComponent />} />
                        </Route>

                        <Route path='/companies'>
                            <Route index element={<CompaniesPage />} />
                            <Route path="new/:userId" element={<NewCompanyComponent />} />
                            <Route path="edit/:id" element={<NewCompanyComponent />} />
                        </Route>

                        <Route path='/users'>
                            <Route index element={<UsersPage />} />
                            <Route path='add' element={<NewUserComponent />} />
                            <Route path='edit/:id' element={<NewUserComponent />} />
                        </Route>
                    </Route>
                </Route>

                {/* Catch-all : redirection vers login si la page n'existe pas */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;