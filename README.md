# Chama Payment Reminder Bot (MVP)

## Product Vision
Eliminate missed Chama contributions through automated WhatsApp reminders and transparent tracking. (As per PRD).

## Overview
This project is an MVP (Minimum Viable Product) implementation of the Chama Payment Reminder Bot. It provides core functionalities allowing treasurers to set up their Chamas, add members, and define contribution schedules. The bot can then (theoretically, based on current implementation) send reminders and process simulated M-Pesa payment confirmations.

The backend is built with Node.js and Express, using PostgreSQL for data persistence. WhatsApp integration is designed for Twilio.

## Current Features (MVP Implementation Status)

*   **Treasurer Setup via WhatsApp:**
    *   Initiate setup with a "JOIN" command.
    *   Conversational flow to collect:
        *   Chama Name
        *   Member Phone Numbers
        *   Contribution Amount
        *   Contribution Schedule (text-based, e.g., "monthly on the 5th")
    *   Data stored in PostgreSQL database.
*   **Incoming WhatsApp Message Handling:**
    *   Basic webhook endpoint (`/whatsapp/webhook`) to receive messages.
*   **M-Pesa SMS Parsing (Simulated):**
    *   Logic to parse common "received money" M-Pesa SMS formats (forwarded by users).
    *   Extracts amount, date, transaction ID, and sender details.
    *   Records contributions to the database.
    *   Handles potential duplicate transaction IDs.
*   **Balance Tracking & Broadcast (Simulated):**
    *   Calculates Chama balance based on recorded contributions.
    *   Provides a balance summary including paid/pending status for members.
    *   Responds to "BAL" command from users with the balance summary.
    *   Sends a balance update to the user who forwarded an M-Pesa SMS after successful processing.
*   **Reminder Logic (Basic):**
    *   Periodically checks for Chamas due for reminders based on their schedule.
    *   Naive schedule parsing (e.g., "monthly on the 5th", "weekly every Friday").
    *   Sends reminders to members who haven't paid for the current cycle (based on DB status).
*   **Outgoing WhatsApp Reminders (Twilio Integration):**
    *   Integrated Twilio SDK for sending messages.
    *   Uses environment variables for Twilio credentials.
    *   Simulates sending if credentials are not provided.
*   **Database Integration:**
    *   PostgreSQL database schema defined (`schema.sql`).
    *   Services created to interact with the database for Chamas, members, and contributions.

## Technical Specifications (MVP)

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **WhatsApp Integration:** Twilio (via their WhatsApp Business API)
*   **Key Libraries:**
    *   `express`: Web framework
    *   `pg`: PostgreSQL client
    *   `twilio`: Twilio SDK
    *   `body-parser`: Request body parsing
    *   `dotenv`: Environment variable management
    *   `jest`: Testing framework

## Setup and Running Locally

1.  **Prerequisites:**
    *   Node.js (v16+ recommended)
    *   PostgreSQL server running.
    *   Twilio account (for actual WhatsApp messaging).

2.  **Clone the repository (if applicable).**

3.  **Install Dependencies:**
    ```bash
    cd /path/to/chama-bot 
    npm install
    ```

4.  **Database Setup:**
    *   Create a PostgreSQL database (e.g., `chama_bot_db`).
    *   Create a database user (e.g., `chama_bot_user`) with a password and grant permissions to the database.
    *   Execute the schema definition located in `src/config/schema.sql` against your database to create the necessary tables.
        ```bash
        # Example using psql
        psql -U your_postgres_superuser -d chama_bot_db -f src/config/schema.sql
        ```

5.  **Environment Variables:**
    Create a `.env` file in the `chama-bot` root directory with the following variables:
    ```env
    # Database Configuration
    DB_USER=chama_bot_user
    DB_PASSWORD=your_chama_bot_user_password
    DB_HOST=localhost
    DB_NAME=chama_bot_db
    DB_PORT=5432

    # Twilio Configuration (Optional for core logic, required for sending messages)
    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN=your_auth_token
    TWILIO_PHONE_NUMBER=whatsapp:+14155238886 # Your Twilio WhatsApp number

    # Application Configuration
    NODE_ENV=development
    PORT=3000
    ```

6.  **Run the Application:**
    ```bash
    npm start
    ```
    The server should start on the specified `PORT` (default 3000).

7.  **Expose Webhook (for Twilio):**
    *   If testing with a live Twilio account, your local server's `/whatsapp/webhook` endpoint needs to be accessible from the internet. Use a tool like `ngrok` for this during development.
    *   Example: `ngrok http 3000`
    *   Update your Twilio WhatsApp number's webhook URL in the Twilio console to point to the ngrok URL (e.g., `https://your-ngrok-id.ngrok.io/whatsapp/webhook`).

## Running Tests

*   Tests are written using Jest.
*   Some tests for database services mock the DB calls. M-Pesa parsing has unit tests.
*   To run tests:
    ```bash
    npm test
    ```
*   **Note:** There are known issues with some tests, particularly around M-Pesa SMS parsing for specific formats and complex mock call verifications in `chamaService.test.js`. These were not fully resolved in the MVP timeframe.

## API Endpoints

*   `POST /whatsapp/webhook`: Main endpoint for receiving incoming WhatsApp messages from Twilio.

## Project Structure

```
chama-bot/
├── src/
│   ├── api/            # API route handlers (e.g., whatsapp.js)
│   ├── config/         # Configuration files (db.js, schema.sql)
│   ├── services/       # Business logic (chamaService, mpesaService, etc.)
│   ├── utils/          # Utility functions (currently empty)
│   └── index.js        # Main application entry point
├── tests/              # Jest test files
│   └── services/
├── .env.example        # Example environment file (TODO: Create this)
├── jest.config.js      # Jest configuration
├── package.json
├── package-lock.json
└── README.md
```

## Next Steps & Future Enhancements (Post-MVP)

Based on the original PRD and current MVP status:

1.  **Robust M-Pesa Parsing:**
    *   Improve regex or use a more advanced parsing library for M-Pesa (and other provider) messages.
    *   Handle a wider variety of SMS formats and edge cases.
    *   Support forwarded receipts from Equitel, Airtel Money.
2.  **Refined Reminder Logic:**
    *   Implement 3-tier escalation for reminders (72hr, 24hr, Due Day + hourly).
    *   More robust schedule parsing (e.g., using cron expressions or a dedicated scheduling library).
    *   Manage reminder sending to avoid spamming.
3.  **Full Twilio Integration & Error Handling:**
    *   Thorough testing with live Twilio API.
    *   Comprehensive error handling for message sending failures.
    *   Handle Twilio delivery receipts.
4.  **User Interface/Admin Panel (Optional):**
    *   A simple web interface for managing Chamas, viewing reports, etc., could be beneficial.
5.  **Premium Features Implementation:**
    *   Smart PDF Reports (contribution history, interest, projected payouts).
    *   Savings Insights ("Group Health Score," peer benchmarking, goal tracking).
    *   SMS Reminders (failover via Africa's Talking).
6.  **Language Toggle:** Swahili/English support in messages and commands.
7.  **Enhanced Security:**
    *   Thorough security audit, especially around phone numbers and financial data.
    *   Review data privacy implications.
8.  **Comprehensive Testing:**
    *   Resolve known issues with current tests.
    *   Add integration tests with a test database.
    *   End-to-end tests simulating user flows.
9.  **Scalability & Reliability:**
    *   Optimize database queries.
    *   Implement proper logging and monitoring.
    *   Consider containerization (e.g., Docker) for deployment.
10. **User State Management:** Move `userState` from in-memory to database or a distributed cache for better scalability and persistence across multiple server instances.
11. **M-Pesa API Integration (Daraja):** For more direct and reliable payment confirmation beyond SMS parsing.
12. **Cycle Management:** Implement formal logic for starting/ending contribution cycles and resetting payment statuses.
13. **Discrepancy Alerts:** For mismatched payment amounts.
14. **Full PRD Feature Set:** Systematically work through all features outlined in the PRD for subsequent versions.

## Known Issues / Limitations in MVP

*   **M-Pesa SMS Parsing:** The current regex-based parsing is basic and may not cover all M-Pesa message formats. Some tests for parsing are currently failing.
*   **Schedule Parsing:** Reminder scheduling is based on naive string matching and needs to be made more robust.
*   **Testing:** Not all unit/integration tests are passing. DB-dependent tests require a live or fully mocked DB environment.
*   **Error Handling:** Basic error handling is in place; more comprehensive error management is needed.
*   **Group Messaging:** Balance broadcasts and some notifications are simplified to send to individuals (e.g., treasurer or forwarder) rather than full group broadcasts due to complexities in managing group sends via Twilio for an MVP.
*   **User State:** Conversation state (`userState`) is currently in-memory and will not persist across server restarts or scale to multiple instances.
*   **No actual M-Pesa API verification:** Relies solely on SMS, which is less secure/reliable.
*   **Cycle Reset:** `paidThisCycle` flags for members are not automatically reset at the end of a cycle in this MVP.
```
## Colloborator
- Liso Mlunguza
- Email: lisomlunguza8@gmail.com

