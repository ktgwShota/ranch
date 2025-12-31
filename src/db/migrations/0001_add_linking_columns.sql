-- Migration number: 0001 	 2024-05-20T00:00:00.000Z
-- Add pollId to schedules and scheduleId to polls

ALTER TABLE schedules ADD COLUMN pollId TEXT;
ALTER TABLE polls ADD COLUMN scheduleId TEXT;
