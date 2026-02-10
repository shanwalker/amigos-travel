-- ============================================================================
-- CHAT LOGGING SYSTEM - DATABASE TABLES
-- ============================================================================
-- Creates tables to log all AI chatbot conversations for admin dashboard
-- Tracks both authenticated users and anonymous users (with IP)
-- ============================================================================

-- 1. Chat Sessions Table
-- Stores metadata about each chat session
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Info
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_authenticated BOOLEAN DEFAULT false,
    user_ip TEXT,
    user_agent TEXT,
    
    -- Session Info
    session_started_at TIMESTAMPTZ DEFAULT NOW(),
    session_ended_at TIMESTAMPTZ,
    total_messages INTEGER DEFAULT 0,
    duration_seconds INTEGER, -- Calculated on session end
    
    -- Metadata
    page_url TEXT,
    referrer TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Messages Table
-- Stores individual messages within each session
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    
    -- Message Content
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- Metadata
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tokens_used INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id 
    ON chat_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_created 
    ON chat_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip 
    ON chat_sessions(user_ip);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_authenticated 
    ON chat_sessions(is_authenticated);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session 
    ON chat_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp 
    ON chat_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_role 
    ON chat_messages(role);

-- 4. Create updated_at trigger for chat_sessions
CREATE OR REPLACE FUNCTION update_chat_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_session_updated_at();

-- 5. Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Admin Only Access

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins view all chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Admins manage all chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Admins view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "System can insert chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "System can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "System can update chat sessions" ON chat_sessions;

-- Admins can view all chat sessions
CREATE POLICY "Admins view all chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
);

-- Admins can manage all chat sessions
CREATE POLICY "Admins manage all chat sessions"
ON chat_sessions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
);

-- Admins can view all chat messages
CREATE POLICY "Admins view all chat messages"
ON chat_messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
);

-- Allow system to insert chat sessions (for logging from frontend)
CREATE POLICY "System can insert chat sessions"
ON chat_sessions FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow system to insert chat messages (for logging from frontend)
CREATE POLICY "System can insert chat messages"
ON chat_messages FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow system to update chat sessions (for ending sessions)
CREATE POLICY "System can update chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- 7. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON chat_messages TO anon, authenticated;

-- 8. Verification Queries

-- Check tables exist
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('chat_sessions', 'chat_messages')
ORDER BY table_name;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, indexname;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('chat_sessions', 'chat_messages');

-- Check policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, policyname;

SELECT '✅ Chat logging tables created successfully!' as message;
