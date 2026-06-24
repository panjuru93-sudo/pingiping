import { useNavigate } from 'react-router-dom'
import {
  Card, CardActionArea, CardContent, CardMedia,
  Typography, Box, Avatar, Stack, Chip,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const likeCount = post.post_likes?.length ?? 0
  const commentCount = post.comments?.length ?? 0
  const viewCount = post.view_count ?? 0
  const avgRating = post.ratings?.length > 0
    ? (post.ratings.reduce((sum, r) => sum + r.score, 0) / post.ratings.length).toFixed(1)
    : null

  const authorName = post.profiles?.username || '익명'
  const createdAt = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: '#d8f3dc',
        transition: 'all 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(45,106,79,0.15)', transform: 'translateY(-2px)' },
      }}
    >
      <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
        {post.image_url && (
          <CardMedia
            component="img"
            height="200"
            image={post.image_url}
            alt={post.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ p: 2.5 }}>
          {/* 작성자 + 날짜 */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', fontSize: 13, fontWeight: 700 }}>
              {authorName[0].toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {authorName}
            </Typography>
            <Typography variant="caption" color="text.disabled">·</Typography>
            <Typography variant="caption" color="text.secondary">
              {createdAt}
            </Typography>
          </Stack>

          {/* 제목 */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3, color: '#1b4332', fontSize: '1.05rem' }}
          >
            {post.title}
          </Typography>

          {/* 내용 미리보기 */}
          {post.content && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {post.content}
            </Typography>
          )}

          {/* 통계 */}
          <Stack direction="row" spacing={2} alignItems="center">
            {avgRating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#f4a261' }}>
                <StarIcon sx={{ fontSize: 15 }} />
                <Typography variant="caption" fontWeight={700}>{avgRating}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#e63946' }}>
              <FavoriteIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{likeCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.disabled' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{commentCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.disabled' }}>
              <VisibilityIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{viewCount}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default PostCard
