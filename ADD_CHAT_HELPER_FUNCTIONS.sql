-- ============================================================================
-- HELPER FUNCTION: Increment Chat Session Message Count
-- ============================================================================
-- This function safely increments the total_messages count for a session

CREATE OR REPLACE FUNCTION increment_chat_session_messages(session_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE chat_sessions
    SET total_messages = total_messages + 1,
        updated_at = NOW()
    WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_chat_session_messages(UUID) TO authenticated, anon;

SELECT '✅ Chat session helper function created!' as message;
