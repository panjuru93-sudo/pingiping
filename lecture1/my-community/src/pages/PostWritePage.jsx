import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const PostWritePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    setError('')
    setLoading(true)

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({ user_id: user.id, title: title.trim(), content: content.trim() })
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError('글 작성 중 오류가 발생했어요. 다시 시도해주세요.')
      return
    }

    navigate(`/posts/${data.id}`)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>

        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ mb: 3 }}>새 글 작성</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required
              label="제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 100 }}
              helperText={`${title.length}/100`}
            />
            <TextField
              fullWidth required
              label="내용"
              multiline
              rows={12}
              value={content}
              onChange={e => setContent(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="자유롭게 이야기를 나눠보세요!"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={() => navigate('/')}>취소</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !title.trim() || !content.trim()}
                size="large"
              >
                {loading ? '작성 중...' : '글 작성하기'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default PostWritePage
