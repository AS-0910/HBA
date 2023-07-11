// const request = require('supertest');
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { sendResponse } = require('../helpers/util.helper');
// const ExcelServices = require('../services/excel.service');
// const router = require('../controllers/excel.controller');

// // Mock the dependencies
// jest.mock('multer');
// jest.mock('../helpers/util.helper');
// jest.mock('../services/excel.service');


// // Create a mock middleware function
// const mockMiddleware = jest.fn((req, res, next) => {
//   // Perform any necessary mock behavior
//   if (req.file) {
//     // Mock the behavior for when a file is accepted
//     const acceptedFile = {
//       mimetype: 'application/vnd.ms-excel',
//     };
//     excelFilter(req, acceptedFile, (error, result) => {
//       if (error) {
//         throw error;
//       }
//       req.fileIsValid = result;
//       next();
//     });
//   } else {
//     // Mock the behavior for when no file is present
//     req.fileIsValid = false;
//     next();
//   }
// });

// // Create a mock excelFilter function
// const excelFilter = (req, file, cb) => {
//   if (
//     file.mimetype.includes("excel") ||
//     file.mimetype.includes("spreadsheetml")
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// // Assign the mock middleware to the uploadFile variable
// var uploadFile = mockMiddleware;


// describe('File Upload API', () => {
//   let app;

//   beforeEach(() => {
//     app = express();
//     app.use(express.json());
//     app.use('/', router);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should upload a file successfully', async () => {
    // const mockUploadedFile = {
    //   originalname: 'test.xlsx',
    //   filename: 'test.xlsx',
    //   path: path.resolve(__dirname, 'test.xlsx')
    // };

//     const mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     const mockReq = {
//       method: 'POST',
//       originalUrl: '/upload',
//       file: mockUploadedFile
//     };

//     // Mock the ExcelServices.upload() to return a resolved promise
//     ExcelServices.upload.mockResolvedValueOnce(['file1.xlsx', 'file2.xlsx']);

//     // Mock the sendResponse() helper function
//     sendResponse.mockImplementationOnce((res, message, data) => {
//       res.status(200).json({ message, data });
//     });

//     await request(app)
//       .post('/upload')
//       .attach('file', 'test.xlsx')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body).toEqual({ message: 'Uploaded Successfully !!', data: ['file1.xlsx', 'file2.xlsx'] });
//         expect(ExcelServices.uploadFile).toHaveBeenCalledWith(mockUploadedFile);
//         expect(sendResponse).toHaveBeenCalledWith(mockResponse, 'Uploaded Successfully !!', ['file1.xlsx', 'file2.xlsx']);
//       });
//   });

//   // it('should handle file upload failure', async () => {
//   //   const mockError = new Error('File upload failed');

//   //   const mockResponse = {
//   //     status: jest.fn().mockReturnThis(),
//   //     json: jest.fn()
//   //   };

//   //   const mockReq = {
//   //     method: 'POST',
//   //     originalUrl: '/upload',
//   //     file: null
//   //   };

//   //   // Mock the ExcelServices.upload() to return a rejected promise
//   //   ExcelServices.upload.mockRejectedValueOnce(mockError);

//   //   // Mock the sendResponse() helper function
//   //   sendResponse.mockImplementationOnce((res, message, data, err) => {
//   //     res.status(500).json({ message, data, error: err });
//   //   });

//   //   await request(app)
//   //     .post('/upload')
//   //     .expect(500)
//   //     .expect('Content-Type', /json/)
//   //     .then((response) => {
//   //       expect(response.body).toEqual({ message: 'File upload failed', data: null, error: mockError });
//   //       expect(ExcelServices.upload).toHaveBeenCalledWith(null);
//   //       expect(sendResponse).toHaveBeenCalledWith(mockResponse, 'File upload failed', null, mockError);
//   //     });
//   // });
// });






















// // const request = require('supertest');
// // const express = require('express');
// // const router = require('../controllers/excel.controller'); // Assuming this is the file containing the code you provided

// // // Mock the required modules and functions
// // jest.mock('../services/excel.service');
// // jest.mock('../middlewares/upload');
// // jest.mock('../middlewares/responseHandler');
// // jest.mock('../helpers/util.helper');
// // jest.mock('../middlewares/auth');
// // jest.mock('../config/logger/logger');

// // // Create an Express app and use the router
// // const app = express();
// // app.use('/', router);

// // // describe('File Upload Route', () => {
//   // it('should upload a file successfully', async () => {
//   //   const mockReq = {
//   //     method: 'POST',
//   //     originalUrl: '/upload',
//   //     file: {fileName: 'file1.txt', createdAt: new Date()},
//   //   };

//   //   const mockRes = {
//   //     sendStatus: jest.fn(),
//   //   };

//   //   const uploadMock = jest.fn().mockResolvedValue('mocked file data');
//   //   router.ExcelServices.upload = uploadMock;

//   //   await request(app)
//   //     .post('/upload')
//   //     .set('Authorization', 'Bearer YOUR_AUTH_TOKEN')
//   //     .attach('file', 'path/to/your/file.xlsx')
//   //     .expect(200)
//   //     .end((err, res) => {
//   //       expect(uploadMock).toHaveBeenCalledWith(mockReq.file);
//   //       expect(res.body.message).toBe('Uploaded Successfully !!');
//   //       expect(res.body.data).toBe('mocked file data');
        
//   //     });
// // //   });
// // // });


// // // Mock the ExcelServices module
// // jest.mock('../services/excel.service', () => ({
// //   getUploadedFiles: jest.fn().mockResolvedValue(['file1.xlsx', 'file2.xlsx']),
// // }));

// // describe('GET /getUploadedFiles', () => {
// //   it('should return a list of uploaded files', async () => {
// //     // Make a GET request to the route
// //     const response = await request(app).get('/getUploadedFiles');

// //     // Assertions
// //     expect(response.status).toBe(200);
// //     expect(response.body.message).toBe('List of Files Uploaded');
// //     expect(response.body.data).toEqual(['file1.xlsx', 'file2.xlsx']);
// //   });

// // //   it('should handle errors and return an error response', async () => {
// // //     // Mock the ExcelServices module to throw an error
// // //     jest.mock('path/to/ExcelServices', () => ({
// // //       getUploadedFiles: jest.fn().mockRejectedValue(new Error('Error fetching files')),
// // //     }));

// // //     // Make a GET request to the route
// // //     const response = await request(app).get('/getUploadedFiles');

// // //     // Assertions
// // //     expect(response.status).toBe(500);
// // //     expect(response.body.message).toBe('Error fetching files');
// // //     expect(response.body.data).toBeNull();
// // //     expect(response.body.error).toBeDefined();
// // //   });
// // });



// // const httpMocks = require('node-mocks-http');
// // const { describe, it, expect, afterAll } = require('@jest/globals');
// // const { mockFilesArray } = require("../mocks/excel.mock.js");

// // jest.mock('../../app/services/excel.service.js');

// // const excelService = require('../../app/services/excel.service.js');
// // const excelController = require('../../app/controllers/excel.controller.js');

// // const mockGetUploadedFiles = jest.spyOn(excelService, 'getUploadedFiles')

// // describe('excel controller - unit tests', () => {
// //     it('should get uploaded files list', async () => {
// //         // mock
// //         const response = httpMocks.createResponse();
// //         const request = httpMocks.createRequest();
// //         const mockFilesList = jest.fn(async () => {
// //             return mockFilesArray;
// //         });
// //         mockGetUploadedFiles.mockImplementation(mockFilesList);
// //         await excelController.getUploadedFilesController(request, response);
// //         expect(mockGetUploadedFiles).toHaveBeenCalledTimes(1);
// //         var res = []
// //         response._getJSONData().data.map(obj => {
// //             // console.log("@@@@ : ", obj.hasOwnProperty('fileName'));
// //             res.push(['fileName', 'createdAt'].every(key => obj.hasOwnProperty(key)));
// //         })
// //         // console.log(res)
// //         expect(response.statusCode).toEqual(200);
// //         expect(response._isEndCalled()).toBeTruthy();
// //         expect(response._getJSONData()).toEqual({ status: 1, message: 'List of Files Uploaded', data: mockFilesArray });
// //         expect(res).toEqual(new Array(response._getJSONData().data.length).fill(true));
// //     });

// //     it('error in getting uploaded files', async () => {
// //         const response = httpMocks.createResponse();
// //         const request = httpMocks.createRequest();
// //         // await excelController.getUploadedFilesController(request, response);
// //         // console.log(response._getJSONData());
// //         // expect()
// //         expect(() => excelController.getUploadedFilesController(null, response)).toThrow({ error: new Error("Some error occurred while retrieving files.") });
// //     })
// // });

// // afterAll(() => {
// //     jest.clearAllMocks();
// // });

// // const httpMocks = require('node-mocks-http');
// // const { getUploadedFilesController } = require('../controllers/excel.controller');
// // const ExcelServices = require('../services/excel.service');
// // const { sendResponse } = require('../helpers/util.helper');

// // // Mock dependencies
// // jest.mock('../../app/services/excel.service');
// // jest.mock('../../app/helpers/util.helper');

// // describe('getUploadedFilesController', () => {
// //     let req, res;

// //     beforeEach(() => {
// //         // res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        // res = jest.fn();
        // req = httpMocks.createRequest();
// //         console.log("Request: ", req);
// //         console.log("Response: ", res);
// //     });

// //     afterEach(() => {
// //         jest.clearAllMocks();
// //     });

// //     test('should call ExcelServices.getUploadedFiles and send response with files', async () => {

// //         const files = ['file1.xlsx', 'file2.xlsx'];
// //         ExcelServices.getUploadedFiles.mockResolvedValueOnce(files);

// //         // console.log(getUploadedFilesController(req, res))
// //         // mockGetUploadedFiles.mockImplementation(files);

// //         await getUploadedFilesController(req, res);
// //         expect(ExcelServices.getUploadedFiles).toHaveBeenCalledTimes(1);
// //         console.log(sendResponse == res);
// //         expect(sendResponse).toHaveBeenCalledWith(res, 'List of Files Uploaded', files);

// //     });

// //     test('should call ExcelServices.getUploadedFiles and send error response', () => {

// //         const error = new Error('Failed to fetch uploaded files');
// //         ExcelServices.getUploadedFiles.mockRejectedValueOnce(error);

// //         expect.assertions(3); // Expecting 3 assertions within the test case

// //         getUploadedFilesController(req, res).catch((err) => {
// //             expect(err.message).toBe(error.message);
// //         });

// //         expect(ExcelServices.getUploadedFiles).toHaveBeenCalledTimes(1);
// //         expect(sendResponse).toHaveBeenCalledWith(res, error.message, null, error);
// //     });
// // });

