import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainPage from './pages/MainPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import MyPage from './pages/MyPage'

const getUser = () => JSON.parse(localStorage.getItem('gachi_user') || 'null')

const PrivateRoute = ({ element }) =>
  getUser() ? element : <Navigate to="/login" replace />

function App() {
  return (
    <BrowserRouter basename="/pingiping/mini_sns">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<PrivateRoute element={<MainPage />} />} />
        <Route path="/posts" element={<PrivateRoute element={<PostListPage />} />} />
        <Route path="/posts/:id" element={<PrivateRoute element={<PostDetailPage />} />} />
        <Route path="/create" element={<PrivateRoute element={<PostCreatePage />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
