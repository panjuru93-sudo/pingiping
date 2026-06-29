import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Chip, Card, CardMedia, CardContent, Avatar, CircularProgress } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'
const CATEGORIES = ['전체', '학습', '공예', '식물', '음악', '운동', '요리', '독서']

const MainPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState('전체')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      let query = supabase
        .from('posts').select('*, users(username, display_name, profile_image)')
        .order('created_at', { ascending: false }).limit(20)

      if (category !== '전체') query = query.eq('category', category)

      const { data } = await query
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [category])

  return (
    <Box sx={{ maxWidth: 430, mx: 'auto', pb: 9 }}>
      {/* 헤더 */}
      <Box sx={{ background: GRADIENT, pt: 3, pb: 2, px: 2 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, letterSpacing: -1 }}>
          같이 하자 ✨
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', mt: 0.3 }}>
          관심 있는 스터디를 찾아보세요
        </Typography>

        {/* 카테고리 칩 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 0.5,
          '&::-webkit-scrollbar': { display: 'none' } }}>
          {CATEGORIES.map(cat => (
            <Chip key={cat} label={cat} onClick={() => setCategory(cat)}
              sx={{
                flexShrink: 0,
                bgcolor: category === cat ? '#fff' : 'rgba(255,255,255,0.25)',
                color: category === cat ? '#FF6B9D' : '#fff',
                fontWeight: category === cat ? 700 : 500,
                fontSize: '0.78rem',
                border: 'none',
              }}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress /></Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', pt: 8 }}>
          <Typography color="text.secondary">아직 게시물이 없어요.</Typography>
          <Typography variant="caption" color="text.secondary">첫 번째 모임을 만들어보세요!</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map(post => (
            <Card key={post.id} onClick={() => navigate(`/posts/${post.id}`)}
              sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.2s' } }}
            >
              {post.image_url && (
                <CardMedia component="img" height="200" image={post.image_url}
                  alt={post.title} sx={{ objectFit: 'cover' }} />
              )}
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip label={post.category || '전체'} size="small"
                    sx={{ background: GRADIENT, color: '#fff', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                  {post.view_count > 100 && (
                    <Chip icon={<WhatshotIcon sx={{ fontSize: '12px !important', color: '#FF6B9D !important' }} />}
                      label="인기" size="small"
                      sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                  )}
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                  {post.title || post.caption}
                </Typography>
                {post.caption && post.title && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.82rem',
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {post.caption}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Avatar sx={{ width: 22, height: 22, bgcolor: '#FF6B9D', fontSize: 11 }}>
                      {post.users?.display_name?.[0] || '?'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">{post.users?.display_name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <VisibilityOutlinedIcon sx={{ fontSize: 13, color: '#bbb' }} />
                      <Typography variant="caption" color="text.secondary">{post.view_count || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <FavoriteBorderIcon sx={{ fontSize: 13, color: '#bbb' }} />
                      <Typography variant="caption" color="text.secondary">{post.likes_count || 0}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <BottomNav />
    </Box>
  )
}

export default MainPage
