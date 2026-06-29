import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, Chip, Avatar, IconButton, TextField, Button, Divider, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('gachi_user') || 'null')
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // 조회수 증가
      await supabase.from('posts').update({ view_count: supabase.raw('view_count + 1') }).eq('id', id)

      const { data: postData } = await supabase
        .from('posts').select('*, users(username, display_name)').eq('id', id).single()
      setPost(postData)

      const { data: commentData } = await supabase
        .from('comments').select('*, users(display_name)').eq('post_id', id).order('created_at')
      setComments(commentData || [])
      setLoading(false)
    }
    load()
  }, [id])

  const handleLike = async () => {
    const newCount = (post.likes_count || 0) + (liked ? -1 : 1)
    await supabase.from('posts').update({ likes_count: newCount }).eq('id', id)
    setPost({ ...post, likes_count: newCount })
    setLiked(!liked)
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    const { data } = await supabase.from('comments')
      .insert([{ content: comment, user_id: currentUser.id, post_id: parseInt(id) }])
      .select('*, users(display_name)').single()
    setComments([...comments, data])
    setComment('')
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  )
  if (!post) return null

  const isHot = (post.view_count || 0) > 100

  return (
    <Box sx={{ maxWidth: 430, mx: 'auto', pb: 9 }}>
      {/* 헤더 */}
      <Box sx={{ background: GRADIENT, pt: 3, pb: 2, px: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff', p: 0.5 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, flex: 1,
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {post.title || '게시물'}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* 카테고리 + 인기 뱃지 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Chip label={post.category || '전체'} size="small"
            sx={{ background: GRADIENT, color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
          {isHot && (
            <Chip icon={<WhatshotIcon sx={{ fontSize: '13px !important', color: '#FF6B9D !important' }} />}
              label="인기글" size="small"
              sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700 }} />
          )}
        </Box>

        {/* 제목 */}
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>{post.title}</Typography>

        {/* 작성자 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#FF6B9D', fontSize: 13 }}>
            {post.users?.display_name?.[0] || '?'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{post.users?.display_name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.created_at).toLocaleDateString('ko-KR')}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <VisibilityOutlinedIcon sx={{ fontSize: 14, color: '#bbb' }} />
              <Typography variant="caption" color="text.secondary">{post.view_count || 0}</Typography>
            </Box>
          </Box>
        </Box>

        {/* 이미지 */}
        {post.image_url && (
          <Box component="img" src={post.image_url} alt=""
            sx={{ width: '100%', borderRadius: 3, mb: 2, maxHeight: 300, objectFit: 'cover' }} />
        )}

        {/* 본문 */}
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2, whiteSpace: 'pre-wrap' }}>
          {post.caption}
        </Typography>

        {/* 좋아요 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 1, borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', mb: 2 }}>
          <IconButton onClick={handleLike} size="small">
            {liked ? <FavoriteIcon sx={{ color: '#FF6B9D' }} /> : <FavoriteBorderIcon sx={{ color: '#999' }} />}
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>좋아요 {post.likes_count || 0}개</Typography>
        </Box>

        {/* 댓글 목록 */}
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>댓글 {comments.length}개</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          {comments.map(c => (
            <Box key={c.id} sx={{ display: 'flex', gap: 1.2 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#FFD93D', fontSize: 12, flexShrink: 0 }}>
                {c.users?.display_name?.[0] || '?'}
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.users?.display_name}</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{c.content}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* 댓글 입력 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField fullWidth placeholder="댓글을 입력하세요..." value={comment}
            onChange={(e) => setComment(e.target.value)} size="small"
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
          />
          <Button variant="contained" onClick={handleComment}
            sx={{ borderRadius: 50, px: 2, background: GRADIENT, whiteSpace: 'nowrap', minWidth: 'auto', fontWeight: 700 }}>
            등록
          </Button>
        </Box>
      </Box>

      <BottomNav />
    </Box>
  )
}

export default PostDetailPage
