const db = require('../config/db');

/**
 * Records a contribution in the database and updates member's cycle payment status.
 * @param {number} chamaId - The ID of the Chama.
 * @param {number} memberId - The ID of the member making the contribution.
 * @param {object} paymentDetails - Parsed M-Pesa details { amount, date, transactionId, originalSms }.
 * @param {string} cycleStartDate - The start date of the current cycle for this Chama.
 * @returns {Promise<object>} The created contribution object.
 */
async function recordContribution({ chamaId, memberId, paymentDetails, cycleStartDate }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into Contributions table
    const contributionQuery = `
      INSERT INTO Contributions (MemberID, ChamaID, Amount, TransactionID, PaymentDate, Notes)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    // Assuming paymentDetails.date is a parseable date string or actual Date object.
    // For robust parsing, ensure paymentDetails.date is converted to ISO 8601 or a Date object before this.
    // For now, schema.sql's PaymentDate is TIMESTAMP WITH TIME ZONE, pg driver should handle ISO string.
    let paymentDate = new Date(); // Default to now if parsing fails or not provided
    if (paymentDetails.date) {
        // Attempt to parse DD/MM/YY or DD/MM/YYYY
        const dateParts = paymentDetails.date.split('/');
        if (dateParts.length === 3) {
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) -1; // JS month is 0-indexed
            let year = parseInt(dateParts[2], 10);
            if (year < 100) year += 2000; // YY to YYYY
            paymentDate = new Date(year, month, day);
        } else {
            // Try direct parsing if not in expected format
            const directDate = new Date(paymentDetails.date);
            if (!isNaN(directDate)) paymentDate = directDate;
        }
    }


    const contributionResult = await client.query(contributionQuery, [
      memberId,
      chamaId,
      paymentDetails.amount,
      paymentDetails.transactionId,
      paymentDate.toISOString(), // Ensure it's in a format PG likes
      paymentDetails.originalSms // Storing original SMS for audit
    ]);
    const newContribution = contributionResult.rows[0];

    if (!newContribution) {
      throw new Error('Contribution creation failed.');
    }

    // 2. Update or Insert into MemberCyclePayments
    // Assuming cycleStartDate is the correct identifier for the current cycle from Chamas table
    const cyclePaymentQuery = `
      INSERT INTO MemberCyclePayments (MemberID, ChamaID, CycleStartDate, IsPaid, AmountPaid, PaymentDate, ContributionID)
      VALUES ($1, $2, $3, TRUE, $4, $5, $6)
      ON CONFLICT (MemberID, ChamaID, CycleStartDate)
      DO UPDATE SET
        IsPaid = TRUE,
        AmountPaid = EXCLUDED.AmountPaid,
        PaymentDate = EXCLUDED.PaymentDate,
        ContributionID = EXCLUDED.ContributionID
      RETURNING *;
    `;
    await client.query(cyclePaymentQuery, [
      memberId,
      chamaId,
      cycleStartDate, // This must match exactly what's in Chamas.CurrentCycleStartDate
      newContribution.amount,
      newContribution.paymentdate, // Use the date from the contribution record
      newContribution.contributionid
    ]);

    await client.query('COMMIT');
    console.log(`CONTRIBUTION_SERVICE: Contribution ${newContribution.contributionid} recorded for member ${memberId}, Chama ${chamaId}.`);
    return newContribution;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('CONTRIBUTION_SERVICE: Error recording contribution:', error);
    if (error.code === '23505' && error.constraint === 'contributions_transactionid_key') {
      throw new Error(`Duplicate transaction ID: ${paymentDetails.transactionId}. This payment may have already been recorded.`);
    }
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Gets the total contributions for a Chama.
 * @param {number} chamaId The ID of the Chama.
 * @returns {Promise<number>} The total sum of contributions.
 */
async function getTotalChamaContributions(chamaId) {
    const queryText = `SELECT SUM(Amount) as total_collected FROM Contributions WHERE ChamaID = $1;`;
    try {
        const result = await db.query(queryText, [chamaId]);
        return parseFloat(result.rows[0].total_collected) || 0;
    } catch (error) {
        console.error(`CONTRIBUTION_SERVICE: Error getting total contributions for Chama ${chamaId}:`, error);
        throw error;
    }
}


module.exports = {
  recordContribution,
  getTotalChamaContributions,
};
