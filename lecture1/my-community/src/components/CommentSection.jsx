import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Divider,
  Avatar, IconButton, Stack,
} from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const CommentItem = ({ comment, postId, onDelete }) => {
  const { user } = useAuth()
  const [likes, setLikes] = useState(comment.comment_likes ?? [])

  const isLiked = user ? likes.some(l => l.user_id === user.id) : false
  const authorName = comment.profiles?.username || '익명'
  const createdAt = new Date(comment.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })

  const handleLike = async () => {
    if (!user) { alert('로그인 후 좋아요를 누를 수 있어요!'); return }
    if (isLiked) {
      await supabase.from('comment_likes').delete().eq('comment_id', comment.id).eq('user_id', user.id)
      setLikes(prev => prev.filter(l => l.user_id !== user.id))
    } else {
      const { data } = await supabase.from('comment_likes').insert({ comment_id: comment.id, user_id: user.id }).select().single()
      if (data) setLikes(prev => [...prev, data])
    }
  }

  return (
    <Box sx={{ py: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: 14 }}>
          {authorName[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>{authorName}</Typography>
            <Typography variant="caption" color="text.disabled">{createdAt}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{comment.content}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Button
              size="small"
              onClick={handleLike}
              startIcon={isLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
              sx={{ minWidth: 'auto', fontSize: 12, color: isLiked ? 'primary.main' : 'text.secondary' }}
            >
              {likes.length}
            </Button>
            {user?.id === comment.user_id && (
              <IconButton size="small" onClick={() => onDelete(comment.id)} color="error">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

const CommentSection = ({ postId, initialComments = [] }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { alert('로그인 후 댓글을 작성할 수 있어요!'); return }
    if (!content.trim()) return
    setSubmitting(true)

    const { data } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content: content.trim() })
      .select('*, profiles!comments_profiles_fkey(username), comment_likes(id, user_id)')
      .single()

    if (data) {
      setComments(prev => [...prev, data])
      setContent('')
    }
    setSubmitting(false)
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        댓글 {comments.length}개
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있어요'}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={!user}
          size="small"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={!user || submitting || !content.trim()} size="small">
            댓글 작성
          </Button>
        </Box>
      </Box>

      <Divider />

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          첫 번째 댓글을 작성해보세요!
        </Typography>
      ) : (
        comments.map((comment, idx) => (
          <Box key={comment.id}>
            <CommentItem comment={comment} postId={postId} onDelete={handleDelete} />
            {idx < comments.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Box>
  )
}

export default CommentSection
