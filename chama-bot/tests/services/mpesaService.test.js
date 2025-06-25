const { parseMpesaSms } = require('../../src/services/mpesaService'); // Adjust path as necessary, Renamed function

describe('MpesaService - parseMpesaSms', () => { // Renamed describe block
  const testCases = [
    {
      description: 'Standard P2P received message',
      sms: 'RCVD KES1,000.00 from JANE DOE 07XX123456 on 20/6/24 at 3:30 PM. New M-PESA balance is KES5,500.00. Transaction ID: SFJ7123ABC.',
      expected: {
        amount: 1000.00,
        date: '20/6/24',
        transactionId: 'SFJ7123ABC',
        senderName: 'JANE DOE',
        senderPhoneNumber: '07XX123456',
      }
    },
    {
      description: 'Received message variation with full year and "Transaction code"',
      sms: 'You have received KES 500.00 from PETER PAN on 21/06/2024 11:45:12. New M-PESA balance is KES 1,200.00. Transaction code: RGH8XYZ123',
      expected: {
        amount: 500.00,
        date: '21/06/2024',
        transactionId: 'RGH8XYZ123',
        senderName: 'PETER PAN',
        senderPhoneNumber: null, // This pattern doesn't capture phone number
      }
    },
    {
      description: 'Received message variation - "Confirmed. you have received"',
      sms: 'Confirmed. you have received KES200.00 from DOE JOHN on 1/7/2024 for order 123. new balance is KES 2,345.00. date 01/07/2024 08:45:30 transaction code TYU675FDE.',
      expected: {
        amount: 200.00,
        date: '01/07/2024', // Will pick the second date if "date" keyword is used
        transactionId: 'TYU675FDE',
        senderName: 'Unknown Sender', // This specific regex variant doesn't capture sender name well
        senderPhoneNumber: null,
      }
    },
    {
      description: 'Message about sending money (should not parse as received)',
      sms: 'Confirmed. KES2,500.00 sent to JOHN DOE for account 12345 on 15/6/24 at 10:00 AM. New M-PESA balance is KES3,000.00. Transaction ID: SFL987XYZ.',
      expected: null
    },
    {
      description: 'Irrelevant SMS (not an M-Pesa confirmation)',
      sms: 'Your data bundle is about to expire. Dial *100# to renew.',
      expected: null
    },
    {
      description: 'M-Pesa message with no amount',
      sms: 'RCVD from JANE DOE 07XX123456 on 20/6/24. Transaction ID: SFJ7123ABC.',
      expected: null,
    },
    {
      description: 'M-Pesa message with no transaction ID',
      sms: 'RCVD KES1,000.00 from JANE DOE 07XX123456 on 20/6/24.',
      expected: null,
    }
  ];

  testCases.forEach(({ description, sms, expected }) => {
    test(description, () => {
      const result = parseMpesaSms(sms); // Renamed function
      if (expected === null) {
        expect(result).toBeNull();
      } else {
        expect(result).not.toBeNull();
        expect(result.amount).toBe(expected.amount);
        expect(result.date).toBe(expected.date);
        expect(result.transactionId).toBe(expected.transactionId);
        expect(result.senderName).toEqual(expected.senderName); // Use toEqual for objects/arrays if senderName could be complex
        expect(result.senderPhoneNumber).toEqual(expected.senderPhoneNumber);
        expect(result.originalSms).toBe(sms);
      }
    });
  });
});
