-- Update Script: Add UNIQUE constraint to cid and update sample data
-- Run this in Supabase SQL Editor

-- 1. Add UNIQUE constraint to cid column (if not exists)
ALTER TABLE courses ADD CONSTRAINT courses_cid_unique UNIQUE (cid);

-- 2. Update existing courses with proper courseJson and banner images
UPDATE courses 
SET courseJson = jsonb_build_object(
    'name', name,
    'description', description,
    'category', category,
    'level', level,
    'noOfChapters', noOfChapters,
    'includeVideo', includeVideo,
    'chapters', COALESCE((courseJson::jsonb->'chapters'), '[]'::jsonb)
)
WHERE courseJson IS NULL OR courseJson::text = '{}';

-- 3. Add banner images to sample courses
UPDATE courses 
SET bannerImageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
WHERE cid = 'course-001' AND (bannerImageUrl IS NULL OR bannerImageUrl = '');

UPDATE courses 
SET bannerImageUrl = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800'
WHERE cid = 'course-002' AND (bannerImageUrl IS NULL OR bannerImageUrl = '');

-- 4. Verify the update
SELECT id, cid, name, 
       CASE 
         WHEN bannerImageUrl IS NOT NULL AND bannerImageUrl != '' THEN 'Has Image'
         ELSE 'No Image'
       END as image_status,
       CASE 
         WHEN courseJson IS NOT NULL AND courseJson::text != '{}' THEN 'Has Data'
         ELSE 'Empty JSON'
       END as json_status
FROM courses;
