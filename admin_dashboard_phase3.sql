-- ============================================
-- Phase 3: Booking Management - Database Setup
-- ============================================

-- 1. Bookings Table
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trip_date_id UUID REFERENCES trip_dates(id) ON DELETE SET NULL,
  
  guest_count INTEGER DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed, refunded
  payment_status TEXT DEFAULT 'pending', -- pending, partial, paid, refunded, failed
  
  customer_name TEXT, -- Snapshot in case user is deleted or for quick access
  customer_email TEXT,
  customer_phone TEXT,
  
  special_requests TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS bookings_trip_id_idx ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Payment Transactions
-- ============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT, -- stripe, razorpay, bank_transfer, cash
  transaction_id TEXT, -- External ID from payment gateway
  status TEXT DEFAULT 'pending', -- pending, success, failed, refunded
  
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS payment_transactions_booking_id_idx ON payment_transactions(booking_id);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions"
  ON payment_transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Trigger to update booking amount_paid
-- ============================================
CREATE OR REPLACE FUNCTION update_booking_paid_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE bookings
    SET amount_paid = (
      SELECT COALESCE(SUM(amount), 0)
      FROM payment_transactions
      WHERE booking_id = NEW.booking_id
      AND status = 'success'
    )
    WHERE id = NEW.booking_id;
  END IF;
  
  IF (TG_OP = 'DELETE') THEN
    UPDATE bookings
    SET amount_paid = (
      SELECT COALESCE(SUM(amount), 0)
      FROM payment_transactions
      WHERE booking_id = OLD.booking_id
      AND status = 'success'
    )
    WHERE id = OLD.booking_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_amount_trigger
AFTER INSERT OR UPDATE OR DELETE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_booking_paid_amount();
