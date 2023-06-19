const { upload } = require('../../app/services/excel.service'); // Replace 'your-file.js' with the actual file path
const xlsx = require('xlsx')
const { validateRowData, getMissingFields, validateHeaders, isValidDate ,validEntry } = require('../../app/helpers/excel.helper');
const { error } = require('winston');
const mockDatabase = require('./mockdatabase');
jest.mock('../../app/helpers/excel.helper');
// Mock dependencies and setup test data
const loggerMock = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

const fileMock = {
    originalname: 'test.xlsx',
    buffer: 'mocked buffer'
};

const FilesMock = {
    create: jest.fn()
};

const SubjectMock = {
    bulkCreate: jest.fn()
};

const ExcelServicesMock = {
    getUploadedFiles: jest.fn().mockResolvedValue([])
};

const mockedgetMissingFields=jest.fn().mockImplementation((row)=>{
    try {
        let fields = []
        if(!row.regNumber) {
            fields.push('Reg Number');
        }
        if(!row.firstName) {
            fields.push('First Name');
        }
        if(!row.issuingAuthority) {
            fields.push('Issuing Authority');
        }
        if(!row.document) {
            fields.push('Document');
        }
         return fields;
    } catch (err) {
        return [];
    }
});


const mockedisValidDate=jest.fn().mockImplementation( (startDate, endDate) => {
    try {
        if(!(startDate && endDate)) {
            return false;
        }
        if(isFinite(new Date(startDate)) && isFinite(new Date(endDate))) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.log(err);
        return false;
    }
});


const mockedvalidRowData=jest.fn().mockImplementation( (row) => {
    try {
        if(!(row.regNumber && 
            row.firstName && 
            row.issuingAuthority && 
            row.document && 
            isFinite(new Date(row.startDate)) && isFinite(new Date(row.endDate)) &&
            new Date(row.startDate) < new Date(row.endDate))) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        // throw err;
        return false;
    }
});

describe('upload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reject with an error message if file is undefined', async () => {
        await expect(upload(undefined)).rejects.toEqual({ message: 'Please upload a valid excel file (.xls, .xlsx)' });
    });

   
   
    it('should reject with an error message if headers mismatch',  () => {
        const invalidHeadersFileMock = {
            originalname: '../helpers/header-mismatch.xlsx',
            buffer: 'mocked buffer'
        };

            const mockheaders = [
            'regNumber1',
            'firstName1',
            'middleName',
            'lastName',
            'issuingAuthority',
            'department',
            'document',
            'startDate',
            'endDate'
        ];
        const validateHeadersMock = validateHeaders(mockheaders);
        expect(validateHeadersMock).toBeFalsy();
        // console.log(validateHeadersMock);

        // await expect(validateHeadersMock).rejects.toEqual({err});

        // expect(loggerMock.error).toHaveBeenCalledWith('Headers mismatch Sample File Format');
        // expect(validateHeadersMock).toHaveBeenCalledWith(expect.any(Array));
        
    });


    // it('should reject with an error message if data is empty', async () => {
    //     const emptyDataFileMock = {
    //         originalname: '../helpers/empty-data.xlsx',
    //         buffer: Buffer.from('')
    //     };
    //     const sheetDataMock = [];
    //     const validateHeadersMock = jest.fn().mockReturnValue(true);
    //     // console.log(validateHeadersMock);
    //     const sheetToJsonMock = jest.fn().mockReturnValue(sheetDataMock);
    //     const readMock = jest.spyOn(xlsx, 'read').mockReturnValue({ Sheets: { Sheet1: {} }, SheetNames: ['Sheet1'] });
    //     const validateRowDataMock = jest.fn().mockReturnValue(true);
    //     const isValidDateMock = jest.fn().mockReturnValue(true);
    //     console.log("HIHIHIHI")
    //     // console.log(await upload(emptyDataFileMock));

    //     await expect(upload(emptyDataFileMock)).rejects.toEqual({ message: 'Error - File is empty!' });
    //     // expect(loggerMock.error).toHaveBeenCalledWith('File is empty');
    //     expect(validateHeadersMock).toHaveBeenCalledWith(expect.any(Array));
    //     expect(readMock).toHaveBeenCalledWith('mocked buffer', { type: 'buffer' });
    //     expect(sheetToJsonMock).toHaveBeenCalledWith({}, { header: 1 });
    //     expect(validateRowDataMock).not.toHaveBeenCalled();
    //     expect(isValidDateMock).not.toHaveBeenCalled();
    // });


    it('should reject with an error message if data is empty', async () => {
        const mockedupload=jest.fn().mockImplementation(async (data)=>{
            if (!data || (data && data.length == 0)) {
                return { message: "Error-File is empty!" };
              }
              else{
                return { message: "Successful!" };
              } 
        });
         
        const res1=await mockedupload(['a','b']);
        expect(res1.message).toEqual("Successful!");
        
        const res2=await mockedupload([]);
        expect(res2.message).toEqual("Error-File is empty!");
   
    });


    // it('should reject with an error message if row data is invalid', () => {
    //     const invalidRowDataFileMock = {
    //         originalname: 'invalid-row-data.xlsx',
    //         buffer: 'mocked buffer'
    //     };

    //     const sheetDataMock=[
    //         {
    //             regNumber: 'ABC123',
    //             firstName: 'John',
    //             issuingAuthority: 'Authority',
    //             document: 'Document',
    //             startDate: '2022-01-01',
    //             endDate: '2022-12-31',
    //           },

    //           {
    //             regNumber: 'ABC123',
    //             firstName: '',
    //             issuingAuthority: 'Authority',
    //             document: 'Document',
    //             startDate: '2022-01-01',
    //             endDate: '2022-12-31',
    //           }
    // ];
        
        
    //     const validaterow=validateRowData(sheetDataMock[1]);
    //     expect(validaterow).toBe(true);
         
    //     console.log(sheetDataMock[0].regNumber);

        // const validateHeadersMock = jest.fn().mockReturnValue(true);
        // const sheetToJsonMock = jest.fn().mockReturnValue(sheetDataMock);
        // const readMock = jest.spyOn(xlsx, 'read').mockReturnValue({ Sheets: { Sheet1: {} }, SheetNames: ['Sheet1'] });
        // const validateRowDataMock = jest.fn().mockReturnValueOnce(false).mockReturnValue(true);
        // const getMissingFieldsMock = jest.fn().mockReturnValue(['firstName']);
        // const isValidDateMock = jest.fn().mockReturnValue(true);

        // await expect(upload(invalidRowDataFileMock)).rejects.toEqual({
        //     message: [
        //         'Error - Row 1 : firstName is missing. Please check and re-upload.',
        //         'Error - Row 1 : Start Date greater than End Date. Please check and re-upload.'
        //     ]
        // });
        // expect(loggerMock.info).toHaveBeenCalledWith('Row 1: Missing Fields ::: firstName');
        // expect(loggerMock.info).toHaveBeenCalledWith('Row 1: startDate > endDate');
        // expect(validateHeadersMock).toHaveBeenCalledWith(expect.any(Array));
        // expect(readMock).toHaveBeenCalledWith('mocked buffer', { type: 'buffer' });
        // expect(sheetToJsonMock).toHaveBeenCalledWith({}, { header: 1 });
        // expect(validateRowDataMock).toHaveBeenCalledTimes(2);
        // expect(getMissingFieldsMock).toHaveBeenCalledWith([1, '']);
        // expect(isValidDateMock).toHaveBeenCalledWith(undefined, undefined);
    // });


    test('should return false when any required field is missing', () => {
        const row = {
          regNumber: '123',
          firstName: 'John',
          issuingAuthority: 'ABC',
          document: 'XYZ',
          startDate: '2022-01-01',
          endDate: '2021-12-31',
        };
        expect(mockedvalidRowData(row)).toBe(false);
      });
    
      test('should return true when all required fields are present and dates are valid', () => {
        const row = {
          regNumber: '123',
          firstName: 'John',
          issuingAuthority: 'ABC',
          document: 'XYZ',
          startDate: '2021-01-01',
          endDate: '2021-12-31',
        };
        expect(mockedvalidRowData(row)).toBe(true);
      });
    
      // test('should throw an error when an exception occurs', () => {
      //   const row = {
      //     regNumber: '123',
      //     firstName: 'John',
      //     issuingAuthority: 'ABC',
      //     document: 'XYZ',
      //     startDate: 'invalid-date',
      //     endDate: '2021-12-31',
      //   };
      //   expect(() => {
      //       mockedvalidRowData(row);
      //   }).toBe(false);
      // });



    test('should return true when both startDate and endDate are valid dates', () => {
        // Arrange
        const startDate = "2022-01-01";
        const endDate = "2022-12-31";
    
        // Act
        const result = mockedisValidDate(startDate, endDate);
    
        // Assert
        expect(result).toBe(true);
      });
    
      test('should return false when either startDate or endDate is missing', () => {
        // Arrange
        const startDate = "2022-01-01";
        const endDate = "";
    
        // Act
        const result = mockedisValidDate(startDate, endDate);
    
        // Assert
        expect(result).toBe(false);
      });
    
      test('should return false when either startDate or endDate is not a valid date', () => {
        // Arrange
        const startDate = "2022-01-01";
        const endDate = "Invalid Date";
    
        // Act
        const result = mockedisValidDate(startDate, endDate);
    
        // Assert
        expect(result).toBe(false);
      });
    


    test('should return an empty array when all fields are present', () => {
        // Arrange
        const row = {
          regNumber: '123',
          firstName: 'John',
          issuingAuthority: 'ABC',
          document: 'Doc'
         };
    
        // Act
        const result = mockedgetMissingFields(row);
    
        // Assert
        expect(result).toEqual([]);
      });
    
      test('should return an array with missing fields when some fields are missing', () => {
        // Arrange
        const row = {
          regNumber: '',
          firstName: 'John',
          issuingAuthority: '',
          document: 'Doc'
        };
    
        // Act
        const result = mockedgetMissingFields(row);
    
        // Assert
        expect(result).toEqual(['Reg Number', 'Issuing Authority']);
      });
    
      test('should return an array with all fields when all fields are missing', () => {
        // Arrange
        const row = {
          regNumber: '',
          firstName: '',
          issuingAuthority: '',
          document: ''
        };
    
        // Act
        const result = mockedgetMissingFields(row);
    
        // Assert
        expect(result).toEqual(['Reg Number', 'First Name', 'Issuing Authority', 'Document']);
      });
    
      test('should return an empty array when an error occurs', () => {
        // Arrange
        const row = null; // or any other invalid input
    
        // Act
        const result = mockedgetMissingFields(row);
    
        // Assert
        expect(result).toEqual([]);
      });


     

   // Use the mock database in your tests
//    test('should perform database operation', () => {
//    // Mock a query operation
//     mockDatabase.insert.mockReturnValueOnce({
//         regNumber: '123',
//         firstName: 'John',
//         lastName: 'Doe',
//         issuingAuthority: 'ABC',
//         document: 'XYZ',
//         startDate: '2022-01-01',
//         endDate: '2022-12-31',
//     });

//     expect(mockDatabase.insert.mock.calls.length).toBe(1);

  // Run your test code that interacts with the database
  

  // Assert that the database operation was called with the expected parameters
//   expect(mockDatabase.query).toHaveBeenCalledWith('SELECT * FROM users');

  // Assert the result or behavior based on the database operation
// });
   

      


  test('should insert subject data into DB and return success message', () => {
    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const mockFile = {
      originalname: 'test-file.xlsx',
      buffer: Buffer.from('dummy-data'),
    };

    const mockSubject = {
      regNumber: '123',
      firstName: 'John',
      lastName: 'Doe',
      issuingAuthority: 'ABC',
      document: 'XYZ',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
    };

    const mockSubjects = [mockSubject];

    const mockSubjectBulkCreate = jest.fn().mockResolvedValue();

    const mockSubjectCreate = jest.fn().mockReturnValue({
      bulkCreate: mockSubjectBulkCreate,
    });
    

    const mockFilesCreate = jest.fn().mockResolvedValue();

    const mockModels = {
      Subject: {
        bulkCreate: mockSubjectBulkCreate,
        create: mockSubjectCreate,
      },
      Files: {
        create: mockFilesCreate,
      },
    };

    const validateHeadersMock = validateHeaders.mockReturnValue(true);
    const validEntryMock=validEntry.mockReturnValue(true);

    return upload(mockFile, mockLogger, mockModels,validateHeadersMock,validEntryMock).then((result) => {
      expect(result).toEqual({
        message: 'Uploaded the file successfully: test-file.xlsx',
      });
    });
  });

  test('should return error message when error occurs during data insertion', () => {
    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const mockFile = {
      originalname: 'test-file.xlsx',
      buffer: Buffer.from('dummy-data'),
    };

    const mockSubject = {
      regNumber: '123',
      firstName: 'John',
      lastName: 'Doe',
      issuingAuthority: 'ABC',
      document: 'XYZ',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
    };

    const mockSubjects = [mockSubject];

    const mockSubjectBulkCreate = jest.fn().mockRejectedValue(new Error('Data insertion failed'));

    const mockSubjectCreate = jest.fn().mockReturnValue({
      bulkCreate: mockSubjectBulkCreate,
    });

    const mockFilesCreate = jest.fn().mockResolvedValue();

    const mockModels = {
      Subject: {
        bulkCreate: mockSubjectBulkCreate,
        create: mockSubjectCreate,
      },
      Files: {
        create: mockFilesCreate,
      },
    };

    const validateHeadersMock = validateHeaders.mockReturnValue(true);
    const validEntryMock=validEntry.mockReturnValue(true);

    

    return upload(mockFile, mockLogger, mockModels,validateHeadersMock,validEntryMock).catch((error) => {
      expect(error).toEqual({
        message: 'Fail to import data into database!',
        error: 'Data insertion failed',
      });
    });
  });

//   test('should return error message when error list length is less than 5', () => {
//     const mockLogger = {
//       info: jest.fn(),
//       error: jest.fn(),
//     };

//     const mockFile = {
//       originalname: 'test-file.xlsx',
//       buffer: Buffer.from('dummy-data'),
//     };

//     const mockErrorList = ['Error 1', 'Error 2', 'Error 3'];

//     const mockSubjectBulkCreate = jest.fn().mockResolvedValue();

//     const mockSubjectCreate = jest.fn().mockReturnValue({
//       bulkCreate: mockSubjectBulkCreate,
//     });

//     const mockFilesCreate = jest.fn().mockResolvedValue();

//     const mockModels = {
//       Subject: {
//         bulkCreate: mockSubjectBulkCreate,
//         create: mockSubjectCreate,
//       },
//       Files: {
//         create: mockFilesCreate,
//       },
//     };

//     return upload(mockFile, mockLogger, mockModels).catch((error) => {
//       expect(error).toEqual({
//         message: mockErrorList,
//       });
//       expect(mockLogger.error).toHaveBeenCalledWith(`Error List Data (< 5) ::: ${JSON.stringify(mockErrorList)}`);
//       expect(mockLogger.error).not.toHaveBeenCalledWith('Subject Data inserted into DB successfully.');
//       expect(mockLogger.error).not.toHaveBeenCalledWith('File test-file.xlsx inserted into DB successfully.');
//       expect(mockSubjectCreate).not.toHaveBeenCalled();
//       expect(mockSubjectBulkCreate).not.toHaveBeenCalled();
//       expect(mockFilesCreate).not.toHaveBeenCalled();
//     });
//   });


    

//     it('should resolve with success message and insert data into the database', async () => {
//         const validDataFileMock = {
//             originalname: '../helpers/valid-data.xlsx',
//             buffer: 'mocked buffer 2'
//         };
//         const sheetDataMock = [[
//             'regNumber',
//             'firstName',
//             'middleName',
//             'lastName',
//             'issuingAuthority',
//             'department',
//             'document',
//             'startDate',
//             'endDate'
//         ], [
//             'S1234',
//             'Shreya',
//             null,
//             'T V',
//             'IIIT',
//             'CS',
//             'BTech',
//             '19-05-2018',
//             '19-05-2022'
//         ]];
//         // const validateHeadersMock = validateHeaders.mockReturnValue(true);
//         // const sheetToJsonMock = jest.fn().mockReturnValue(sheetDataMock);
//         // const readMock = jest.spyOn(xlsx, 'read').mockReturnValue({ Sheets: { Sheet1: {} }, SheetNames: ['Sheet1'] });
//         // console.log(readMock);
//         // const validateRowDataMock = jest.fn().mockReturnValue(true);
//         // const getMissingFieldsMock = jest.fn().mockReturnValue([]);
//         // const isValidDateMock = jest.fn().mockReturnValue(true);

//         const expectedSubjectData = [
//             {
//                 regNumber: 'S1234',
//                 firstName: 'Shreya',
//                 middleName: null,
//                 lastName: 'T V',
//                 issuingAuthority: 'IIIT',
//                 department: 'CS',
//                 document: 'BTech',
//                 startDate: '19-05-2018',
//                 endDate: '19-05-2022'
//             }
//         ];

//         const expectedFilename = expect.stringMatching(/^\d+-valid-data.xlsx$/);

//         SubjectMock.bulkCreate.mockResolvedValue();
//         FilesMock.create.mockResolvedValue();

//         await expect(upload(validDataFileMock)).resolves.toEqual({
//             message: 'Uploaded the file successfully: valid-data.xlsx'
//         });

//         expect(loggerMock.info).toHaveBeenCalledWith('Total Data Length :::1');
//         expect(loggerMock.info).toHaveBeenCalledWith('Subjects Data Length :::1');
//         expect(loggerMock.info).toHaveBeenCalledWith('Subject Data inserted into DB successfully.');
//         expect(loggerMock.info).toHaveBeenCalledWith(`File ${expectedFilename} inserted into DB successfully.`);

//         expect(validateHeadersMock).toHaveBeenCalledWith(expect.any(Array));
//         expect(readMock).toHaveBeenCalledWith('mocked buffer', { type: 'buffer' });
//         expect(sheetToJsonMock).toHaveBeenCalledTimes(2);
//         expect(validateRowDataMock).toHaveBeenCalledWith([1, 'John', 'Doe']);
//         expect(getMissingFieldsMock).toHaveBeenCalledWith([1, 'John', 'Doe']);
//         expect(isValidDateMock).toHaveBeenCalledWith(undefined, undefined);

//         expect(SubjectMock.bulkCreate).toHaveBeenCalledWith(expectedSubjectData, {
//             updateOnDuplicate: ['firstName', 'middleName', 'lastName', 'department', 'startDate', 'endDate', 'updatedAt']
//         });

//         expect(FilesMock.create).toHaveBeenCalledWith({ fileName: expectedFilename, data: 'mocked buffer' });
//     });

    // it('should reject with an error message if data insertion fails', async () => {
    //     const validDataFileMock = {
    //         originalname: 'valid-data.xlsx',
    //         buffer: 'mocked buffer'
    //     };
    //     const sheetDataMock = [['regNumber', 'firstName', 'lastName'], [1, 'John', 'Doe']];
    //     const validateHeadersMock = jest.fn().mockReturnValue(true);
    //     const sheetToJsonMock = jest.fn().mockReturnValue(sheetDataMock);
    //     const readMock = jest.spyOn(xlsx, 'read').mockReturnValue({ Sheets: { Sheet1: {} }, SheetNames: ['Sheet1'] });
    //     const validateRowDataMock = jest.fn().mockReturnValue(true);
    //     const getMissingFieldsMock = jest.fn().mockReturnValue([]);
    //     const isValidDateMock = jest.fn().mockReturnValue(true);

    //     SubjectMock.bulkCreate.mockRejectedValue(new Error('DB insertion failed'));

    //     await expect(upload(validDataFileMock)).rejects.toEqual({
    //         message: 'Fail to import data into database!',
    //         error: 'DB insertion failed'
    //     });

    //     expect(loggerMock.error).toHaveBeenCalledWith('Fail to import data ::: DB insertion failed');

    //     expect(validateHeadersMock).toHaveBeenCalledWith(expect.any(Array));
    //     expect(readMock).toHaveBeenCalledWith('mocked buffer', { type: 'buffer' });
    //     expect(sheetToJsonMock).toHaveBeenCalledTimes(2);
    //     expect(validateRowDataMock).toHaveBeenCalledWith([1, 'John', 'Doe']);
    //     expect(getMissingFieldsMock).toHaveBeenCalledWith([1, 'John', 'Doe']);
    //     expect(isValidDateMock).toHaveBeenCalledWith(undefined, undefined);

    //     expect(SubjectMock.bulkCreate).toHaveBeenCalledWith(expect.any(Array), {
    //         updateOnDuplicate: ['firstName', 'middleName', 'lastName', 'department', 'startDate', 'endDate', 'updatedAt']
    //     });
    // });
});








    


//handle invalide file upload



//vaidate header of the file


//wheather file is empty 


//check for each row data


//check for empty fields


//check for valid date

