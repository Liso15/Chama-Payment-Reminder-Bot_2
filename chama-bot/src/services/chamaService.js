const db = require('../config/db');

/**
 * Creates a new Chama in the database.
 * @param {object} chamaDetails - Object containing name, treasurerPhoneNumber, contributionAmount, scheduleDescription.
 * @returns {Promise<object>} The created Chama object from the database.
 */
async function createChama({ name, treasurerPhoneNumber, contributionAmount, scheduleDescription, members }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN'); // Start transaction

    // Insert into Chamas table
    const chamaQuery = `
      INSERT INTO Chamas (Name, TreasurerPhoneNumber, ContributionAmount, ScheduleDescription, CurrentCycleStartDate)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
    `;
    // Using NOW() as CurrentCycleStartDate for simplicity, this should be refined based on actual schedule
    const chamaResult = await client.query(chamaQuery, [name, treasurerPhoneNumber, contributionAmount, scheduleDescription]);
    const newChama = chamaResult.rows[0];

    if (!newChama) {
      throw new Error('Chama creation failed.');
    }

    // Insert members into Members table
    if (members && members.length > 0) {
      const memberInsertPromises = members.map(memberPhoneNumber => {
        const memberQuery = `
          INSERT INTO Members (ChamaID, PhoneNumber, IsActive)
          VALUES ($1, $2, TRUE) RETURNING *;
        `;
        // memberPhoneNumber here is assumed to be just the number string from the setup flow
        return client.query(memberQuery, [newChama.chamaid, memberPhoneNumber]);
      });
      const memberResults = await Promise.all(memberInsertPromises);
      newChama.members = memberResults.map(res => res.rows[0]); // Attach member details to the returned Chama object
    } else {
      newChama.members = [];
    }

    // Initialize MemberCyclePayments for each member for the current cycle
    if (newChama.members.length > 0) {
        const cyclePaymentPromises = newChama.members.map(member => {
            const cyclePaymentQuery = `
                INSERT INTO MemberCyclePayments (MemberID, ChamaID, CycleStartDate, IsPaid, AmountPaid)
                VALUES ($1, $2, $3, FALSE, NULL);
            `;
            return client.query(cyclePaymentQuery, [member.memberid, newChama.chamaid, newChama.currentcyclestartdate]);
        });
        await Promise.all(cyclePaymentPromises);
    }


    await client.query('COMMIT'); // Commit transaction
    console.log('CHAMA_SERVICE: New Chama created successfully with ID:', newChama.chamaid);
    return newChama;

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('CHAMA_SERVICE: Error creating Chama:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Finds a Chama by the treasurer's phone number.
 * @param {string} treasurerPhoneNumber - The treasurer's WhatsApp phone number.
 * @returns {Promise<object|null>} The Chama object or null if not found.
 */
async function findChamaByTreasurer(treasurerPhoneNumber) {
  const queryText = `
    SELECT * FROM Chamas WHERE TreasurerPhoneNumber = $1;
  `;
  try {
    const result = await db.query(queryText, [treasurerPhoneNumber]);
    if (result.rows.length > 0) {
      const chama = result.rows[0];
      // Optionally, fetch members and other related data here if needed frequently
      // For now, just returning the basic Chama info.
      console.log(`CHAMA_SERVICE: Found Chama by treasurer ${treasurerPhoneNumber}: ID ${chama.chamaid}`);
      return chama;
    }
    return null;
  } catch (error) {
    console.error(`CHAMA_SERVICE: Error finding Chama by treasurer ${treasurerPhoneNumber}:`, error);
    throw error;
  }
}

/**
 * Finds which Chama a given phone number belongs to (as a member).
 * @param {string} memberPhoneNumber The member's phone number.
 * @returns {Promise<object|null>} The Chama object the member belongs to, or null.
 */
async function findChamaByMemberPhone(memberPhoneNumber) {
    const queryText = `
        SELECT c.*
        FROM Chamas c
        JOIN Members m ON c.ChamaID = m.ChamaID
        WHERE m.PhoneNumber = $1 AND m.IsActive = TRUE;
    `;
    try {
        const result = await db.query(queryText, [memberPhoneNumber]);
        if (result.rows.length > 0) {
            console.log(`CHAMA_SERVICE: User ${memberPhoneNumber} is a member of Chama ID ${result.rows[0].chamaid}`);
            return result.rows[0]; // Returns the first Chama they are part of if multiple (though schema implies unique)
        }
        return null;
    } catch (error) {
        console.error(`CHAMA_SERVICE: Error finding Chama for member ${memberPhoneNumber}:`, error);
        throw error;
    }
}


/**
 * Retrieves a Chama with all its members and their current cycle payment status.
 * @param {number} chamaId The ID of the Chama.
 * @returns {Promise<object|null>} Chama object with members array, or null if not found.
 */
async function getChamaWithMemberPaymentStatus(chamaId) {
    const chamaQuery = 'SELECT * FROM Chamas WHERE ChamaID = $1;';
    const membersQuery = `
        SELECT
            m.MemberID,
            m.PhoneNumber,
            m.FullName,
            m.IsActive,
            COALESCE(mcp.IsPaid, FALSE) as PaidThisCycle,
            mcp.AmountPaid as LastPaymentAmount,
            mcp.PaymentDate as LastPaymentDate,
            c.TransactionID as LastPaymentTxId
        FROM Members m
        LEFT JOIN Chamas ch ON m.ChamaID = ch.ChamaID -- To get CurrentCycleStartDate
        LEFT JOIN MemberCyclePayments mcp ON m.MemberID = mcp.MemberID AND mcp.CycleStartDate = ch.CurrentCycleStartDate
        LEFT JOIN Contributions c ON mcp.ContributionID = c.ContributionID
        WHERE m.ChamaID = $1 AND m.IsActive = TRUE;
    `;

    try {
        const chamaResult = await db.query(chamaQuery, [chamaId]);
        if (chamaResult.rows.length === 0) return null;
        const chama = chamaResult.rows[0];

        const membersResult = await db.query(membersQuery, [chamaId]);
        chama.members = membersResult.rows;

        // Calculate current balance from contributions for this cycle (or all time for MVP)
        const balanceQuery = `SELECT SUM(Amount) as total FROM Contributions WHERE ChamaID = $1;`; // Simplified: all-time balance
        const balanceResult = await db.query(balanceQuery, [chamaId]);
        chama.currentBalance = parseFloat(balanceResult.rows[0].total) || 0;

        console.log(`CHAMA_SERVICE: Retrieved Chama ID ${chamaId} with ${chama.members.length} members and payment statuses.`);
        return chama;
    } catch (error) {
        console.error(`CHAMA_SERVICE: Error getting Chama ${chamaId} with details:`, error);
        throw error;
    }
}


// TODO:
// - Add member to existing Chama
// - Remove member from Chama (mark as inactive)
// - Update Chama details
// - Get all Chamas (for admin or other purposes)
// - Functions for managing contribution cycles (e.g., startNewCycle, which would also reset paidThisCycle for members)

module.exports = {
  createChama,
  findChamaByTreasurer,
  findChamaByMemberPhone,
  getChamaWithMemberPaymentStatus,
};
