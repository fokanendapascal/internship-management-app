
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

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
import NewCompanyComponent from './components/NewCompanyComponent';
import CompaniesPage from './pages/CompaniesPage';
import InternshipsPage from './pages/InternshipsPage';

function App() {  

    return (
        <BrowserRouter>
            <Routes>
                {/* ------------ ROUTES PUBLIQUES ---------------- */}
                <Route element={<PublicLayout/>} >
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<InscriptionPage/> } />

                </Route>

                {/* ------------ ROUTES PROTÉGÉES ---------------- */}
                <Route element={<ProtectedRoute/>} >
                    <Route element={<PrivateLayout/>} >

                        {/* DASHBOARD / HOME */}
                        <Route path="/dashboard" element={<StatistiquesPage />} />

                        {/* Internships */}
                        <Route path='/internships' element={<InternshipsPage/>} />
                        

                        {/* Teachers */}
                        <Route path='/teachers' element={<TeachersPage />} />
                        {/*<Route path='/teachers/add' element={<NewTeacherComponent/>} />*/}
                        <Route path="/teachers/new/:userId" element={<NewTeacherComponent />} />
                        <Route path="/teachers/edit/:id" element={<NewTeacherComponent />} />

                        {/* Students */}
                        <Route path='/students' element={<StudentsPage />} />
                        {/*<Route path='/students/add' element={<NewStudentComponent/>} />*/}
                        <Route path="/students/new/:userId" element={<NewStudentComponent />} />
                        <Route path='/students/edit/:id' element={<NewStudentComponent/>} />

                        {/* Companies */}
                        <Route path='companies' element={<CompaniesPage/>} />
                        <Route path="/companies/new/:userId" element={<NewCompanyComponent />} />
                        <Route path="/companies/edit/:id" element={<NewCompanyComponent />} />

                        {/* Users */}
                        <Route path='/users' element={<UsersPage />} />
                        <Route path='/users/add' element={<NewUserComponent/>} />
                        <Route path='/users/edit/:id' element={<NewUserComponent/>} />
                       
                        
                        


                    </Route>

                </Route>


            </Routes>
        </BrowserRouter>
    );
}

export default App;
