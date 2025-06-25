const express = require('express');
const router = express.Router();
const { TwilioMessagingResponse } = require('twilio').twiml;
const mpesaService = require('../services/mpesaService');
const chamaService = require('../services/chamaService'); // Import new chamaService

// In-memory store for user conversation states ONLY. Chama data is now in DB.
// const chamaStore = {}; // REMOVED - Chama data now in DB
const userState = {}; // Stores user's current conversation state: { phoneNumber: { step, tempData } }

// Conversation steps for treasurer setup
const SETUP_STEPS = {
  INITIAL: 'INITIAL',
  AWAITING_CHAMA_NAME: 'AWAITING_CHAMA_NAME',
  AWAITING_MEMBERS: 'AWAITING_MEMBERS',
  AWAITING_AMOUNT: 'AWAITING_AMOUNT',
  AWAITING_SCHEDULE: 'AWAITING_SCHEDULE',
  COMPLETED: 'COMPLETED',
};

// Function to send a reply via TwiML
function sendTwilioReply(res, message) {
  const twiml = new TwilioMessagingResponse();
  twiml.message(message);
  res.type('text/xml').send(twiml.toString());
}

// Main message handler
router.post('/webhook', async (req, res) => { // Made async
  const messageBody = req.body.Body.trim();
  const sender = req.body.From; // Sender's WhatsApp ID (e.g., whatsapp:+14155238886)

  console.log(`Incoming message from ${sender}: "${messageBody}"`);
  console.log('Full Twilio Payload:', JSON.stringify(req.body, null, 2));

  let currentState = userState[sender] || { step: SETUP_STEPS.INITIAL, tempData: {} };
  const upperCaseMessage = messageBody.toUpperCase();

  // Check if it's a forwarded M-Pesa SMS
  // This is a naive check. A more robust way might involve specific keywords or user states.
  // For now, if not in setup and message contains M-Pesa keywords, try parsing.
  const isPotentialMpesaForward = (
    currentState.step === SETUP_STEPS.INITIAL && // Not in an active setup
    (upperCaseMessage.includes('RCVD KES') || upperCaseMessage.includes('YOU HAVE RECEIVED KES') || upperCaseMessage.includes('CONFIRMED. YOU HAVE RECEIVED KES')) &&
    (upperCaseMessage.includes('TRANSACTION ID') || upperCaseMessage.includes('TRANSACTION CODE')) // Corrected grouping
  );

  if (isPotentialMpesaForward) {
    console.log(`WHATSAPP_API: Detected potential M-Pesa SMS from ${sender}`);
    const paymentDetails = mpesaService.parseMpesaSms(messageBody); // Renamed function

    if (paymentDetails) {
      // Try to find which Chama this user belongs to (as treasurer or member)
      let userChama = await chamaService.findChamaByTreasurer(sender);
      if (!userChama) {
        userChama = await chamaService.findChamaByMemberPhone(sender);
      }

      if (userChama) {
        // The mpesaService.recordPayment will need to be refactored to use DB an return appropriate results
        // For now, we assume it gets the chama by ID or treasurer phone, and updates DB
        // This part needs chamaId to pass to recordPayment, which then fetches/updates members of that chama.
        // Let's assume recordPayment takes chamaId, paymentDetails, and sender (forwarder)
        // It should return { success, message, updatedChamaData (with balance and member status) }

        // Placeholder for db-based recordPayment - this will be a major change in mpesaService itself
        // const result = await mpesaService.recordPaymentToDb(userChama.chamaid, paymentDetails, sender);

        // SIMPLIFIED for current mpesaService structure, still using in-memory logic within it for a moment
        // This will be the next refactor point: mpesaService to use DB.
        // For now, we'll fetch the detailed chama object to pass to the existing mpesaService functions
        // userChama contains basic Chama details, including 'chamaid' and 'currentcyclestartdate'
        const result = await mpesaService.recordPaymentToDb(userChama.chamaid, userChama.currentcyclestartdate, paymentDetails, sender);

        if (result.success) {
            let replyMessage = `Thank you! We've logged your M-Pesa transaction: ${paymentDetails.transactionId} for KES ${paymentDetails.amount}.\n\n`;

            // Fetch the latest balance summary after payment
            // userChama.chamaid should be valid here
            const updatedDetailedChama = await chamaService.getChamaWithMemberPaymentStatus(userChama.chamaid);
            if (updatedDetailedChama) {
                const balanceSummary = mpesaService.getBalanceSummaryMessage(updatedDetailedChama);
                replyMessage += balanceSummary;
            } else {
                replyMessage += "Could not retrieve updated balance summary at this time.";
            }

            sendTwilioReply(res, replyMessage);

            // Notify treasurer if a member made the payment (sender is not the treasurer)
            if (sender !== userChama.treasurerphonenumber) { // treasurerphonenumber from the initial userChama object
                const minimalUpdateForTreasurer = `FYI: Payment of KES ${paymentDetails.amount} by member ${result.paidMemberPhoneNumber} (SMS forwarded by ${sender}) for Chama "${result.chamaName}" has been recorded. New balance: KES ${result.updatedBalance}.`;
                console.log(`WHATSAPP_API: Would send to treasurer ${userChama.treasurerphonenumber}: ${minimalUpdateForTreasurer}`);
                // TODO: Implement actual sending of this notification to treasurer, perhaps using reminderService.sendWhatsAppReminder
            }
        } else {
            sendTwilioReply(res, `Sorry, there was an issue recording your payment: ${result.message}`);
        }
      } else {
        sendTwilioReply(res, "We received your M-Pesa message, but we couldn't identify which Chama you belong to. Please ensure your treasurer has added you or contact support.");
      }
    } else {
      sendTwilioReply(res, "We received a message that looks like an M-Pesa confirmation, but we couldn't fully understand it. Please ensure it's a standard M-Pesa received money SMS.");
    }
  } else if (upperCaseMessage === 'JOIN' && currentState.step === SETUP_STEPS.INITIAL) {
    userState[sender] = { step: SETUP_STEPS.AWAITING_CHAMA_NAME, tempData: { treasurer: sender } };
    sendTwilioReply(res, 'Welcome, Treasurer! What is the name of your Chama?');
  } else if (upperCaseMessage === 'BAL' && currentState.step === SETUP_STEPS.INITIAL) {
    let userChama = await chamaService.findChamaByTreasurer(sender);
    if (!userChama) {
        userChama = await chamaService.findChamaByMemberPhone(sender);
    }

    if (userChama) {
      const detailedChama = await chamaService.getChamaWithMemberPaymentStatus(userChama.chamaid);
      if (detailedChama) {
        const balanceSummary = mpesaService.getBalanceSummaryMessage(detailedChama);
        sendTwilioReply(res, balanceSummary);
      } else {
        sendTwilioReply(res, "Could not retrieve details for your Chama. Please contact support.");
      }
    } else {
      sendTwilioReply(res, "We couldn't find your Chama details to show the balance. If you're a treasurer, try sending 'JOIN' first. If you're a member, ensure your treasurer has added you.");
    }
  } else {
    switch (currentState.step) {
      case SETUP_STEPS.AWAITING_CHAMA_NAME:
        currentState.tempData.chamaName = messageBody;
        currentState.step = SETUP_STEPS.AWAITING_MEMBERS;
        sendTwilioReply(res, `Great! Chama "${messageBody}" registered. Now, please provide the phone numbers of your members, separated by commas (e.g., +2547XXXXXXXX,+2547YYYYYYYY).`);
        break;
      case SETUP_STEPS.AWAITING_MEMBERS:
        // Basic validation for phone numbers (can be improved)
        const members = messageBody.split(',').map(num => num.trim()).filter(num => num.length > 5);
        if (members.length === 0) {
          sendTwilioReply(res, 'Please provide valid phone numbers separated by commas.');
          return;
        }
        currentState.tempData.members = members;
        currentState.step = SETUP_STEPS.AWAITING_AMOUNT;
        sendTwilioReply(res, `Members added. What is the contribution amount per member (e.g., KES 1000)?`);
        break;
      case SETUP_STEPS.AWAITING_AMOUNT:
        // Basic validation for amount (can be improved)
        const amount = parseFloat(messageBody.replace(/KES/i, '').trim());
        if (isNaN(amount) || amount <= 0) {
          sendTwilioReply(res, 'Please provide a valid contribution amount (e.g., KES 1000 or 1000).');
          return;
        }
        currentState.tempData.amount = amount;
        currentState.step = SETUP_STEPS.AWAITING_SCHEDULE;
        sendTwilioReply(res, `Amount set to KES ${amount}. What is the contribution schedule? (e.g., "monthly on the 5th", "weekly every Friday")`);
        break;
      case SETUP_STEPS.AWAITING_SCHEDULE:
        currentState.tempData.schedule = messageBody;
        currentState.step = SETUP_STEPS.COMPLETED; // Mark as completed to prevent re-entry

        try {
          const newChamaData = {
            name: currentState.tempData.chamaName,
            treasurerPhoneNumber: sender, // Assuming sender is already in whatsapp:+<number> format or similar
            contributionAmount: currentState.tempData.amount,
            scheduleDescription: currentState.tempData.schedule,
            members: currentState.tempData.members // Array of phone number strings
          };

          const createdChama = await chamaService.createChama(newChamaData);

          console.log('WHATSAPP_API: New Chama Registered in DB:', createdChama);
          const memberList = createdChama.members && createdChama.members.length > 0
                             ? createdChama.members.map(m => m.phonenumber).join(', ')
                             : 'No members added yet.';
          sendTwilioReply(res, `Thank you! Your Chama "${createdChama.name}" is set up. Details:\nMembers: ${memberList}\nAmount: KES ${createdChama.contributionamount}\nSchedule: ${createdChama.scheduledescription}\nReminders will be activated.`);

        } catch (dbError) {
          console.error("WHATSAPP_API: Failed to create Chama in database:", dbError);
          sendTwilioReply(res, "Sorry, there was an error setting up your Chama. Please try again later or contact support.");
        } finally {
            // Reset user state for this sender
            delete userState[sender];
        }
        break;
      default:
        // If user is not in a setup flow and doesn't say JOIN
        // Check if user is a known treasurer
        const existingChama = await chamaService.findChamaByTreasurer(sender);
        if (existingChama) {
            sendTwilioReply(res, `Hi ${existingChama.name} Treasurer! Your Chama is active. Send 'BAL' for balance or 'MENU' for options.`);
        } else {
            sendTwilioReply(res, 'Hello! Send "JOIN" to set up your Chama payment reminders.');
        }
        break;
    }
  }
  // Persist state if not deleted (i.e. setup not completed or cancelled)
  if (userState[sender]) { // Check if userState[sender] still exists (it's deleted on completion)
      userState[sender] = currentState; // Save current state for next interaction
  }
});

// Export router (chamaStore is no longer exported as it's removed)
module.exports = { router };
