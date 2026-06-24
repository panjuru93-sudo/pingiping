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
        id, title, content, view_count, created_at, user_id,
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            자유 게시판
          </Typography>
          <Typography color="text.secondary">
            자유롭게 이야기를 나눠보세요!
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="제목 또는 내용으로 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary" variant="h6">
              {search ? '검색 결과가 없어요.' : '아직 글이 없어요. 첫 번째 글을 작성해보세요!'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filtered.map(post => (
              <Grid item xs={12} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {user && (
        <Fab
          color="secondary"
          aria-label="글쓰기"
          onClick={() => navigate('/write')}
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  )
}

export default HomePage
