import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Box, Avatar, Menu, MenuItem, Tooltip,
} from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum'
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
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        <ForumIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          커뮤니티
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => navigate('/write')}
              size="small"
            >
              글쓰기
            </Button>
            <Tooltip title={username}>
              <IconButton onClick={handleAvatarClick} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {username[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {username}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/signup')}>
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
