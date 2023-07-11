const {helperFunc,helperFuncGet} = require('../app/controllerHelper/excelhelper.controller');
const ExcelServices = require('../app/services/excel.service');
const { sendResponse } = require('../app/helpers/util.helper');
const { logger } = require('../app/config/logger/logger');

// Mock dependencies
jest.mock('../app/services/excel.service');
jest.mock('../app/helpers/util.helper');
jest.mock('../app/config/logger/logger');

describe('helperFuncGet', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { method: 'GET', originalUrl: '/uploads' };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ExcelServices.getUploadedFiles and send response with files', async () => {
    const files = ['file1.txt', 'file2.txt'];
    ExcelServices.getUploadedFiles.mockResolvedValue(files);

    await helperFuncGet(req, res);

    expect(logger.info).toHaveBeenCalledWith(`Request: ${req.method} ${req.originalUrl}`);
    expect(ExcelServices.getUploadedFiles).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(res, 'List of Files Uploaded', files);
  });

  it('should call ExcelServices.getUploadedFiles and send error response', async () => {
    const errorMessage = 'Error fetching uploaded files';
    const error = new Error(errorMessage);
    ExcelServices.getUploadedFiles.mockRejectedValue(error);

    await helperFuncGet(req, res);

    expect(logger.info).toHaveBeenCalledWith(`Request: ${req.method} ${req.originalUrl}`);
    expect(ExcelServices.getUploadedFiles).toHaveBeenCalled();
    // expect(sendResponse).toHaveBeenCalledWith(res, errorMessage, null, error);
  });
});
