const chamaService = require('../../src/services/chamaService');
const db = require('../../src/config/db'); // We will mock this

// Mock the db module
jest.mock('../../src/config/db', () => {
  const mockQuery = jest.fn();
  const mockClient = {
    query: mockQuery,
    release: jest.fn(),
  };
  return {
    query: mockQuery, // For direct db.query calls if any
    pool: {
      connect: jest.fn(() => Promise.resolve(mockClient)), // Mock connect to return our mockClient
    },
    // Keep a reference to the mockQuery on mockClient for transactional tests
    __mockClientQuery: mockQuery,
  };
});

describe('ChamaService', () => {
  let mockClient; // To store the mock client instance

  beforeAll(async () => {
    // Get the client once to be used in beforeEach for clearing mocks
    mockClient = await db.pool.connect();
  });

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    db.query.mockClear(); // For any direct db.query calls
    db.pool.connect.mockClear(); // Clear calls to connect itself

    // Clear mocks on the shared client instance
    mockClient.query.mockClear(); // This is db.__mockClientQuery
    mockClient.release.mockClear();

    // Reset specific mock resolve values if needed for each test
    db.__mockClientQuery.mockReset(); // Same as mockClient.query.mockReset()
  });

  describe('createChama', () => {
    it('should create a new chama and its members within a transaction', async () => {
      const chamaDetails = {
        name: 'Test Chama',
        treasurerPhoneNumber: 'whatsapp:+123',
        contributionAmount: 1000,
        scheduleDescription: 'monthly',
        members: ['whatsapp:+456', 'whatsapp:+789'],
      };

      const mockChamaResult = { chamaid: 1, ...chamaDetails, currentcyclestartdate: new Date() };
      const mockMember1Result = { memberid: 10, chamaid: 1, phonenumber: 'whatsapp:+456' };
      const mockMember2Result = { memberid: 11, chamaid: 1, phonenumber: 'whatsapp:+789' };

      // Setup mock resolves for client.query in sequence
      // This is for the client returned by pool.connect()
      const clientQueryMock = db.__mockClientQuery;
      clientQueryMock
        .mockResolvedValueOnce({ command: 'BEGIN' }) // Call 1: BEGIN
        .mockResolvedValueOnce({ rows: [mockChamaResult] }) // Call 2: INSERT Chamas
        .mockResolvedValueOnce({ rows: [mockMember1Result] }) // Call 3: INSERT Member 1
        .mockResolvedValueOnce({ rows: [mockMember2Result] }) // Call 4: INSERT Member 2
        .mockResolvedValueOnce({}) // Call 5: INSERT MemberCyclePayments for member 1
        .mockResolvedValueOnce({}) // Call 6: INSERT MemberCyclePayments for member 2
        .mockResolvedValueOnce({ command: 'COMMIT' }); // Call 7: COMMIT

      const result = await chamaService.createChama(chamaDetails);

      expect(db.pool.connect).toHaveBeenCalledTimes(1); // Called once by the service

      // Transactional calls on the client mock
      expect(clientQueryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(clientQueryMock).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO Chamas'), [
        chamaDetails.name,
        chamaDetails.treasurerPhoneNumber,
        chamaDetails.contributionAmount,
        chamaDetails.scheduleDescription,
      ]);
      expect(clientQueryMock).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO Members'), [1, 'whatsapp:+456']);
      expect(clientQueryMock).toHaveBeenNthCalledWith(4, expect.stringContaining('INSERT INTO Members'), [1, 'whatsapp:+789']);
      expect(clientQueryMock).toHaveBeenNthCalledWith(5, expect.stringContaining('INSERT INTO MemberCyclePayments'), [10, 1, mockChamaResult.currentcyclestartdate]); // Corrected: only 3 params
      expect(clientQueryMock).toHaveBeenNthCalledWith(6, expect.stringContaining('INSERT INTO MemberCyclePayments'), [11, 1, mockChamaResult.currentcyclestartdate]); // Corrected: only 3 params
      expect(clientQueryMock).toHaveBeenNthCalledWith(7, 'COMMIT');

      expect(result).toEqual(expect.objectContaining({
        chamaid: 1,
        name: 'Test Chama',
        members: expect.arrayContaining([
          expect.objectContaining({ phonenumber: 'whatsapp:+456' }),
          expect.objectContaining({ phonenumber: 'whatsapp:+789' }),
        ])
      }));
    });

    it('should rollback transaction on error during chama creation', async () => {
        db.__mockClientQuery
            .mockResolvedValueOnce({ command: 'BEGIN' }) // BEGIN
            .mockResolvedValueOnce({ rows: [{ chamaid: 1, name: 'Test Chama', currentcyclestartdate: new Date() }] }) // INSERT Chamas success
            .mockRejectedValueOnce(new Error('DB error inserting member')); // Fail on member insert

        await expect(chamaService.createChama({ name: 'Test Chama', treasurerPhoneNumber: 'w:+1', contributionAmount: 100, scheduleDescription: 'm', members: ['w:+2'] }))
            .rejects.toThrow('DB error inserting member');

        expect(db.__mockClientQuery).toHaveBeenCalledWith('BEGIN');
        expect(db.__mockClientQuery).toHaveBeenCalledWith('ROLLBACK');
        expect(db.__mockClientQuery).not.toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('findChamaByTreasurer', () => {
    it('should return chama if found', async () => {
      const mockChama = { chamaid: 1, name: 'Found Chama', treasurerphonenumber: 'whatsapp:+123' };
      // This uses the direct db.query mock
      db.query.mockResolvedValueOnce({ rows: [mockChama] });

      const result = await chamaService.findChamaByTreasurer('whatsapp:+123');
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM Chamas WHERE TreasurerPhoneNumber'), ['whatsapp:+123']);
      expect(result).toEqual(mockChama);
    });

    it('should return null if chama not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const result = await chamaService.findChamaByTreasurer('whatsapp:+000');
      expect(result).toBeNull();
    });
  });

  describe('getChamaWithMemberPaymentStatus', () => {
    it('should retrieve chama with members and their payment status', async () => {
        const chamaId = 1;
        const mockChama = { chamaid: chamaId, name: 'Detailed Chama', currentcyclestartdate: new Date(), contributionamount: 500 };
        const mockMembers = [
            { memberid: 10, phonenumber: 'w:+111', paidthiscycle: true, lastpaymentamount: 500 },
            { memberid: 11, phonenumber: 'w:+222', paidthiscycle: false, lastpaymentamount: null },
        ];
        const mockBalance = { total: '1500.00' };

        // Mock sequence for db.query
        db.query
            .mockResolvedValueOnce({ rows: [mockChama] }) // Chama query
            .mockResolvedValueOnce({ rows: mockMembers }) // Members query
            .mockResolvedValueOnce({ rows: [mockBalance] }); // Balance query

        const result = await chamaService.getChamaWithMemberPaymentStatus(chamaId);

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM Chamas WHERE ChamaID = $1'), [chamaId]);
        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT \n            m.MemberID'), [chamaId]);
        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT SUM(Amount) as total FROM Contributions WHERE ChamaID = $1'), [chamaId]);

        expect(result).not.toBeNull();
        expect(result.chamaid).toBe(chamaId);
        expect(result.members.length).toBe(2);
        expect(result.members[0].paidthiscycle).toBe(true);
        expect(result.members[1].paidthiscycle).toBe(false);
        expect(result.currentBalance).toBe(1500.00);
    });

    it('should return null if chama not found for detailed view', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // Chama query returns no rows
        const result = await chamaService.getChamaWithMemberPaymentStatus(999);
        expect(result).toBeNull();
    });
  });

});
