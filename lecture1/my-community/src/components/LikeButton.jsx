import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const LikeButton = ({ postId, initialLikes = [] }) => {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLikes(initialLikes)
  }, [initialLikes])

  const isLiked = user ? likes.some(l => l.user_id === user.id) : false

  const handleToggle = async () => {
    if (!user) {
      alert('로그인 후 좋아요를 누를 수 있어요!')
      return
    }
    setLoading(true)
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      setLikes(prev => prev.filter(l => l.user_id !== user.id))
    } else {
      const { data } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id }).select().single()
      if (data) setLikes(prev => [...prev, data])
    }
    setLoading(false)
  }

  return (
    <Button
      variant={isLiked ? 'contained' : 'outlined'}
      color="primary"
      startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
      onClick={handleToggle}
      disabled={loading}
      size="small"
    >
      좋아요 {likes.length}
    </Button>
  )
}

export default LikeButton
