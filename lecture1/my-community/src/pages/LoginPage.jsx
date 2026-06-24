import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Alert, Divider,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { supabase } from '../lib/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (authError) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
    } else {
      navigate('/')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ p: 4, width: '100%', border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 1, mb: 1 }}>
              <LockOutlinedIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5">로그인</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required label="이메일" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }} autoComplete="email"
            />
            <TextField
              fullWidth required label="비밀번호" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              sx={{ mb: 3 }} autoComplete="current-password"
            />
            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading} size="large"
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <Link to="/signup" style={{ color: 'inherit', fontWeight: 600 }}>
                회원가입
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage
