import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Box, Avatar, Menu, MenuItem, Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleSignOut = async () => {
    await signOut()
    handleMenuClose()
    navigate('/')
  }

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '사용자'

  return (
    <AppBar position="fixed" elevation={2} sx={{ bgcolor: '#2d6a4f' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 800,
            color: '#ffffff',
            fontSize: '1.25rem',
            letterSpacing: '-0.3px',
          }}
          onClick={() => navigate('/')}
        >
          🍀 네잎클로버
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/write')}
              size="small"
              sx={{ bgcolor: '#52b788', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#40916c' } }}
            >
              맛집 추천
            </Button>
            <Tooltip title={username}>
              <IconButton onClick={handleAvatarClick} size="small">
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#1b4332', fontSize: 15, fontWeight: 700, border: '2px solid #74c69d' }}>
                  {username[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">{username}</Typography>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button sx={{ color: '#fff', fontWeight: 600 }} onClick={() => navigate('/login')}>
              로그인
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/signup')}
              sx={{ color: '#fff', borderColor: '#74c69d', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' } }}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
