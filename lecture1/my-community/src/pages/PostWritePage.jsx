import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Paper, Typography, TextField,
  Button, Alert, IconButton, CircularProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const PostWritePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지는 5MB 이하만 업로드할 수 있어요.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    setError('')
    setLoading(true)

    let imageUrl = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filename = `${user.id}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filename, imageFile, { upsert: false })

      if (uploadError) {
        setError('이미지 업로드에 실패했어요. 다시 시도해주세요.')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadData.path)
      imageUrl = urlData.publicUrl
    }

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
      })
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError('글 작성 중 오류가 발생했어요.')
      return
    }

    navigate(`/posts/${data.id}`)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} color="primary" sx={{ mb: 2 }}>
          목록으로
        </Button>

        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: '#d8f3dc', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.dark', fontWeight: 700 }}>
            🍀 맛집 추천 글쓰기
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required
              label="제목"
              placeholder="어떤 맛집인가요?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 100 }}
              helperText={`${title.length}/100`}
            />

            <TextField
              fullWidth required
              label="내용"
              multiline rows={10}
              placeholder="맛집 정보, 추천 메뉴, 가격, 위치 등을 자유롭게 알려주세요!"
              value={content}
              onChange={e => setContent(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* 사진 업로드 */}
            <Box sx={{ mb: 3 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />

              {imagePreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="preview"
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 2, border: '2px solid', borderColor: 'primary.light' }}
                  />
                  <IconButton
                    size="small"
                    onClick={removeImage}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ borderStyle: 'dashed', borderWidth: 2, py: 2, px: 4 }}
                >
                  사진 추가 (선택, 최대 5MB)
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" color="primary" onClick={() => navigate('/')}>취소</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !title.trim() || !content.trim()}
                size="large"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? '올리는 중...' : '맛집 추천하기'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default PostWritePage
