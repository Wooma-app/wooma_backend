module.exports = {
  initializeApp: jest.fn(),
  apps: [
    {
      name: '[DEFAULT]',
      options: {},
    },
  ],
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(true), // Simulates a successful document write
    get: jest.fn().mockResolvedValue({ exists: true, data: jest.fn().mockReturnValue({ uid: 'mockUid', phoneNumber: '123456789' }) }), // Simulates a Firestore document read
  }),
  auth: jest.fn().mockReturnValue({
    createUser: jest.fn().mockResolvedValue({
      uid: 'mockUid',
      emailVerified: false,
      disabled: false,
      metadata: { creationTime: 'mockTime', lastSignInTime: 'mockTime' },
      toJSON: jest.fn(),
    }), // Mock createUser response
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'mockUid' }), // Mock verifyIdToken response
  }),
  storage: jest.fn().mockReturnThis(),
};
