import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Divider,
} from '@mui/material'
import { supabase } from '../lib/supabase'

const SignupPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!username || username.length < 2) newErrors.username = '닉네임은 2자 이상이어야 해요.'
    if (!email) newErrors.email = '이메일을 입력해주세요.'
    if (!password || password.length < 6) newErrors.password = '비밀번호는 6자 이상이어야 해요.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    setLoading(false)

    if (error) {
      setErrors({ general: error.message })
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
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>🍀</Typography>
            <Typography variant="h5" fontWeight={800} color="primary.dark" gutterBottom>가입 완료!</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              이메일 인증 링크를 보냈어요.<br />확인 후 로그인해주세요!
            </Typography>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/login')}>
              로그인하러 가기
            </Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 48 }}>🍀</Typography>
            <Typography variant="h5" fontWeight={800} color="primary.dark">회원가입</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              네잎클로버 맛집 커뮤니티 가입하기
            </Typography>
          </Box>

          {errors.general && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              ⚠️ {errors.general}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required
              label="닉네임"
              value={username}
              onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })) }}
              error={Boolean(errors.username)}
              helperText={errors.username}
              sx={{ mb: 2 }}
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            />
            <TextField
              fullWidth required
              label="이메일"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={{ mb: 2 }}
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            />
            <TextField
              fullWidth required
              label="비밀번호 (6자 이상)"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              error={Boolean(errors.password)}
              helperText={errors.password}
              sx={{ mb: 3 }}
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            />
            <Button
              type="submit" fullWidth variant="contained" color="primary"
              disabled={loading} size="large" sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? '가입 중...' : '가입하기'}
            </Button>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: '#d8f3dc' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 700, textDecoration: 'none' }}>
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
