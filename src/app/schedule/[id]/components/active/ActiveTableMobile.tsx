'use client';

import { useState, useRef } from 'react';
import { Box, Button, Typography, TextField, Chip, Dialog, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FormattedDate } from '@/components/ui/FormattedDate';
import { DateStatusCard } from '../shared/DateStatusCard';
import { ScoreProgressBar } from '../shared/ScoreProgressBar';
import { type ScheduleTableProps, calculateSummary, calculateScore } from '../shared/types';
import StatusIcon, { setStatusDirectly } from '../shared/StatusIcon';

const DateScrollList = ({
  allDateTimes,
  allResponses,
  selectedIndex,
  setSelectedIndex,
  bestKeys,
  confirmedDateTime,
  sx = {},
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  allResponses: ScheduleTableProps['allResponses'];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  bestKeys: Set<string>;
  confirmedDateTime: string | null;
  sx?: any;
}) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      gap: 1.5,
      p: 1.5,
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#fafafa',
      '&::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      ...sx,
    }}
  >
    {allDateTimes.map(({ date, time, key }, index) => {
      const tabSummary = calculateSummary(key, allResponses);
      const tabScore = calculateScore(tabSummary.available, tabSummary.maybe);
      const isTabBest = bestKeys.has(key);
      const isTabConfirmed = confirmedDateTime === key;
      const isSelected = index === selectedIndex;

      return (
        <DateStatusCard
          key={key}
          date={date}
          time={time}
          score={tabScore}
          total={allResponses.length}
          isConfirmed={isTabConfirmed}
          isBest={isTabBest}
          isSelected={isSelected}
          onClick={() => setSelectedIndex(index)}
          sx={{
            border: isSelected ? '2px solid' : '1px solid #e5e7eb',
            borderColor: isSelected ? 'primary.main' : '#e5e7eb',
          }}
        />
      );
    })}
  </Box>
);

const ResponseList = ({
  allResponses,
  respondentId,
  selectedKey,
  isEditing,
  onEdit,
}: {
  allResponses: ScheduleTableProps['allResponses'];
  respondentId: string | null;
  selectedKey: string;
  isEditing: boolean;
  onEdit: () => void;
}) => {
  const sortedResponses = allResponses;

  return (
    <Box>
      {sortedResponses.map((response, index) => {
        const isMyResponse = response.respondentId === respondentId;
        // Keep row visible even when editing (since we use a dialog now)
        // if (isMyResponse && isEditing) return null;

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
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Typography
              onClick={isMyResponse ? onEdit : undefined}
              sx={{
                fontWeight: isMyResponse ? 600 : 500,
                fontSize: '14px',
                color: isMyResponse ? 'primary.main' : 'text.primary',
                cursor: isMyResponse ? 'pointer' : 'default',
                '&:hover': isMyResponse ? { opacity: 0.7 } : undefined,
              }}
            >
              {response.name}
              {isMyResponse && (
                <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
                  (Me)
                </Typography>
              )}
            </Typography>
            <StatusIcon status={response.availability[selectedKey]} size={24} />
          </Box>
        );
      })}
    </Box>
  );
};

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const selectedDateTime = allDateTimes[selectedIndex];
  const selectedKey = selectedDateTime?.key;

  const showOverlay = (showInputForm || isEditing) && isMobile;
  const rootRef = useRef<HTMLDivElement>(null);

  const handleStartEdit = (callback: () => void) => {
    // No scrolling needed for Dialog
    callback();
  };

  return (
    <Box ref={rootRef} sx={{ position: 'relative' }}>
      <Dialog
        open={showOverlay}
        onClose={handleCancelEdit}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '2px', m: 2.5, width: 'calc(100% - 40px)' } }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >

        <Box sx={{ p: 2.5, pb: 0 }}>
          {selectedDateTime && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <IconButton
                  onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                  disabled={selectedIndex === 0}
                  size="small"
                >
                  <ChevronLeft />
                </IconButton>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                    <FormattedDate date={selectedDateTime.date} />
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {selectedDateTime.time || '-'}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setSelectedIndex((prev) => Math.min(allDateTimes.length - 1, prev + 1))}
                  disabled={selectedIndex === allDateTimes.length - 1}
                  size="small"
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              <ScoreProgressBar
                score={calculateScore(
                  calculateSummary(selectedKey, allResponses).available,
                  calculateSummary(selectedKey, allResponses).maybe
                )}
                total={allResponses.length}
                fontSize="13px"
                mt='4px'
              />
            </>
          )}
        </Box>

        <Box sx={{ p: 2.5, overflowY: 'auto' }}>
          <TextField
            label="名前"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0.25 } }}
          />

          <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', mb: 2, borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
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
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: isCurrentStatus ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    borderColor: isCurrentStatus ? 'primary.main' : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    transition: 'all 0.2s',
                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
                  }}
                >
                  <StatusIcon status={statusOption} size={24} />
                </Box>
              );
            })}
          </Box>


          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '10px', mb: 2 }}>
            {allDateTimes.map(({ date, key }, idx) => {
              const myStatus = myAvailability[key] ?? 'unavailable';
              const colors = { available: '#4caf50', maybe: '#ff9800', unavailable: '#f44336' };
              const isSelected = idx === selectedIndex;
              return (
                <Chip
                  key={key}
                  size="small"
                  label={<FormattedDate date={date} />}
                  onClick={() => setSelectedIndex(idx)}
                  sx={{
                    height: '32px',
                    fontSize: '11px',
                    backgroundColor: colors[myStatus],
                    color: 'white',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    borderRadius: '2px',
                    width: '100%',
                    '&:hover': { backgroundColor: colors[myStatus], opacity: 0.9 },
                    '&:focus': { backgroundColor: colors[myStatus] },
                    '&:active': { backgroundColor: colors[myStatus] },
                  }}
                />
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={handleCancelEdit} sx={{ borderRadius: 0.25, fontSize: 13 }}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={!voterName.trim()}
              sx={{ borderRadius: 0.25, fontSize: 13 }}
            >
              {isEditing ? '更新' : '送信'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Normal Mode Mode Date Tabs */}
      <DateScrollList
        allDateTimes={allDateTimes}
        allResponses={allResponses}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        bestKeys={bestKeys}
        confirmedDateTime={confirmedDateTime}
      />

      {/* Selected Date Details */}
      {selectedDateTime && (
        <Box>
          <ResponseList
            allResponses={allResponses}
            respondentId={respondentId}
            selectedKey={selectedKey}
            isEditing={isEditing}
            onEdit={() => handleStartEdit(handleEdit)}
          />

          {/* Action Button */}
          {!isClosed && (
            <Box sx={{ p: 2, borderTop: allResponses.length === 0 ? 'none' : '1px solid #ddd' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={isSubmitted ? <EditIcon /> : <AddIcon />}
                onClick={() => handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))}
                sx={{ p: 1.5, borderRadius: '2px', fontWeight: 600 }}
              >
                {isSubmitted ? '出欠を編集' : '出欠を入力'}
              </Button>
            </Box>
          )}
        </Box>
      )
      }
    </Box >
  );
}
