import { useNavigate } from 'react-router-dom'
import {
  Card, CardContent, CardActionArea, Typography,
  Box, Chip, Stack,
} from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import StarIcon from '@mui/icons-material/Star'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

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
    month: 'short', day: 'numeric',
  })

  const contentPreview = post.content?.length > 120
    ? post.content.slice(0, 120) + '...'
    : post.content

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.2s' }}>
      <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40, lineHeight: 1.6 }}
          >
            {contentPreview}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={authorName}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
                <AccessTimeIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption">{createdAt}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {avgRating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'warning.main' }}>
                  <StarIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" fontWeight={600}>{avgRating}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.disabled' }}>
                <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{likeCount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.disabled' }}>
                <CommentOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{commentCount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.disabled' }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{viewCount}</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default PostCard
