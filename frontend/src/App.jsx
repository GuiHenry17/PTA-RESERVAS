import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Perfil from './pages/Perfil'
import Home from './pages/Home'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  )
}
