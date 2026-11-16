-- create materials storage bucket

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('materials', 'materials', false, 10485760, '{application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain}')
ON CONFLICT (id) DO NOTHING; 
-- storage usage policy

DROP POLICY IF EXISTS "Users can upload own materials" ON storage.objects;
CREATE POLICY "Users can upload own materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'materials'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own materials" ON storage.objects;
CREATE POLICY "Users can view own materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'materials'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own materials" ON storage.objects;
CREATE POLICY "Users can delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'materials'
    AND (storage.foldername(name))[1] = auth.uid()::text
);