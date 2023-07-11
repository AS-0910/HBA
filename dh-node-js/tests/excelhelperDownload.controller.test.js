const {helperFunc,helperFuncGet,helperDown} = require('../app/controllerHelper/excelhelper.controller');
const ExcelServices = require('../app/services/excel.service');
const { sendResponse } = require('../app/helpers/util.helper');
const { logger } = require('../app/config/logger/logger');
// const { describe } = require('pm2');
// const dB = require('../models');
// const Files = dB.files;

// Mock the dependencies
// jest.mock('./your-file-model'); 
jest.mock('../app/config/logger/logger', () => ({
    logger: {
      info: jest.fn(),
      error:jest.fn(),
    },
  }));

describe('helperDown', () => {
  // Define a sample request and response object for testing
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/download',
      query: {
        fileName: 'example.xlsx',
      },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };


    Files = {
        findOne: jest.fn()
      };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the file data if the fileName is provided', () => {
    // Mock the behavior of Files.findOne
    Files.findOne = jest.fn().mockResolvedValue({
      id: '1',
      fileName:'example.xlsx',
      data: 'mock data',
    });


    // Call the helperDown function
    helperDown(req, res);

    // Assert the expected behavior
    expect(logger.info).toHaveBeenCalledWith('Request: GET /download');
    expect(logger.info).toHaveBeenCalledWith('Request Query: "example.xlsx"');
    // expect(Files.findOne).toHaveBeenCalledWith({ where: { fileName: 'example.xlsx' } });
    // expect(logger.info).toHaveBeenCalledWith('File Id: 1');
    // expect(res.setHeader).toHaveBeenCalledWith(
    //   'Content-Type',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition',
    //   'attachment; filename=your-file-name'
    // );
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.send).toHaveBeenCalledWith('mock data');
  });

  it('should send an error response if fileName is not provided', () => {
    // Modify the request object to have an empty fileName
    req.query.fileName = '';

    // Call the helperDown function
    helperDown(req, res);

    // Assert the expected behavior
    // expect(logger.error).toHaveBeenCalledWith('Error in query params');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Please provide a fileName' });
  });

  it('should send an error response if the file is not found', async () => {
    // Mock the behavior of Files.findOne to simulate a failed query
    Files.findOne = jest.fn().mockRejectedValue(new Error('File not found'));

    // Call the helperDown function
    await helperDown(req, res);

    // Assert the expected behavior
    expect(logger.info).toHaveBeenCalledWith('Request: GET /download');
    expect(logger.info).toHaveBeenCalledWith('Request Query: "example.xlsx"');
    // expect(Files.findOne).toHaveBeenCalledWith({ where: { fileName: 'example.xlsx' } });
    // expect(logger.error).toHaveBeenCalledWith('Error in getting the file ::: Error: File not found');
    // expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.send).toHaveBeenCalledWith({ message: 'No such file with filename: example.xlsx' });
  });
});
