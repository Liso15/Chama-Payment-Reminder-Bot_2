const express = require('express');
const bodyParser = require('body-parser');
const { checkAndSendReminders } = require('./services/reminderService'); // Updated function name
const { router: whatsAppRouter } = require('./api/whatsapp'); // chamaStore no longer exported or needed here
const dbConfig = require('./config/db'); // For testConnection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/whatsapp', whatsAppRouter); // Use the imported router

// Test DB connection on startup
dbConfig.testConnection().then(connected => {
  if (connected) {
    // Start reminder check loop ONLY if DB is connected
    const REMINDER_INTERVAL_MS = 60 * 1000; // 1 minute
    setInterval(() => {
      checkAndSendReminders(); // No longer needs chamaStore
    }, REMINDER_INTERVAL_MS);
    console.log(`Reminder service configured to check every ${REMINDER_INTERVAL_MS / 1000} seconds.`);
  } else {
    console.error("INDEX: Database connection failed. Reminder service NOT started.");
  }
});

app.get('/', (req, res) => {
  res.send('Chama Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
