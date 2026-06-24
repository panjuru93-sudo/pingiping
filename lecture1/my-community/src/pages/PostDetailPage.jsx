import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, Button, Divider,
  Stack, CircularProgress, IconButton, Alert, Avatar, Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
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
  const [likes, setLikes] = useState([])
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    setLoading(true)
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
      setLikes(data.post_likes ?? [])
    }
    setLoading(false)
  }

  const handleLike = async () => {
    if (!user) { alert('로그인 후 좋아요를 누를 수 있어요!'); return }
    if (likeLoading) return
    setLikeLoading(true)
    const isLiked = likes.some(l => l.user_id === user.id)
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLikes(prev => prev.filter(l => l.user_id !== user.id))
    } else {
      const { data } = await supabase.from('post_likes').insert({ post_id: id, user_id: user.id }).select().single()
      if (data) setLikes(prev => [...prev, data])
    }
    setLikeLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('이 글을 삭제할까요?')) return
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
      <CircularProgress color="primary" />
    </Box>
  )

  if (error) return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>목록으로</Button>
      </Box>
    </Container>
  )

  const isLiked = user ? likes.some(l => l.user_id === user.id) : false
  const authorName = post.profiles?.username || '익명'
  const createdAt = new Date(post.created_at).toLocaleString('ko-KR')

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} color="primary" sx={{ mb: 2 }}>
          목록으로
        </Button>

        <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3, mb: 3 }}>
          {/* 이미지 */}
          {post.image_url && (
            <Box
              component="img"
              src={post.image_url}
              alt={post.title}
              sx={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
            />
          )}

          <Box sx={{ p: 3 }}>
            {/* 제목 + 삭제 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" fontWeight={700} sx={{ flex: 1, mr: 1, color: '#1b4332' }}>
                {post.title}
              </Typography>
              {user?.id === post.user_id && (
                <IconButton onClick={handleDelete} color="error" size="small">
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </Box>

            {/* 작성자 + 날짜 */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                {authorName[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700} color="primary.main">{authorName}</Typography>
                <Typography variant="caption" color="text.secondary">{createdAt}</Typography>
              </Box>
            </Stack>

            {/* 조회수 */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                icon={<VisibilityIcon sx={{ fontSize: '14px !important' }} />}
                label={`조회 ${post.view_count}`}
                size="small"
                sx={{ bgcolor: '#e8f5e9', color: 'primary.dark', fontWeight: 600 }}
              />
            </Stack>

            <Divider sx={{ my: 2, borderColor: '#d8f3dc' }} />

            {/* 본문 */}
            <Typography variant="body1" sx={{ lineHeight: 2, whiteSpace: 'pre-wrap', color: '#333', mb: 3 }}>
              {post.content}
            </Typography>

            <Divider sx={{ my: 2, borderColor: '#d8f3dc' }} />

            {/* 좋아요 수 + 좋아요 버튼 + 별점 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              {/* 좋아요 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={handleLike}
                  disabled={likeLoading}
                  sx={{
                    color: isLiked ? '#e63946' : 'text.disabled',
                    bgcolor: isLiked ? '#ffe8ea' : 'transparent',
                    '&:hover': { bgcolor: '#ffe8ea', color: '#e63946' },
                    border: '1px solid',
                    borderColor: isLiked ? '#e63946' : '#ccc',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={800} color={isLiked ? '#e63946' : 'text.secondary'} lineHeight={1}>
                    {likes.length}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">좋아요</Typography>
                </Box>
              </Box>

              {/* 별점 */}
              <RatingStars postId={post.id} initialRatings={post.ratings ?? []} />
            </Box>
          </Box>
        </Paper>

        {/* 댓글 */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3 }}>
          <CommentSection postId={post.id} initialComments={post.comments ?? []} />
        </Paper>
      </Box>
    </Container>
  )
}

export default PostDetailPage
