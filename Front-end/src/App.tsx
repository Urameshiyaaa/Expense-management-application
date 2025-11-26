import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import CheckedUser from './components/CheckedLoginUser';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ReportPage from './pages/ReportsPage/ReportsPage';
import BudgetSection from './components/BudgetSection';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reports" element={<ReportPage/>} />
        <Route path="/budgets" element={<BudgetSection/>}/>

        <Route path="/" element={
            <CheckedUser>
              <HomePage />
            </CheckedUser>
          }/>
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;