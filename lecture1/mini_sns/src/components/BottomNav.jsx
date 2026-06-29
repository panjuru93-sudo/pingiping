import { useNavigate, useLocation } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import AddBoxIcon from '@mui/icons-material/AddBox'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'

const NAV_ITEMS = [
  { path: '/', label: '홈', ActiveIcon: HomeIcon, InactiveIcon: HomeOutlinedIcon },
  { path: '/posts', label: '게시판', ActiveIcon: ListAltIcon, InactiveIcon: ListAltOutlinedIcon },
  { path: '/create', label: '작성', ActiveIcon: AddBoxIcon, InactiveIcon: AddBoxIcon },
  { path: '/mypage', label: '마이', ActiveIcon: PersonIcon, InactiveIcon: PersonOutlinedIcon },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      bgcolor: '#fff', borderTop: '1px solid #f0f0f0',
      display: 'flex', justifyContent: 'space-around',
      alignItems: 'center', py: 0.5, zIndex: 100,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
    }}>
      {NAV_ITEMS.map(({ path, label, ActiveIcon, InactiveIcon }) => {
        const active = pathname === path
        const Icon = active ? ActiveIcon : InactiveIcon
        return (
          <Box key={path}
            onClick={() => navigate(path)}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', py: 0.5, px: 1.5 }}
          >
            {path === '/create' ? (
              <Box sx={{
                width: 44, height: 44, borderRadius: '12px',
                background: GRADIENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 0.3,
              }}>
                <Icon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
            ) : (
              <Icon sx={{ fontSize: 26, color: active ? '#FF6B9D' : '#999', mb: 0.3 }} />
            )}
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: active ? '#FF6B9D' : '#999', fontWeight: active ? 700 : 400 }}>
              {label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export default BottomNav
