import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import OAuthCallback from './components/OAuthCallback';
import PasswordResetForm from './components/PasswordResetForm';
import Email_password_reset from './pages/password_email_confir';
import EmailVerification from './components/EmailVerification';
import ProtectedRoute from "./components/protectedroute"
import Body from './components/Body';


function Logout() {
  localStorage.clear()
  return <Login />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <Home />
          
          }
        />
        <Route path="/connection" element={<Login />} />
        <Route path="/disconnection" element={<Logout />} />
        <Route path="/inscription" element={<RegisterAndLogout />} />
        <Route path="/google" element={<OAuthCallback />} />
        <Route path="/reset-password" element={<Email_password_reset />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/api/reset-password/:encoded_pk/:token" element={<PasswordResetForm />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
 
    </BrowserRouter>
  )
}
export default App
