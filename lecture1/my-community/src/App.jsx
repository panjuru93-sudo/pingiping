import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage from './pages/PostWritePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { Box } from '@mui/material'

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />
        <Box sx={{ pt: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/write" element={<PostWritePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Box>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
