// mockDatabase.js

const mockDatabase = {
    // Define mock methods for database operations
    query: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  
  module.exports = mockDatabase;
  