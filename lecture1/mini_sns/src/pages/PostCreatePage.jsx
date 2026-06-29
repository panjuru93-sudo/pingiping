import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RefreshIcon from '@mui/icons-material/Refresh'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const GRADIENT = 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)'
const CATEGORIES = ['학습', '공예', '식물', '음악', '운동', '요리', '독서']

const generateImages = (seed) =>
  Array.from({ length: 9 }, (_, i) => ({
    id: seed * 9 + i,
    url: `https://picsum.photos/seed/${seed * 9 + i}/400/400`,
  }))

const PostCreatePage = () => {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('gachi_user') || 'null')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title: '', caption: '', category: '학습' })
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100))
  const [images, setImages] = useState(generateImages(Math.floor(Math.random() * 100)))
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    const next = seed + 1
    setSeed(next)
    setImages(generateImages(next))
    setSelectedImage(null)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.caption) return
    setLoading(true)
    await supabase.from('posts').insert([{
      user_id: currentUser.id,
      title: form.title,
      caption: form.caption,
      category: form.category,
      image_url: selectedImage,
      likes_count: 0,
      view_count: 0,
    }])
    setLoading(false)
    navigate('/')
  }

  return (
    <Box sx={{ maxWidth: 430, mx: 'auto', pb: 9 }}>
      {/* 헤더 */}
      <Box sx={{ background: GRADIENT, pt: 3, pb: 2, px: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowBackIcon sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => step === 1 ? navigate(-1) : setStep(1)} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>
            {step === 1 ? '게시글 작성' : '이미지 선택'}
          </Typography>
        </Box>
        {step === 2 && (
          <Button onClick={handleSubmit} disabled={loading}
            sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>
            {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : '게시하기'}
          </Button>
        )}
      </Box>

      <Box sx={{ px: 2, pt: 2.5 }}>
        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>카테고리</InputLabel>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                label="카테고리" sx={{ borderRadius: 3 }}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField fullWidth placeholder="제목을 입력하세요 *" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField fullWidth multiline rows={6}
              placeholder="모임에 대해 소개해주세요 *&#10;(장소, 시간, 인원, 목표 등)"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Button fullWidth variant="contained" onClick={() => setStep(2)}
              disabled={!form.title.trim() || !form.caption.trim()}
              sx={{ py: 1.4, fontWeight: 700, borderRadius: 3, background: GRADIENT,
                boxShadow: '0 4px 15px rgba(255,107,157,0.4)' }}>
              다음: 이미지 선택
            </Button>

            <Button fullWidth variant="outlined" onClick={handleSubmit} disabled={loading}
              sx={{ py: 1.2, fontWeight: 700, borderRadius: 3, borderColor: '#FF6B9D', color: '#FF6B9D' }}>
              이미지 없이 바로 게시하기
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>이미지를 선택하세요 (선택사항)</Typography>
              <Button size="small" startIcon={<RefreshIcon />} onClick={handleRefresh}
                sx={{ color: '#FF6B9D', fontWeight: 700 }}>새로고침</Button>
            </Box>

            <Grid container spacing={0.5}>
              {images.map(img => (
                <Grid item xs={4} key={img.id}>
                  <Box component="img" src={img.url} alt=""
                    onClick={() => setSelectedImage(selectedImage === img.url ? null : img.url)}
                    sx={{
                      width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer',
                      borderRadius: 1,
                      outline: selectedImage === img.url ? '3px solid #FF6B9D' : 'none',
                      opacity: selectedImage && selectedImage !== img.url ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {selectedImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  선택된 이미지
                </Typography>
                <Box component="img" src={selectedImage} alt=""
                  sx={{ width: '100%', borderRadius: 3, maxHeight: 200, objectFit: 'cover' }} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      <BottomNav />
    </Box>
  )
}

export default PostCreatePage
