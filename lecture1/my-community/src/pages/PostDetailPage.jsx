import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, Button, Divider,
  Chip, Stack, CircularProgress, IconButton, Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import LikeButton from '../components/LikeButton'
import RatingStars from '../components/RatingStars'
import CommentSection from '../components/CommentSection'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const PostDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    setLoading(true)

    // 조회수 증가
    await supabase.rpc('increment_view_count', { post_id: id })

    const { data, error: fetchError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_profiles_fkey(username),
        post_likes(id, user_id),
        ratings(id, score, user_id),
        comments(
          id, content, created_at, user_id,
          profiles!comments_profiles_fkey(username),
          comment_likes(id, user_id)
        )
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      setError('게시글을 찾을 수 없어요.')
    } else {
      setPost(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('글을 삭제할까요?')) return
    setDeleting(true)
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
            목록으로
          </Button>
        </Box>
      </Container>
    )
  }

  const authorName = post.profiles?.username || '익명'
  const createdAt = new Date(post.created_at).toLocaleString('ko-KR')

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          목록으로
        </Button>

        <Paper elevation={0} sx={{ p: 4, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ flex: 1, mr: 2 }}>
              {post.title}
            </Typography>
            {user?.id === post.user_id && (
              <IconButton onClick={handleDelete} disabled={deleting} color="error" size="small">
                <DeleteOutlineIcon />
              </IconButton>
            )}
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Chip label={authorName} size="small" color="primary" variant="outlined" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{createdAt}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
              <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{post.view_count}</Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body1" sx={{ lineHeight: 2, whiteSpace: 'pre-wrap', mb: 4 }}>
            {post.content}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
            <LikeButton postId={post.id} initialLikes={post.post_likes ?? []} />
            <RatingStars postId={post.id} initialRatings={post.ratings ?? []} />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <CommentSection postId={post.id} initialComments={post.comments ?? []} />
        </Paper>
      </Box>
    </Container>
  )
}

export default PostDetailPage
