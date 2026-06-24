import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Divider,
} from '@mui/material'
import { supabase } from '../lib/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')
    setPasswordError('')
    setGeneralError('')

    if (!email) { setEmailError('이메일을 입력해주세요.'); return }
    if (!password) { setPasswordError('비밀번호를 입력해주세요.'); return }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('invalid')) {
        setEmailError('이메일 또는 비밀번호가 올바르지 않아요.')
        setPasswordError('이메일 또는 비밀번호가 올바르지 않아요.')
      } else {
        setGeneralError('로그인 중 오류가 발생했어요. 다시 시도해주세요.')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3 }}>
          {/* 로고 */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 48 }}>🍀</Typography>
            <Typography variant="h5" fontWeight={800} color="primary.dark">
              네잎클로버
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              맛집 커뮤니티에 오신 걸 환영해요!
            </Typography>
          </Box>

          {generalError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              ⚠️ {generalError}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="이메일"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError('') }}
              error={Boolean(emailError)}
              helperText={emailError}
              sx={{ mb: 2 }}
              autoComplete="email"
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            />
            <TextField
              fullWidth
              required
              label="비밀번호"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError('') }}
              error={Boolean(passwordError)}
              helperText={passwordError}
              sx={{ mb: 3 }}
              autoComplete="current-password"
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              size="large"
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: '#d8f3dc' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" style={{ color: '#2d6a4f', fontWeight: 700, textDecoration: 'none' }}>
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
