const { getUploadedFiles } = require('../../app/services/excel.service'); // Import the function to be tested
const dB = require('../models');
const Files = dB.files;

describe('YourCodeFile', () => {
  describe('getUploadedFiles', () => {
    test('should resolve with an array of files when files exist', async () => {
      // Arrange
      const mockFiles = [
        { fileName: 'file1.txt', createdAt: new Date() },
        { fileName: 'file2.txt', createdAt: new Date() }
      ];

      // Mock the Files.findAll method to return the mockFiles
      Files.findAll = jest.fn().mockResolvedValue(mockFiles);

      // Act
      const result = await getUploadedFiles();

      // Assert
      expect(result).toEqual(mockFiles);
    });

    test('should resolve with an empty array when no files exist', async () => {
      // Mock the Files.findAll method to return an empty array
      Files.findAll = jest.fn().mockResolvedValue([]);

      // Act
      const result = await getUploadedFiles();

      // Assert
      expect(result).toEqual([]);
    });

    test('should reject with an error message when an error occurs', async () => {
      // Arrange
      const errorMessage = 'Some error occurred while retrieving files.';

      // Mock the Files.findAll method to throw an error
      Files.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

      // Act and Assert
      await expect(getUploadedFiles()).rejects.toEqual({
        message: errorMessage
      });
    });
  });
});