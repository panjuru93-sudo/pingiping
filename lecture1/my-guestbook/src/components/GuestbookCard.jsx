import { Box, Card, CardContent, Typography, Stack } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import PlaceIcon from '@mui/icons-material/Place'

const GuestbookCard = ({ entry }) => {
  const date = new Date(entry.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: '#e9d5ff',
        borderRadius: 3,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 24px rgba(124,58,237,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          {/* 이모지 */}
          <Box
            sx={{
              fontSize: '2rem',
              width: 52,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f5f3ff',
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            {entry.emoji || '🍀'}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 이름 + 날짜 */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary.dark">
                {entry.author_name}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {date}
              </Typography>
            </Stack>

            {/* 지역 */}
            {entry.region && (
              <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mb: 1 }}>
                <PlaceIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">
                  {entry.region}
                </Typography>
              </Stack>
            )}

            {/* 별점 */}
            {entry.rating && (
              <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mb: 1 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      fontSize: 16,
                      color: i < entry.rating ? '#f59e0b' : '#e5e7eb',
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* 메시지 */}
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {entry.message}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default GuestbookCard
