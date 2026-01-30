-- Enable RLS on quiz_responses if not already enabled
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- 1. Allow EVERYONE (Public/Anon + Authenticated) to create a quiz response
-- This is essential for a lead-gen form
CREATE POLICY "Everyone can submit quiz responses" 
ON quiz_responses 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow Users to read ONLY their own responses (based on user_id)
-- If user_id is null (anon submission), they technically can't "read" it back via RLS unless we track session, 
-- but usually the UI just shows a success message.
CREATE POLICY "Users can read own responses" 
ON quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Allow Admins to read ALL responses
CREATE POLICY "Admins can read all responses" 
ON quiz_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
