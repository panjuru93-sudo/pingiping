import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Stack, IconButton,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CloseIcon from '@mui/icons-material/Close'
import { supabase } from '../lib/supabase'

const EMOJI_LIST = [
  '🍀', '⭐', '🌸', '🌈', '💫', '🎉', '💜', '💙',
  '🌙', '☀️', '🌺', '🦋', '🐱', '🐶', '🐰', '🎵',
  '🌊', '✈️', '🎀', '🌻', '🍎', '🏄',
]

const GuestbookForm = ({ open, onClose, onSubmitted }) => {
  const [form, setForm] = useState({
    author_name: '',
    message: '',
    region: '',
    phone: '',
    emoji: '',
    rating: 0,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.author_name.trim()) newErrors.author_name = '이름을 입력해주세요.'
    if (!form.message.trim()) newErrors.message = '메시지를 입력해주세요.'
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)

    const { error } = await supabase.from('guestbook').insert({
      author_name: form.author_name.trim(),
      message: form.message.trim(),
      region: form.region.trim() || null,
      phone: form.phone.trim() || null,
      emoji: form.emoji || null,
      rating: form.rating || null,
    })

    setLoading(false)

    if (error) {
      setErrors({ general: '저장 중 오류가 발생했어요. 다시 시도해주세요.' })
      return
    }

    setForm({ author_name: '', message: '', region: '', phone: '', emoji: '', rating: 0 })
    setErrors({})
    onSubmitted()
    onClose()
  }

  const handleClose = () => {
    setForm({ author_name: '', message: '', region: '', phone: '', emoji: '', rating: 0 })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} color="primary.dark">
            방명록 남기기 ✍️
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {errors.general && (
          <Typography color="error" variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
            ⚠️ {errors.general}
          </Typography>
        )}

        <Stack spacing={2.5}>
          <TextField
            fullWidth required
            label="이름"
            value={form.author_name}
            onChange={handleChange('author_name')}
            error={Boolean(errors.author_name)}
            helperText={errors.author_name}
            FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
          />

          <TextField
            fullWidth required
            label="메시지"
            multiline rows={3}
            value={form.message}
            onChange={handleChange('message')}
            error={Boolean(errors.message)}
            helperText={errors.message}
            FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600 } }}
            placeholder="안녕하세요! 방명록에 한 마디 남겨주세요 :)"
          />

          <TextField
            fullWidth
            label="거주 지역 (선택)"
            value={form.region}
            onChange={handleChange('region')}
            placeholder="예: 서울특별시, 부산광역시"
          />

          <TextField
            fullWidth
            label="전화번호 (선택 · 비공개 저장)"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="비공개로 저장됩니다"
            inputProps={{ inputMode: 'tel' }}
          />

          {/* 이모지 선택 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              이모지 선택 (선택)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {EMOJI_LIST.map((emoji) => (
                <Box
                  key={emoji}
                  onClick={() => setForm(prev => ({ ...prev, emoji: prev.emoji === emoji ? '' : emoji }))}
                  sx={{
                    fontSize: '1.5rem',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: form.emoji === emoji ? 'primary.main' : 'transparent',
                    bgcolor: form.emoji === emoji ? '#f5f3ff' : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#f5f3ff' },
                  }}
                >
                  {emoji}
                </Box>
              ))}
            </Box>
          </Box>

          {/* 별점 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              별점 (선택)
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < (hoverRating || form.rating)
                return (
                  <IconButton
                    key={i}
                    size="small"
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm(prev => ({ ...prev, rating: prev.rating === i + 1 ? 0 : i + 1 }))}
                    sx={{ color: filled ? '#f59e0b' : '#d1d5db', p: 0.3 }}
                  >
                    {filled ? <StarIcon sx={{ fontSize: 30 }} /> : <StarBorderIcon sx={{ fontSize: 30 }} />}
                  </IconButton>
                )
              })}
              {form.rating > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: 'center' }}>
                  {form.rating}점
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">취소</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ px: 3 }}
        >
          {loading ? '저장 중...' : '방명록 남기기'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GuestbookForm
