import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, Button, Grid, Chip, CircularProgress } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'

const StatBox = ({ label, value }) => (
  <Box sx={{ textAlign: 'center', flex: 1 }}>
    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF6B9D' }}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
)

const MyPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('gachi_user') || 'null'))
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyPosts = async () => {
      const { data } = await supabase
        .from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    if (user) fetchMyPosts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gachi_user')
    navigate('/login')
  }

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0)

  return (
    <Box sx={{ maxWidth: 430, mx: 'auto', pb: 9 }}>
      {/* 헤더 */}
      <Box sx={{ background: GRADIENT, pt: 3, pb: 6, px: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>마이페이지</Typography>
        <Button size="small" startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
          onClick={handleLogout}
          sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.8rem' }}>
          로그아웃
        </Button>
      </Box>

      {/* 프로필 카드 - 헤더와 겹치게 */}
      <Box sx={{
        mx: 2, mt: -4, bgcolor: '#fff', borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', p: 2.5, mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{
            width: 70, height: 70, fontSize: 28, fontWeight: 700,
            background: GRADIENT,
          }}>
            {user?.display_name?.[0] || '?'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {user?.display_name}
              </Typography>
              {user?.age_group && (
                <Chip label={user.age_group} size="small"
                  sx={{ height: 18, fontSize: '0.62rem', background: GRADIENT, color: '#fff', fontWeight: 700 }} />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">@{user?.username}</Typography>
            {user?.bio && (
              <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>{user.bio}</Typography>
            )}
          </Box>
          <EditOutlinedIcon sx={{ color: '#ccc', cursor: 'pointer' }} />
        </Box>

        {/* 통계 */}
        <Box sx={{ display: 'flex', borderTop: '1px solid #f5f5f5', pt: 2 }}>
          <StatBox label="게시글" value={posts.length} />
          <Box sx={{ width: '1px', bgcolor: '#f5f5f5' }} />
          <StatBox label="받은 좋아요" value={totalLikes} />
          <Box sx={{ width: '1px', bgcolor: '#f5f5f5' }} />
          <StatBox label="참여 모임" value={posts.length} />
        </Box>
      </Box>

      {/* 내 게시물 그리드 */}
      <Box sx={{ px: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1.5 }}>
          내 게시물
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary" variant="body2">아직 작성한 게시물이 없어요.</Typography>
            <Button variant="contained" onClick={() => navigate('/create')}
              sx={{ mt: 2, background: GRADIENT, borderRadius: 3, fontWeight: 700 }}>
              첫 게시물 작성하기
            </Button>
          </Box>
        ) : (
          <Grid container spacing={0.5}>
            {posts.map(post => (
              <Grid item xs={4} key={post.id}>
                {post.image_url ? (
                  <Box component="img" src={post.image_url} alt=""
                    onClick={() => navigate(`/posts/${post.id}`)}
                    sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                      cursor: 'pointer', borderRadius: 1 }} />
                ) : (
                  <Box onClick={() => navigate(`/posts/${post.id}`)}
                    sx={{ width: '100%', aspectRatio: '1/1', borderRadius: 1,
                      background: GRADIENT, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', p: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                      textAlign: 'center', overflow: 'hidden',
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {post.title}
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <BottomNav />
    </Box>
  )
}

export default MyPage
