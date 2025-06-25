// Simulates M-Pesa SMS parsing and interaction.

// Example M-Pesa messages:
// 1. "RCVD KES1,000.00 from JANE DOE 07XX123456 on 20/6/24 at 3:30 PM. New M-PESA balance is KES5,500.00. Transaction ID: SFJ7123ABC." (Standard P2P)
// 2. "Confirmed. KES2,500.00 sent to JOHN DOE for account 12345 on 15/6/24 at 10:00 AM. New M-PESA balance is KES3,000.00. Transaction ID: SFL987XYZ." (Sent to Paybill/Buy Goods - less relevant for direct contributions unless Chama uses Till)
// 3. "You have received KES 500.00 from PETER PAN on 21/06/2024 11:45:12. New M-PESA balance is KES 1,200.00. Transaction code: RGH8XYZ123" (Another variation)

// For MVP, we focus on receiving money.
// The PRD mentions "M-Pesa SMS parsing (Amount, Date, Transaction ID)" and "Forwarded receipt processing".

/**
 * Parses a simulated M-Pesa SMS string to extract payment details.
 * @param {string} smsBody The text of the M-Pesa SMS.
 * @returns {object|null} An object with { amount, date, transactionId, senderName, senderPhoneNumber } or null if parsing fails.
 */
function parseMpesaSms(smsBody) {
  console.log('MPESA_SERVICE: Attempting to parse SMS:', smsBody);

  // Regex for common "received money" messages. This will need refinement.
  // Looking for: Amount, Date (dd/mm/yy or dd/mm/yyyy), Transaction ID
  // Example: "RCVD KES1,000.00 from JANE DOE 07XX123456 on 20/6/24 at ... Transaction ID: SFJ7123ABC."
  // Example: "You have received KES 500.00 from PETER PAN on 21/06/2024 ... Transaction code: RGH8XYZ123"

  let match;
  const patterns = [
    // Pattern 1: "RCVD KES<amount> from <name> <phone> on <date> ... Transaction ID: <txId>"
    /RCVD\s+KES([\d,]+\.\d{2})\s+from\s+([A-Z\s]+?)(?:\s+([\dX]{10,12}))?\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4}).*?Transaction ID:\s*([A-Z0-9]+)/i, // Allow X in phone
    // Pattern 2: "You have received KES<amount> from <name> on <date> ... Transaction code: <txId>"
    /You have received\s+KES([\d,]+\.\d{2})\s+from\s+([A-Z\s]+)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+\d{1,2}:\d{1,2}:\d{1,2}\.\s+New M-PESA balance is KES[\d,]+\.\d{2}\.\s+Transaction code:\s*([A-Z0-9]+)/i,
    // Pattern 3: Simplified - "Confirmed. you have received KES<amount> ... date <date> ... transaction code <txId>" (more generic)
    /Confirmed\.\s*you have received\s+KES([\d,]+\.\d{2}).*?date\s*(\d{1,2}\/\d{1,2}\/\d{2,4}).*?transaction code\s*([A-Z0-9]+)/i
  ];

  let matchedPatternIndex = -1;
  for (let i = 0; i < patterns.length; i++) {
    match = smsBody.match(patterns[i]);
    if (match) {
      matchedPatternIndex = i;
      break;
    }
  }

  if (match) { // A match was found
    const amount = parseFloat(match[1].replace(/,/g, ''));
    let dateStr, transactionId, senderName = 'Unknown Sender', senderPhoneNumber = null;

    // Assign groups based on which pattern matched
    switch (matchedPatternIndex) {
      case 0: // Pattern 1
        senderName = match[2] ? match[2].trim() : 'Unknown Sender';
        senderPhoneNumber = match[3] ? match[3].trim() : null;
        dateStr = match[4];
        transactionId = match[5];
        break;
      case 1: // Pattern 2
        senderName = match[2] ? match[2].trim() : 'Unknown Sender';
        dateStr = match[3];
        transactionId = match[4];
        break;
      case 2: // Pattern 3
        dateStr = match[2];
        transactionId = match[3];
        break;
      default:
        console.error("MPESA_SERVICE: Match found but pattern index is invalid.");
        return null;
    }

    if (!dateStr || !transactionId || isNaN(amount)) {
        console.error(`MPESA_SERVICE: Could not extract essential details: Date='${dateStr}', TxID='${transactionId}', Amount='${amount}'`);
        return null;
    }

    // TODO: Robust date parsing. For now, assume DD/MM/YY or DD/MM/YYYY
    // const dateParts = dateStr.split('/');
    // const day = parseInt(dateParts[0], 10);
    // const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-indexed
    // const year = dateParts[2].length === 2 ? 2000 + parseInt(dateParts[2], 10) : parseInt(dateParts[2], 10);
    // const parsedDate = new Date(year, month, day);
    // For MVP, just storing the string. Real date object later.

    const details = {
      amount,
      date: dateStr, // Store as string for now
      transactionId,
      senderName, // May not always be present or accurate from SMS
      senderPhoneNumber, // May not always be present
      originalSms: smsBody,
    };
    console.log('MPESA_SERVICE: Parsed M-Pesa SMS successfully:', details);
    return details;
  }

  console.log('MPESA_SERVICE: Failed to parse M-Pesa SMS.');
  return null;
}

/**
 * Processes a payment, e.g., updates Chama balances.
 * This will be expanded in the next step (Balance Broadcast).
 * @param {object} chamaStore - The in-memory store of Chamas.
const contributionService = require('./contributionService');
const chamaService = require('./chamaService'); // To find member by phone in a chama

/**
 * Processes a payment by recording it in the database.
 * @param {number} chamaId - The ID of the Chama.
 * @param {string} chamaCycleStartDate - The CurrentCycleStartDate of the Chama.
 * @param {object} paymentDetails - Parsed payment details from parseMpesa blanchâtre.
 * @param {string} memberWhoForwardedSmsPhoneNumber - Phone number of the member who forwarded the SMS (e.g. whatsapp:+254...)
 * @returns {Promise<object>} { success: boolean, message: string, contribution?: object, paidMemberPhoneNumber?: string, chamaName?: string, updatedBalance?: number }
 */
async function recordPaymentToDb(chamaId, chamaCycleStartDate, paymentDetails, memberWhoForwardedSmsPhoneNumber) {
  try {
    console.log(`MPESA_SERVICE_DB: Recording payment for Chama ID ${chamaId}. Forwarded by ${memberWhoForwardedSmsPhoneNumber}. Details:`, paymentDetails);

    // Find the member record using their phone number within this specific Chama
    // This requires a method in chamaService or memberService. Let's assume chamaService.findMemberInChamaByPhone
    // For now, let's make a direct query or enhance chamaService.
    // We need memberId.

    // Quick way: Fetch chama with members, then find. Or add specific service.
    const chamaWithMembers = await chamaService.getChamaWithMemberPaymentStatus(chamaId); // This already gives us members
    if (!chamaWithMembers) {
        return { success: false, message: "Chama not found for recording payment." };
    }

    // Normalize forwardedPhoneNumber (e.g. remove 'whatsapp:' prefix if stored differently in DB)
    const normalizedForwarderPhone = memberWhoForwardedSmsPhoneNumber.replace('whatsapp:', '');

    const payingMember = chamaWithMembers.members.find(
        m => m.phonenumber.replace('whatsapp:', '') === normalizedForwarderPhone || // DB might have prefix or not
             m.phonenumber === normalizedForwarderPhone
    );

    if (!payingMember) {
      console.log(`MPESA_SERVICE_DB: Could not identify paying member from forwarder ${memberWhoForwardedSmsPhoneNumber} in Chama ID "${chamaId}".`);
      return { success: false, message: "Could not identify paying member from the forwarder's number in this Chama." };
    }

    console.log(`MPESA_SERVICE_DB: Payment attributed to member ID ${payingMember.memberid} (${payingMember.phonenumber})`);

    const contribution = await contributionService.recordContribution({
      chamaId: chamaId,
      memberId: payingMember.memberid,
      paymentDetails: paymentDetails,
      cycleStartDate: chamaCycleStartDate, // Pass the actual cycle start date from the Chamas table
    });

    const updatedBalance = await contributionService.getTotalChamaContributions(chamaId);
    chamaWithMembers.currentBalance = updatedBalance; // Update for summary message

    console.log(`MPESA_SERVICE_DB: Payment recorded. New Chama balance for ID "${chamaId}": KES ${updatedBalance}`);

    return {
      success: true,
      message: "Payment recorded successfully in DB.",
      contribution,
      paidMemberPhoneNumber: payingMember.phonenumber, // original number from DB
      chamaName: chamaWithMembers.name, // Name from fetched Chama
      updatedBalance: updatedBalance
    };

  } catch (error) {
    console.error(`MPESA_SERVICE_DB: Error recording payment to DB for Chama ID ${chamaId}:`, error);
    return { success: false, message: error.message || "Failed to record payment due to a database error." };
  }
}


/**
 * Generates a balance summary message for a Chama.
 * @param {object} chama The Chama object from chamaStore.
 * @returns {string} A string summarizing the balance and member payment status.
 */
function getBalanceSummaryMessage(chama) { // Expects a Chama object from getChamaWithMemberPaymentStatus
  if (!chama) return "Chama details not found.";

  const totalMembers = chama.members ? chama.members.length : 0;
  const paidMembers = chama.members ? chama.members.filter(m => m.paidthiscycle).length : 0; // DB field is paidthiscycle
  const pendingMembers = totalMembers - paidMembers;
  // Ensure contributionamount is accessed correctly (DB fields are often lowercase)
  const contributionAmount = parseFloat(chama.contributionamount) || 0;
  const expectedTotalThisCycle = totalMembers * contributionAmount;
  const currentBalance = parseFloat(chama.currentBalance) || 0;

  let summary = `Chama "${chama.name || chama.chamaname}" Balance Update:\n`; // name or chamaname
  summary += `Total Collected: KES ${currentBalance.toFixed(2)}\n`;
  summary += `Expected This Cycle: KES ${expectedTotalThisCycle.toFixed(2)}\n`;
  summary += `Members Paid: ${paidMembers}/${totalMembers}\n`;
  summary += `Members Pending: ${pendingMembers}/${totalMembers}\n\n`;

  summary += "Status:\n";
  if (chama.members) {
    chama.members.forEach(member => {
      // Ensure contributionamount and lastpaymentamount are handled correctly (they might be strings from DB)
      const memberLastPayment = member.lastpaymentamount ? parseFloat(member.lastpaymentamount) : contributionAmount;
      const status = member.paidthiscycle ? `PAID (KES ${memberLastPayment.toFixed(2)})` : 'PENDING';
      summary += `- ${member.phonenumber}: ${status}\n`; // DB field is phonenumber
    });
  }

  // Simple way to reset for next cycle for simulation - will be improved with proper cycle logic
  if (paidMembers === totalMembers && totalMembers > 0) {
    summary += "\nAll members have paid for this cycle! 🎉";
    // chama.members.forEach(m => m.paidThisCycle = false); // Reset for next cycle - DO THIS ELSEWHERE, NOT IN A GETTER
    // console.log(`BALANCE_SUMMARY: All members paid for ${chama.name}. Ready for next cycle (manual reset needed for now).`);
  }
  return summary;
}

module.exports = { parseMpesaSms, recordPaymentToDb, getBalanceSummaryMessage };
