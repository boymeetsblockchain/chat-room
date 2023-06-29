import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import './App.css'
import Room from './pages/Room'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './utils/AuthContext'
function App() {
  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/login'  element={<LoginPage/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path='/' index element={<Room/>}/>
        </Route>
        <Route path='/register'  element={<RegisterPage/>}/>

      </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
