const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require('moment');

const dB = require('../models');
const { getNextChar } = require("../helpers/util.helper");
const Subject = dB.subjects;
const Request = dB.requests;

const verify = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      var status;
      var statusMessage;
      var request = [];
      arr = JSON.parse(JSON.stringify(body));

      var reqId = await getRequestIDFromDB();
      for (let ind = 0; ind < arr.length; ind++) {
        let index = arr[ind];

        var firstName = index.firstName;
        var lastName = index.lastName;
        var issuingAuthority = index.issuingAuthority;
        var document = index.document;
        var startDate = index.startDate;
        var endDate = index.endDate;

        const found = await Subject.findOne({
          where: {
            [Op.and]:
              [{ firstName: firstName }, { lastName: lastName }, { issuingAuthority: issuingAuthority },
              Sequelize.where(Sequelize.fn('date', Sequelize.col('startDate')), '=', startDate),
              { document: document },
              Sequelize.where(Sequelize.fn('date', Sequelize.col('endDate')), '=', endDate)]
          }
        })
        if (found != null) {
          status = 1;
          statusMessage = "Verified";
        } else {
          status = 0;
          statusMessage = "Not Verified";
        }
        let req = {
          requestID: reqId,
          subjectName: firstName,
          status: status,
          statusMessage: statusMessage,
        };
        request.push(req);
        reqId = await getNextRequestID(reqId);
      }
      Request.bulkCreate(request).then(() => {
        return resolve({
          message: "Inserted the request..",
          data: request,
        });
      })
    } catch (error) {
      console.log(error);
      return reject({
        message: "Could not verify the subject... ",
      });
    }
  })
}


// Return the next request id 

const getNextRequestID = (reqId) => {

  try {
    let veriflowId = process.env.VERIFLOW_ID;
    let strLength = reqId && reqId.length;
    let digits = parseInt(reqId.slice(strLength - 4));
    let chars = reqId.slice(strLength - 6, strLength - 4);
    console.log(digits, chars);
    if (digits && digits < 9999) {
      digits += 1;
    } else {
      digits = '0001';
      let ch1 = '';
      let ch2 = '';
      if (chars && chars[1] < 'Z' && chars[1] >= 'A') {
        ch1 = chars[0];
        ch2 = getNextChar(chars[1]);
      } else if (chars && chars[1] == 'Z') {
        ch2 = 'A';
        ch1 = getNextChar(chars[0]);
      }
      if (ch1 >= 'A' && ch1 <= 'Z' && ch2 >= 'A' && ch2 <= 'Z') {
        chars = ch1 + ch2;
      } else {
        return reject("RequestID limit reached!")
      }
    }
    digits = "0".repeat(4 - digits.toString().length) + digits;
    reqId = veriflowId + chars + digits;
    return reqId;
  } catch (err) {
    console.log(err);
  }
}


//Return the reqId from the database which is the latest

const getRequestIDFromDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let veriflowId = process.env.VERIFLOW_ID;
      let requestId = '';
      const request = await Request.findOne({
        order: [['requestID', 'DESC']]
      })
      if (!request) {
        requestId = requestId + veriflowId + 'AA0001';
      } else {
        requestId = request.requestID;
        // requestId = 'DU100AA0016'
        requestId = getNextRequestID(requestId)
      }
      resolve(requestId);

    } catch (err) {
      reject(err)
    }
  })
}

const getAllRequests = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let page = parseInt(params && params["page"]) || 1,
        limit = parseInt(params && params["limit"]) || 10,
        offset = (page - 1) * limit || 0, requests;

      let condition = {};
      if (params && params["status"]) {
        let status = params["status"];
        Object.assign(condition, { status: status });
      }
      if (params && params["lastWeek"]) {
        Object.assign(condition, { createdAt: { [Op.gte]: moment().subtract(7, 'days').toDate() } });
      }
      if (params && params["lastMonth"]) {
        Object.assign(condition, { createdAt: { [Op.gte]: moment().subtract(30, 'days').toDate() } });
      }
      if (params && params["startDate"] && params["endDate"]) {
        let startDate = params["startDate"];
        let endDate = params["endDate"];
        Object.assign(condition, {
          createdAt: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          }
        });
      }
      requests = await Request.findAll({
        where: { [Op.and]: condition },
        "page": page,
        "limit": limit,
        "offset": offset
      });
      if (requests) {
        return resolve({
          message: "Previous Requests are...",
          data: requests,
        });
      } else {
        return reject({
          message: "there are no previous requests...",
        });
      }
    } catch (error) {
      console.log(error);
      return reject({
        message: "Could not get the requests ",
      });
    }
  })
}


const getRequestDetail = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let requestDetail = await Request.findOne({ where: { requestID: params.reqId } });
      if (requestDetail) {
        return resolve({
          message: "Request is...",
          data: requestDetail,
        });
      } else {
        return reject({
          message: "There is no such request...",
        });
      }
    } catch (error) {
      console.log(error);
      return reject({
        message: "Could not get the request ",
      });
    }
  })
}

module.exports = {
  verify,
  getAllRequests,
  getRequestDetail,
}
