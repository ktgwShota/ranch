'use client';

import { Box, Button, TextField, Typography, Divider, Alert } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { ScheduleTableProps } from '../shared/types';
import StatusIcon from '../shared/StatusIcon';
import TableHeader from '../shared/TableHeader';
import TableRow from '../shared/TableRow';

export default function ActiveTableDesktop({
  allDateTimes,
  allResponses,
  bestKeys,
  isClosed,
  confirmedDateTime,
  voterName,
  setVoterName,
  myAvailability,
  toggleAvailability,
  isSubmitted,
  isEditing,
  showInputForm,
  setShowInputForm,
  respondentId,
  handleEdit,
  handleCancelEdit,
  handleSubmit,
}: ScheduleTableProps) {
  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 'max-content' }}>
          {/* ヘッダー行 */}
          <TableHeader
            allDateTimes={allDateTimes}
            responses={allResponses}
            confirmedDateTime={confirmedDateTime}
            bestKeys={bestKeys}
            confirmedLabel="確定"
          />

          <Divider />

          {/* 回答者行 */}
          {allResponses.map((response, index) => {
            const isMyResponse = response.respondentId === respondentId;
            if (isMyResponse && isEditing) return null;

            return (
              <TableRow
                key={`${response.name}-${index}`}
                response={response}
                allDateTimes={allDateTimes}
                bestKeys={bestKeys}
                isMyResponse={isMyResponse}
                showMyBadge={true}
              />
            );
          })}

          {/* 入力行 */}
          {(showInputForm || isEditing) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderTop: '2px solid',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <Box
                sx={{
                  width: 96,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1.5,
                  borderRight: '1px solid #e5e7eb',
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  backgroundColor: 'rgba(219, 234, 254, 1)',
                }}
              >
                <TextField
                  size="small"
                  placeholder="名前"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  variant="standard"
                  sx={{
                    width: 80,
                    '& .MuiInput-root': { fontSize: '0.85rem' },
                    '& .MuiInput-input': { textAlign: 'center', py: 0.5 },
                  }}
                />
              </Box>
              {allDateTimes.map(({ key }) => (
                <Box
                  key={key}
                  onClick={() => toggleAvailability(key)}
                  sx={{
                    width: 96,
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    '&:last-child': { borderRight: 'none' },
                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.08)' },
                  }}
                >
                  <StatusIcon status={myAvailability[key]} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* アクションボタン */}
      {(showInputForm || isEditing) && (
        <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Alert severity="info" sx={{ borderRadius: '2px' }}>
              セル（枠）をクリックすると予定を入力できます。
            </Alert>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button variant="outlined" size="small" onClick={handleCancelEdit} sx={{ borderRadius: 1 }}>
                キャンセル
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                disabled={!voterName.trim()}
                sx={{ borderRadius: 1 }}
              >
                {isEditing ? '更新' : '送信'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {allResponses.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2.5 }}>
          データが存在しません
        </Typography>
      )}

      {!isClosed && !showInputForm && !isEditing && (
        <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={isSubmitted ? <EditIcon /> : <AddIcon />}
            onClick={isSubmitted ? handleEdit : () => setShowInputForm(true)}
            sx={{ p: 1.5, borderRadius: '2px', fontWeight: 600 }}
          >
            {isSubmitted ? '自分の予定を編集' : '自分の予定を入力'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

