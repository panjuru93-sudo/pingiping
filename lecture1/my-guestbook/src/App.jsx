import { useState, useEffect, useCallback } from 'react'
import {
  Box, Container, Typography, Button, Grid, Chip,
  CircularProgress, Divider,
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { supabase } from './lib/supabase'
import GuestbookCard from './components/GuestbookCard'
import GuestbookForm from './components/GuestbookForm'

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f3ff' }}>
      {/* 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
          color: '#fff',
          textAlign: 'center',
          py: { xs: 7, md: 10 },
          px: 2,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ letterSpacing: '-0.5px', mb: 1 }}
        >
          정아영의 방명록
        </Typography>
        <Typography
          variant="body1"
          sx={{ opacity: 0.85, mb: 4, fontSize: '1.05rem' }}
        >
          방문해 주셔서 감사해요! 흔적을 남겨주세요 ✨
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<EditNoteIcon />}
          onClick={() => setFormOpen(true)}
          sx={{
            bgcolor: '#fff',
            color: '#7c3aed',
            fontWeight: 800,
            fontSize: '1rem',
            px: 4,
            py: 1.5,
            borderRadius: 3,
            '&:hover': { bgcolor: '#f5f3ff' },
          }}
        >
          방명록 남기기
        </Button>
      </Box>

      {/* 카운트 */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark">
            방명록
          </Typography>
          <Chip
            label={`${entries.length}개`}
            size="small"
            sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 700 }}
          />
        </Box>
        <Divider sx={{ borderColor: '#e9d5ff', mb: 3 }} />

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : entries.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: 48, mb: 2 }}>📭</Typography>
            <Typography color="text.secondary">
              아직 방명록이 없어요. 첫 번째로 남겨보세요!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {entries.map((entry) => (
              <Grid key={entry.id} size={{ xs: 12, sm: 6 }}>
                <GuestbookCard entry={entry} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 방명록 작성 폼 */}
      <GuestbookForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitted={fetchEntries}
      />
    </Box>
  )
}

export default App
