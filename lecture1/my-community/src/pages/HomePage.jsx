import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, TextField, Grid,
  CircularProgress, Fab, InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import PostCard from '../components/PostCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select(`
        id, title, content, image_url, view_count, created_at, user_id,
        profiles!posts_profiles_fkey(username),
        post_likes(id, user_id),
        comments(id),
        ratings(score)
      `)
      .order('created_at', { ascending: false })

    if (data) setPosts(data)
    setLoading(false)
  }

  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* 헤더 배너 */}
        <Box
          sx={{
            mb: 4, p: 4, borderRadius: 3, textAlign: 'center',
            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.5px' }}>
            🍀 네잎클로버
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            맛있는 맛집 이야기를 함께 나눠요!
          </Typography>
        </Box>

        {/* 검색창 */}
        <TextField
          fullWidth
          placeholder="맛집 이름이나 지역으로 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              '&:hover fieldset': { borderColor: 'primary.light' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: 48, mb: 2 }}>🍀</Typography>
            <Typography color="text.secondary" variant="h6">
              {search ? '검색 결과가 없어요.' : '첫 번째 맛집을 추천해보세요!'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filtered.map(post => (
              <Grid item xs={12} sm={6} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {user && (
        <Fab
          color="primary"
          aria-label="맛집 추천"
          onClick={() => navigate('/write')}
          sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: '0 4px 14px rgba(45,106,79,0.4)' }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  )
}

export default HomePage
