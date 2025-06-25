-- PRD Driven Schema for Chama Payment Reminder Bot (PostgreSQL)

-- Table to store information about each Chama group
CREATE TABLE Chamas (
    ChamaID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    TreasurerPhoneNumber VARCHAR(20) NOT NULL UNIQUE, -- Assuming one treasurer per Chama for MVP
    ContributionAmount DECIMAL(10, 2) NOT NULL,
    ScheduleDescription TEXT NOT NULL, -- e.g., "monthly on the 5th", "weekly every Friday"
    -- For more advanced scheduling, consider fields like CronExpression, NextDueDate, etc.
    CurrentCycleStartDate TIMESTAMP WITH TIME ZONE, -- When the current contribution cycle began
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store information about members of each Chama
CREATE TABLE Members (
    MemberID SERIAL PRIMARY KEY,
    ChamaID INT NOT NULL REFERENCES Chamas(ChamaID) ON DELETE CASCADE,
    PhoneNumber VARCHAR(20) NOT NULL, -- Member's WhatsApp phone number
    FullName VARCHAR(255), -- Optional, can be collected later
    JoinedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE, -- To handle members leaving
    UNIQUE (ChamaID, PhoneNumber) -- A member can only be in a specific Chama once
);

-- Table to store individual contributions made by members
CREATE TABLE Contributions (
    ContributionID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL REFERENCES Members(MemberID) ON DELETE CASCADE,
    ChamaID INT NOT NULL REFERENCES Chamas(ChamaID), -- For easier querying directly on Chama
    Amount DECIMAL(10, 2) NOT NULL,
    TransactionID VARCHAR(50) UNIQUE, -- M-Pesa Transaction ID, should be unique
    PaymentDate TIMESTAMP WITH TIME ZONE NOT NULL, -- Date of payment from M-Pesa SMS or user input
    RecordedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- When the bot recorded it
    CycleReference VARCHAR(50), -- e.g., "2024-JUL", or a cycle ID if cycles are explicitly managed
    Notes TEXT -- Optional notes
);

-- Junction table to track payment status for each member in each cycle (more robust than boolean on member)
-- This allows history and tracking if a member misses a cycle then pays later.
CREATE TABLE MemberCyclePayments (
    MemberCyclePaymentID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL REFERENCES Members(MemberID) ON DELETE CASCADE,
    ChamaID INT NOT NULL REFERENCES Chamas(ChamaID) ON DELETE CASCADE,
    CycleStartDate TIMESTAMP WITH TIME ZONE NOT NULL, -- Identifies the cycle, matches Chamas.CurrentCycleStartDate
    IsPaid BOOLEAN DEFAULT FALSE,
    AmountPaid DECIMAL(10, 2),
    PaymentDate TIMESTAMP WITH TIME ZONE,
    ContributionID INT REFERENCES Contributions(ContributionID) ON DELETE SET NULL, -- Link to the specific contribution
    UNIQUE (MemberID, ChamaID, CycleStartDate) -- Ensure one payment record per member per cycle
);

-- Indexes for performance
CREATE INDEX idx_chamas_treasurer_phone ON Chamas(TreasurerPhoneNumber);
CREATE INDEX idx_members_chama_id ON Members(ChamaID);
CREATE INDEX idx_members_phone_number ON Members(PhoneNumber);
CREATE INDEX idx_contributions_member_id ON Contributions(MemberID);
CREATE INDEX idx_contributions_chama_id ON Contributions(ChamaID);
CREATE INDEX idx_contributions_tx_id ON Contributions(TransactionID);
CREATE INDEX idx_member_cycle_payments_cycle ON MemberCyclePayments(ChamaID, CycleStartDate);

-- Function to automatically update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.UpdatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Chamas table
CREATE TRIGGER set_chamas_updated_at
BEFORE UPDATE ON Chamas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Consider a table for RemindersSent if detailed tracking of each reminder is needed.
-- CREATE TABLE RemindersSent (
--     ReminderID SERIAL PRIMARY KEY,
--     MemberID INT NOT NULL REFERENCES Members(MemberID),
--     ChamaID INT NOT NULL REFERENCES Chamas(ChamaID),
--     ReminderType VARCHAR(50), -- e.g., "72hr_due", "24hr_due", "due_day"
--     SentAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     Message TEXT
-- );

-- Consider a table for BotUsers if general users not part of a Chama interact (e.g. for 'JOIN' before being a treasurer)
-- CREATE TABLE BotUsers (
--     PhoneNumber VARCHAR(20) PRIMARY KEY,
--     CurrentState JSONB, -- For conversation state machine
--     LastInteractionAt TIMESTAMP WITH TIME ZONE
-- );

COMMENT ON COLUMN Chamas.ScheduleDescription IS 'User-provided text for the schedule, e.g., ''monthly on the 5th''';
COMMENT ON COLUMN Contributions.CycleReference IS 'Identifier for the contribution cycle, e.g., ''2024-JUL'' or a specific cycle ID if cycles are managed more formally.';
COMMENT ON TABLE MemberCyclePayments IS 'Tracks payment status of each member for each defined contribution cycle.';

-- TODO for future:
-- - Table for scheduled jobs / cron tasks (e.g. reminder triggers)
-- - More robust cycle management (e.g., a specific Cycles table)
-- - Audit trails for important changes
-- - Storing M-Pesa specific fields if deeper integration is needed.
-- - Language preference for users/Chamas.
-- - Premium feature flags for Chamas.
-- - NGO/Partner specific data if needed.
-- - Storing raw M-Pesa SMS for audit.
-- - User preferences (e.g., notification settings).
-- - Error log table for bot operations.
-- - Feedback table from users.
-- - Session management for multi-turn conversations.
-- - API keys / external service configurations.
-- - Versioning for Chama settings if they can change over time.
-- - Handling for different M-Pesa message formats.
-- - Table for 'Group Health Score' components.
-- - Table for 'Goal Tracking'.
-- - PDF Report generation history/status.
-- - SMS sending logs (if using Africa''s Talking).
-- - User roles within a Chama (e.g. Chair, Secretary).
-- - Blockchain audit trail (as mentioned in PRD risks - very advanced).
-- - Support for other mobile money operators.
-- - Storing of PIN for M-Pesa verification (KES 1) - This needs extreme security considerations.
--   Likely better to do one-time validation via M-Pesa API rather than storing PIN.
--   The PRD mentions "Verify via M-Pesa PIN (KES 1)" - this needs clarification on how it's implemented.
--   Forcing user to send KES 1 to a specific number, then matching, is safer than handling PINs.
-- - 'Auto-advance from group funds' logic will require careful transaction management.
-- - 'Government compliance toolkit' implies storing/generating specific documents or data.
-- - Swahili NLP query storage or logging if queries are analyzed.
-- - Referral program tracking.
-- - Tiered pricing feature flags.
-- - Data related to "Savings Insights" and "Peer Benchmarking".
-- - Interest calculation settings per Chama.
-- - Projected payout dates storage.
-- - Failover mechanisms state.
-- - Manual override flags/logs for M-Pesa parsing.
-- - End-to-end encryption related metadata (if any stored, though actual E2E is message content).
-- - Payment dispute resolution tracking.
-- - User consent for data processing (GDPR/DPA).
-- - Archival strategy for old data.
-- - Multi-currency support (if expanding beyond KES).
-- - Audit log for who made changes to Chama settings.
-- - Logging of API calls to external services (Twilio, M-Pesa API, Africa''s Talking).
-- - Storing user's language preference (Swahili/English).
-- - Tracking of forwarded receipt processing status (Equitel, Airtel Money).
-- - Discrepancy alerts log.
-- - Projected payout dates.
-- - Savings goal tracking details.
-- - SMS delivery receipts.
-- - NGO partnership details and subsidized access tracking.
-- - Enterprise Chama specific features/data.
-- - User session data for consultations.
-- - Activation rate tracking data points.
-- - Engagement metrics data points.
-- - Retention metrics data points.
-- - Virality (invites per Chama) tracking.
-- - Data for "Group Health Score".
-- - Data for "Peer Benchmarking".
-- - Data for "Goal Tracking".
-- - Data for "Projected Payout Dates".
-- - Data for "Interest Calculations".

-- Initial data or seed data could be added here if necessary.
-- For example, default settings or admin user.
-- Example: INSERT INTO Chamas (Name, TreasurerPhoneNumber, ContributionAmount, ScheduleDescription) VALUES ('Test Chama', 'whatsapp:+1234567890', 1000, 'monthly on the 1st');
-- Example: INSERT INTO Members (ChamaID, PhoneNumber) VALUES (1, 'whatsapp:+0987654321');
-- Example: INSERT INTO Contributions (MemberID, ChamaID, Amount, TransactionID, PaymentDate) VALUES (1, 1, 1000, 'TESTTX123', '2024-01-01T10:00:00Z');
-- Example: INSERT INTO MemberCyclePayments (MemberID, ChamaID, CycleStartDate, IsPaid, AmountPaid) VALUES (1,1, '2024-01-01T00:00:00Z', TRUE, 1000);

-- The `chamaStore` in-memory object has:
-- treasurerPhoneNumber: { name, members: [{ phoneNumber, paidThisCycle, lastPaymentAmount, lastPaymentDate, lastPaymentTxId }], contributionAmount, schedule, createdAt, contributions: [], processedTransactionIds: [], currentBalance }
-- This schema aims to capture these fields in a relational way.
-- `paidThisCycle` on member is replaced by MemberCyclePayments for better history.
-- `lastPayment...` on member is effectively the latest entry in Contributions or MemberCyclePayments.
-- `processedTransactionIds` is covered by Contributions.TransactionID being UNIQUE.
-- `currentBalance` would be a calculated sum from Contributions for a Chama.
-- `createdAt` is on Chamas table.
-- `members` array maps to Members table.
-- `contributions` array maps to Contributions table.
-- `treasurerPhoneNumber` is on Chamas table.
-- `name`, `contributionAmount`, `schedule` are on Chamas table.
-- `userState` in-memory object: { phoneNumber: { step, tempData } } -> Could map to BotUsers.CurrentState
