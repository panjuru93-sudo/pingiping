import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Alert, Divider,
} from '@mui/material'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { supabase } from '../lib/supabase'

const SignupPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요.'); return }
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (data.session) {
      navigate('/')
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>가입 완료!</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              이메일로 확인 링크를 보냈어요. 이메일을 확인하고 로그인해주세요.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>로그인하러 가기</Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ p: 4, width: '100%', border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: 'secondary.main', borderRadius: '50%', p: 1, mb: 1 }}>
              <PersonAddOutlinedIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5">회원가입</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required label="닉네임" type="text"
              value={username} onChange={e => setUsername(e.target.value)}
              sx={{ mb: 2 }} inputProps={{ minLength: 2 }}
            />
            <TextField
              fullWidth required label="이메일" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }} autoComplete="email"
            />
            <TextField
              fullWidth required label="비밀번호 (6자 이상)" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit" fullWidth variant="contained" color="secondary"
              disabled={loading} size="large"
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
                로그인
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default SignupPage
