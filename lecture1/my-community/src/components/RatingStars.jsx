import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const RatingStars = ({ postId, initialRatings = [] }) => {
  const { user } = useAuth()
  const [ratings, setRatings] = useState(initialRatings)
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setRatings(initialRatings)
  }, [initialRatings])

  const myRating = user ? ratings.find(r => r.user_id === user.id)?.score ?? 0 : 0
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
    : '0'

  const handleRate = async (score) => {
    if (!user) {
      alert('로그인 후 별점을 줄 수 있어요!')
      return
    }
    if (loading) return
    setLoading(true)

    const existing = ratings.find(r => r.user_id === user.id)
    if (existing) {
      const { data } = await supabase.from('ratings').update({ score }).eq('id', existing.id).select().single()
      if (data) setRatings(prev => prev.map(r => r.id === existing.id ? data : r))
    } else {
      const { data } = await supabase.from('ratings').insert({ post_id: postId, user_id: user.id, score }).select().single()
      if (data) setRatings(prev => [...prev, data])
    }
    setLoading(false)
  }

  const displayScore = hovered || myRating

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Box
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            sx={{ cursor: user ? 'pointer' : 'default', color: star <= displayScore ? 'warning.main' : 'action.disabled', transition: 'color 0.1s' }}
          >
            {star <= displayScore ? <StarIcon /> : <StarBorderIcon />}
          </Box>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {avgRating} ({ratings.length}명)
      </Typography>
    </Box>
  )
}

export default RatingStars
