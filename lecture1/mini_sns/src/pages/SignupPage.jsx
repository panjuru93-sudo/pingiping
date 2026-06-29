import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { supabase } from '../lib/supabase'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'
const AGE_GROUPS = ['10대', '20대 초반', '20대 후반', '30대 초반', '30대 후반']

const SignupPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', display_name: '', age_group: '', bio: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password || !form.display_name) {
      setError('필수 항목을 모두 입력해주세요.'); return
    }
    setLoading(true); setError('')

    const { data, error: err } = await supabase.from('users').insert([form]).select().single()

    setLoading(false)
    if (err) {
      setError(err.message.includes('unique') ? '이미 사용 중인 이메일 또는 아이디예요.' : '가입 중 오류가 발생했어요.')
      return
    }

    localStorage.setItem('gachi_user', JSON.stringify(data))
    navigate('/')
  }

  const field = (label, key, type = 'text', required = false) => (
    <TextField fullWidth placeholder={label + (required ? ' *' : '')} type={type}
      value={form[key]} onChange={handleChange(key)} size="small"
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
    />
  )

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 430, mx: 'auto' }}>
      <Box sx={{ background: GRADIENT, pt: 5, pb: 3, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowBackIcon sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/login')} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>회원가입</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 3, pt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {field('사용자 아이디 (영문/숫자)', 'username', 'text', true)}
        {field('표시 이름', 'display_name', 'text', true)}
        {field('이메일', 'email', 'email', true)}
        {field('비밀번호', 'password', 'password', true)}
        {field('한 줄 소개', 'bio')}

        <FormControl size="small" fullWidth>
          <InputLabel>나이대</InputLabel>
          <Select value={form.age_group} onChange={handleChange('age_group')} label="나이대"
            sx={{ borderRadius: 3 }}>
            {AGE_GROUPS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </Select>
        </FormControl>

        {error && <Typography color="error" variant="caption">{error}</Typography>}

        <Button fullWidth variant="contained" onClick={handleSignup} disabled={loading}
          sx={{ py: 1.4, fontWeight: 700, borderRadius: 3, background: GRADIENT, mt: 1,
            boxShadow: '0 4px 15px rgba(255,107,157,0.4)' }}
        >
          {loading ? '가입 중...' : '가입하기'}
        </Button>
      </Box>
    </Box>
  )
}

export default SignupPage
