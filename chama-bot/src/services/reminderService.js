// In-memory store - in a real app, this would come from a database via chamaService.js
// For now, we'll directly access the chamaStore created in whatsapp.js, which is not ideal.
// This will be refactored when database is introduced.
// To simulate access, we'll need to export/import it or pass it around.
// For MVP simplicity, we'll assume it's globally accessible or passed if needed.
const chamaService = require('./chamaService'); // To fetch Chama data from DB

// Twilio configuration (Ideally from environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886'; // Your Twilio WhatsApp number

let twilioClient;
if (accountSid !== 'YOUR_TWILIO_ACCOUNT_SID' && authToken !== 'YOUR_TWILIO_AUTH_TOKEN') {
  twilioClient = require('twilio')(accountSid, authToken);
} else {
  console.warn("REMINDER SERVICE: Twilio credentials not found in environment variables. SMS/WhatsApp sending will be simulated.");
}


async function sendWhatsAppReminder(toPhoneNumber, message) {
  const fullToPhoneNumber = toPhoneNumber.startsWith('whatsapp:') ? toPhoneNumber : `whatsapp:${toPhoneNumber}`;
  console.log(`REMINDER SERVICE: Attempting to send to ${fullToPhoneNumber}: "${message}"`);

  if (!twilioClient) {
    console.log(`REMINDER SERVICE (SIMULATED SEND): To: ${fullToPhoneNumber}, Message: "${message}"`);
    return;
  }

  try {
    await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: fullToPhoneNumber,
      body: message,
    });
    console.log(`REMINDER SERVICE: Successfully sent reminder to ${fullToPhoneNumber}`);
  } catch (error) {
    console.error(`REMINDER SERVICE: Error sending WhatsApp message to ${fullToPhoneNumber}:`, error);
  }
}

// Naive schedule parsing and checking
async function checkAndSendReminders() {
  console.log('REMINDER SERVICE: Checking for due reminders using DB...', new Date());

  let allChamas;
  try {
    // This needs a new chamaService function: getAllChamasWithMemberPaymentStatus()
    // For now, let's imagine it exists and fetches necessary data.
    // Or, fetch all chamas, then for each, fetch details. Less efficient but works.

    // Let's assume a function that gets all chamas with their members and payment status for the current cycle.
    // This is a complex query, so for MVP, we might simplify.
    // For now, let's get all chamas, then loop and get details.
    const basicChamas = await db.query('SELECT * FROM Chamas WHERE Name IS NOT NULL;'); // Basic filter
    if (!basicChamas.rows || basicChamas.rows.length === 0) {
      console.log('REMINDER SERVICE: No Chamas configured in DB yet.');
      return;
    }
    allChamas = basicChamas.rows;

  } catch (error) {
    console.error('REMINDER SERVICE: Error fetching chamas from DB:', error);
    return;
  }

  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const currentDayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  for (const basicChama of allChamas) {
    // Fetch detailed info for this chama, including members and their payment status
    // The getChamaWithMemberPaymentStatus expects chamaId.
    const chama = await chamaService.getChamaWithMemberPaymentStatus(basicChama.chamaid);

    if (!chama || !chama.scheduledescription || !chama.members) {
        console.log(`REMINDER_SERVICE: Skipping Chama ID ${basicChama.chamaid} due to missing schedule or members.`);
        continue;
    }

    let reminderDue = false;
    const scheduleText = chama.scheduledescription.toLowerCase();

    if (scheduleText.includes('monthly')) {
      const dayMatch = scheduleText.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
      if (dayMatch) {
        if (currentDayOfMonth === parseInt(dayMatch[1], 10)) reminderDue = true;
      }
    } else if (scheduleText.includes('weekly')) {
      if (scheduleText.includes(currentDayOfWeek.toLowerCase())) reminderDue = true;
    }

    if (reminderDue) {
      console.log(`REMINDER SERVICE: Reminder due for Chama "${chama.name}" (Schedule: ${chama.scheduledescription})`);
      const reminderMessage = `Friendly reminder for Chama "${chama.name}": Contribution of KES ${chama.contributionamount} is due based on your schedule: "${chama.scheduledescription}".`;

      // Send to members who haven't paid (paidthiscycle is from getChamaWithMemberPaymentStatus)
      chama.members.forEach(member => {
        if (!member.paidthiscycle) { // Check DB field 'paidthiscycle'
          sendWhatsAppReminder(member.phonenumber, reminderMessage); // DB field 'phonenumber'
        }
      });
    }
  }
}

// The main export for starting the service if needed, or just the functions.
module.exports = { checkAndSendReminders, sendWhatsAppReminder };

// Note: The `chamaStore` argument is removed from checkReminders (now checkAndSendReminders)
// The `index.js` will need to be updated to call `checkAndSendReminders` without arguments.
// Also, `db` needs to be required in this file if `basicChamas` query is kept here.
// For now, assuming `chamaService` functions encapsulate all direct `db` calls.
// Let's add `db` require for the direct query.
const db = require('../config/db'); // Added for the direct query
