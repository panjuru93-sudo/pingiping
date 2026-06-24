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
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '2px solid', borderColor: 'primary.light' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 800,
            color: 'primary.main',
            fontSize: '1.3rem',
            letterSpacing: '-0.5px',
          }}
          onClick={() => navigate('/')}
        >
          🍀 네잎클로버
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate('/write')}
              size="small"
            >
              맛집 추천
            </Button>
            <Tooltip title={username}>
              <IconButton onClick={handleAvatarClick} size="small">
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 15, fontWeight: 700 }}>
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
            <Button color="primary" onClick={() => navigate('/login')} sx={{ fontWeight: 600 }}>로그인</Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
