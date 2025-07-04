import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, redirect } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import KanbanBoard from './components/Kanban/KanbanBoard';
import { Link } from 'react-router-dom';


function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<KanbanBoard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
      <div className='footer'>
        <div className="loginButton">
          <Link to="/login">Go to Login Page</Link>
        </div>
        <div className="registerButton">
          <Link to="/register">Go to Register Page</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
