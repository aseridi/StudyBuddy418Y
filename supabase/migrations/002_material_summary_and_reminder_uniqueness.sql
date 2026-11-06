-- Add summary column to the materials table
-- Add unique constraint to the notifications table to avoid duplicate reminders

ALTER TABLE public.materials
ADD COLUMN summary TEXT;


ALTER TABLE public.notifications
ADD CONSTRAINT notifications_reminder_unique UNIQUE (assignment_id, days_until_due, channel);