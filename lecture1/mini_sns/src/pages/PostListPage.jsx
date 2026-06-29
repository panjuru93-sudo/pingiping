import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Chip, Divider, TextField, InputAdornment, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'

const PostListPage = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('전체')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      let query = supabase
        .from('posts').select('*, users(display_name, username)')
        .order('created_at', { ascending: false })

      if (tab === '인기') query = query.gt('view_count', 50).order('view_count', { ascending: false })

      const { data } = await query
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [tab])

  const filtered = posts.filter(p =>
    (p.title || '').includes(search) || (p.caption || '').includes(search)
  )

  return (
    <Box sx={{ maxWidth: 430, mx: 'auto', pb: 9 }}>
      {/* 헤더 */}
      <Box sx={{ background: GRADIENT, pt: 3, pb: 2.5, px: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>게시판 📋</Typography>
        <TextField fullWidth placeholder="게시글 검색..." value={search}
          onChange={(e) => setSearch(e.target.value)} size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#aaa' }} /></InputAdornment>,
            sx: { borderRadius: 50, bgcolor: '#fff', '& fieldset': { border: 'none' } },
          }}
        />
      </Box>

      {/* 탭 */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
        {['전체', '인기'].map(t => (
          <Box key={t} onClick={() => setTab(t)}
            sx={{ flex: 1, py: 1.3, textAlign: 'center', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid #FF6B9D' : '2px solid transparent',
              color: tab === t ? '#FF6B9D' : '#999', fontWeight: tab === t ? 700 : 400, fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
          >
            {t === '인기' && <WhatshotIcon sx={{ fontSize: 16 }} />}
            {t}
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}><CircularProgress /></Box>
      ) : (
        <Box>
          {filtered.map((post, i) => (
            <Box key={post.id}>
              <Box onClick={() => navigate(`/posts/${post.id}`)}
                sx={{ px: 2, py: 1.8, cursor: 'pointer', '&:hover': { bgcolor: '#FFFAF0' } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.6 }}>
                  <Chip label={post.category || '전체'} size="small"
                    sx={{ height: 18, fontSize: '0.62rem', background: GRADIENT, color: '#fff', fontWeight: 700 }} />
                  {post.view_count > 100 && (
                    <Chip icon={<WhatshotIcon sx={{ fontSize: '11px !important', color: '#FF6B9D !important' }} />}
                      label="인기" size="small"
                      sx={{ height: 18, fontSize: '0.62rem', bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700 }} />
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                  </Typography>
                </Box>

                <Typography sx={{ fontWeight: 700, fontSize: '0.97rem', mb: 0.4,
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {post.title || post.caption}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">{post.users?.display_name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <VisibilityOutlinedIcon sx={{ fontSize: 12, color: '#ccc' }} />
                    <Typography variant="caption" color="text.secondary">{post.view_count || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <ChatBubbleOutlinedIcon sx={{ fontSize: 12, color: '#ccc' }} />
                    <Typography variant="caption" color="text.secondary">0</Typography>
                  </Box>
                </Box>
              </Box>
              {i < filtered.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', pt: 6 }}>
              <Typography color="text.secondary">게시글이 없어요.</Typography>
            </Box>
          )}
        </Box>
      )}

      <BottomNav />
    </Box>
  )
}

export default PostListPage
