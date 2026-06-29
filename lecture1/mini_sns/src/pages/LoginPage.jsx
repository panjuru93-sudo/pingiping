import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Divider } from '@mui/material'
import { supabase } from '../lib/supabase'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoading(true); setError('')

    const { data, error: err } = await supabase
      .from('users').select('*')
      .eq('email', email).eq('password', password).single()

    setLoading(false)
    if (err || !data) { setError('이메일 또는 비밀번호가 틀렸어요.'); return }

    localStorage.setItem('gachi_user', JSON.stringify(data))
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 430, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 그라데이션 */}
      <Box sx={{ background: GRADIENT, pt: 8, pb: 5, px: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, letterSpacing: -1 }}>같이 하자 ✨</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 1, fontSize: '0.95rem' }}>
          스터디 모임 매칭 플랫폼
        </Typography>
      </Box>

      <Box sx={{ px: 3, pt: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField fullWidth placeholder="이메일" value={email}
          onChange={(e) => setEmail(e.target.value)} size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <TextField fullWidth type="password" placeholder="비밀번호" value={password}
          onChange={(e) => setPassword(e.target.value)} size="small"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        {error && <Typography color="error" variant="caption">{error}</Typography>}
        <Button fullWidth variant="contained" onClick={handleLogin} disabled={loading}
          sx={{ py: 1.4, fontWeight: 700, borderRadius: 3, background: GRADIENT, border: 'none',
            boxShadow: '0 4px 15px rgba(255,107,157,0.4)', mt: 1 }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>

        <Divider sx={{ my: 1 }}>또는</Divider>

        <Button fullWidth variant="outlined" onClick={() => navigate('/signup')}
          sx={{ py: 1.4, fontWeight: 700, borderRadius: 3, borderColor: '#FF6B9D', color: '#FF6B9D' }}
        >
          새 계정 만들기
        </Button>
      </Box>
    </Box>
  )
}

export default LoginPage
