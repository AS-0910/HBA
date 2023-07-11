const {helperFunc,helperFuncGet} = require('../app/controllerHelper/excelhelper.controller');
const ExcelServices = require('../app/services/excel.service');
const { sendResponse } = require('../app/helpers/util.helper');
const { logger } = require('../app/config/logger/logger');

jest.mock('../app/services/excel.service', () => ({
  upload: jest.fn(),
}));

jest.mock('../app/helpers/util.helper', () => ({
  sendResponse: jest.fn(),
}));

jest.mock('../app/config/logger/logger', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('helperFunc', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      method: 'POST',
      originalUrl: '/upload',
      file: { 
        originalname: 'test.xlsx',
        filename: 'test.xlsx',
       },
    };
    res = {
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload file successfully', async () => {
    const files = [{
        originalname: 'test.xlsx',
        filename: 'test.xlsx',
      }];

    ExcelServices.upload.mockResolvedValueOnce(files);

    await helperFunc(req, res);

    expect(logger.info).toHaveBeenCalledWith(`Request: ${req.method} ${req.originalUrl}`);
    expect(ExcelServices.upload).toHaveBeenCalledWith(req.file);
    expect(sendResponse).toHaveBeenCalledWith(res, 'Uploaded Successfully !!', files);
  });

  it('should handle file upload error', async () => {
    const errorMessage = 'File upload failed';

    ExcelServices.upload.mockRejectedValueOnce(new Error(errorMessage));

    await helperFunc(req, res);

    expect(logger.info).toHaveBeenCalledWith(`Request: ${req.method} ${req.originalUrl}`);
    expect(ExcelServices.upload).toHaveBeenCalledWith(req.file);
    // expect(sendResponse).toHaveBeenCalledWith(res, errorMessage, null, {status:404,message:"error"});
  });
});
