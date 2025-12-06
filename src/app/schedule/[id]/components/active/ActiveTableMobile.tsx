'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Chip } from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { ScheduleTableProps, calculateSummary, calculateScore, formatScore } from '../shared/types';
import StatusIcon, { setStatusDirectly } from '../shared/StatusIcon';

export default function ActiveTableMobile({
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedDateTime = allDateTimes[selectedIndex];
  const selectedKey = selectedDateTime?.key;
  const summary = selectedKey ? calculateSummary(selectedKey, allResponses) : { available: 0, maybe: 0, unavailable: 0, total: 0 };
  const score = calculateScore(summary.available, summary.maybe);
  const ratio = allResponses.length > 0 ? score / allResponses.length : 0;
  const isBest = selectedKey ? bestKeys.has(selectedKey) : false;
  const isConfirmed = selectedKey === confirmedDateTime;
  const isFull = allResponses.length > 0 && summary.available === allResponses.length;

  return (
    <Box>
      {/* 日付タブ */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1,
          p: 1.5,
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {allDateTimes.map(({ date, time, key }, index) => {
          const tabSummary = calculateSummary(key, allResponses);
          const tabScore = calculateScore(tabSummary.available, tabSummary.maybe);
          const tabRatio = allResponses.length > 0 ? tabScore / allResponses.length : 0;
          const isTabBest = bestKeys.has(key);
          const isTabConfirmed = confirmedDateTime === key;
          const isSelected = index === selectedIndex;

          return (
            <Chip
              key={key}
              label={
                <Box sx={{ textAlign: 'center', py: 0.25 }}>
                  {isTabConfirmed && (
                    <Typography
                      sx={{
                        fontSize: '8px',
                        fontWeight: 700,
                        color: isSelected ? 'white' : '#4caf50',
                        lineHeight: 1.2,
                      }}
                    >
                      確定
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.2 }}>
                    {date.format('M/D')}({date.format('ddd')})
                  </Typography>
                  {time && (
                    <Typography sx={{ fontSize: '9px', color: isSelected ? 'white' : 'text.secondary', lineHeight: 1.2 }}>
                      {time}~
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: '9px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: isSelected ? 'white' : tabRatio >= 0.8 ? '#4caf50' : tabRatio >= 0.5 ? '#ff9800' : '#f44336',
                    }}
                  >
                    {formatScore(tabScore)}/{allResponses.length}
                  </Typography>
                </Box>
              }
              onClick={() => setSelectedIndex(index)}
              sx={{
                height: 'auto',
                borderRadius: '4px',
                px: 0.5,
                py: 0.5,
                flexShrink: 0,
                border: isTabConfirmed ? '2px solid #4caf50' : isTabBest ? '1px solid #4caf50' : '1px solid #e0e0e0',
                backgroundColor: isSelected ? 'primary.main' : isTabConfirmed ? 'rgba(76, 175, 80, 0.2)' : isTabBest ? 'rgba(76, 175, 80, 0.1)' : 'white',
                color: isSelected ? 'white' : 'text.primary',
                '&:hover': { backgroundColor: isSelected ? 'primary.dark' : '#f5f5f5' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          );
        })}
      </Box>

      {/* 選択した日付の詳細 */}
      {selectedDateTime && (
        <Box>
          {/* ナビゲーション */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: isBest ? 'rgba(76, 175, 80, 0.08)' : 'white',
            }}
          >
            <Button size="small" onClick={() => setSelectedIndex(i => i - 1)} disabled={selectedIndex === 0} sx={{ minWidth: 40 }}>
              <ChevronLeftIcon />
            </Button>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {selectedDateTime.date.format('M月D日')} ({selectedDateTime.date.format('dddd')})
              </Typography>
              {selectedDateTime.time && (
                <Typography variant="body2" color="text.secondary">{selectedDateTime.time} ~</Typography>
              )}
            </Box>
            <Button size="small" onClick={() => setSelectedIndex(i => i + 1)} disabled={selectedIndex === allDateTimes.length - 1} sx={{ minWidth: 40 }}>
              <ChevronRightIcon />
            </Button>
          </Box>

          {/* 進捗サマリー */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={{ height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${ratio * 100}%`,
                  backgroundColor: ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                  borderRadius: 4,
                  transition: 'width 0.3s',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isFull ? '#4caf50' : ratio >= 0.8 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336',
                }}
              >
                {allResponses.length === 0 && '0/0' || `${formatScore(score)}/${allResponses.length}`}
              </Typography>
            </Box>
          </Box>

          {/* 回答者リスト */}
          <Box sx={{ borderTop: '1px solid #e5e7eb' }}>
            {allResponses.map((response, index) => {
              const isMyResponse = response.respondentId === respondentId;
              if (isMyResponse && isEditing) return null;

              return (
                <Box
                  key={`${response.name}-${index}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: isMyResponse ? 600 : 500,
                      fontSize: '14px',
                      color: isMyResponse ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {response.name}
                    {isMyResponse && (
                      <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>(Me)</Typography>
                    )}
                  </Typography>
                  <StatusIcon status={response.availability[selectedKey]} size={32} />
                </Box>
              );
            })}

            {/* 入力フォーム */}
            {(showInputForm || isEditing) && (
              <Box sx={{ p: 2, backgroundColor: 'rgba(59, 130, 246, 0.04)' }}>
                <TextField
                  label="名前"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                  {(['available', 'maybe', 'unavailable'] as const).map((statusOption) => {
                    const currentStatus = myAvailability[selectedKey];
                    const isCurrentStatus = currentStatus === statusOption;
                    return (
                      <Box
                        key={statusOption}
                        onClick={() => {
                          if (!isCurrentStatus) {
                            setStatusDirectly(currentStatus, statusOption, () => toggleAvailability(selectedKey));
                          }
                        }}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                          p: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          backgroundColor: isCurrentStatus ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          border: isCurrentStatus ? '2px solid' : '2px solid transparent',
                          borderColor: isCurrentStatus ? 'primary.main' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
                        }}
                      >
                        <StatusIcon status={statusOption} size={40} />
                      </Box>
                    );
                  })}
                </Box>

                {/* 全日程の入力状況 */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '12px' }}>
                    全日程の入力状況（タップで移動）
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {allDateTimes.map(({ date, key }, idx) => {
                      const myStatus = myAvailability[key] ?? 'unavailable';
                      const colors = { available: '#4caf50', maybe: '#ff9800', unavailable: '#9e9e9e' };
                      return (
                        <Chip
                          key={key}
                          size="small"
                          label={date.format('M/D')}
                          onClick={() => setSelectedIndex(idx)}
                          sx={{
                            height: 24,
                            fontSize: '10px',
                            backgroundColor: colors[myStatus],
                            color: 'white',
                            border: idx === selectedIndex ? '2px solid' : 'none',
                            borderColor: 'primary.main',
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" fullWidth onClick={handleCancelEdit} sx={{ borderRadius: 1 }}>
                    キャンセル
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!voterName.trim()}
                    sx={{ borderRadius: 1 }}
                  >
                    {isEditing ? '更新' : '送信'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {allResponses.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2.5 }}>
              データが存在しません
            </Typography>
          )}

          {/* 回答入力ボタン */}
          {!isClosed && !showInputForm && !isEditing && (
            <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={isSubmitted ? <EditIcon /> : <AddIcon />}
                onClick={isSubmitted ? handleEdit : () => setShowInputForm(true)}
                sx={{ p: 1.5, borderRadius: '8px', fontWeight: 600 }}
              >
                {isSubmitted ? '自分の予定を編集' : '自分の予定を入力'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

