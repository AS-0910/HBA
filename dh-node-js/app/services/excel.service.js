const fs = require('fs')
const path = require('path')
const fileSystem = require("fs");
const readXlsxFile = require("read-excel-file/node");
const moment = require('moment');

const dB = require('../models');
const { validateRowData } = require('../helpers/excel.helper');
const Files = dB.files;
const Subject = dB.subjects;

const upload = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (file == undefined) {
          return reject({ message: "No file selected! Please upload a excel file."});
        }
        let path = __basedir + "/app/datafiles/uploads/" + file.filename;
        // Save the data in db  
        readXlsxFile(path).then((rows) => {
          // skip header
          rows.shift();
          if(rows && rows.length == 0) {
            return reject({message: "File is empty!"});
          }
          let subjects = [];
          rows.forEach((row, id) => {
            if(!validateRowData(row)) {
                return reject({message: `Row ${id+1} : One of these mandatory fields missing (Registration Number, First Name, University ID, Degree, Year Of Passing)`})
            }
            let subj = {
              regNumber: row[1],
              firstName: row[2],
              middleName:row[3],
              lastName: row[4],
              issuingAuthority: row[5],
              department: row[6],
              document: row[7],
              startDate: row[8],
              endDate: row[9],
            };
            subjects.push(subj);
            console.log("-------------------------")
            console.log(subj);
          });
    
          Subject.bulkCreate(
            subjects, 
            {updateOnDuplicate: ['firstName', 'middleName', 'lastName', 'department', 'startDate', 'endDate']})
            .then(() => {
                // Insert file into db
                Files.create(
                    {
                    fileName: file.filename,
                    data: Buffer.from(fs.readFileSync(path))
                    }
                );
                return resolve({
                    message: "Uploaded the file successfully: " + file.originalname,
                });
            })
            .catch((error) => {
              return reject({
                message: "Fail to import data into database!",
                error: error.message,
              });
            });
        });
      } catch (error) {
        console.log(error);
        return reject({
          message: "Could not upload the file: " + file.originalname,
        });
      }
    })      
}

const getUploadedFiles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let files = await Files.findAll();
            let data = [];

            files.map((fl) => {
                let obj = {};
                obj.id = fl.id;
                obj.fileName = fl.fileName;
                obj.createdAt = fl.createdAt;

                data.push(obj);
            })

            resolve(data)
        } catch(err) {
            reject({message: err.message || "Some error occurred while retrieving files."});
        }
    })
}

const downloadTemplate = (query, params, res) => {
    return new Promise(async (resolve, reject) => {
        try {
          console.log(query)
            if(query && query.template && query.template=='true') {
                var file = params && params.fileName;
                var fileLocation = path.join(__basedir, "/app/datafiles/templates/", file);
                var stat = fileSystem.statSync(fileLocation);
                console.log(fileLocation);
                let data = Buffer.from(fs.readFileSync(fileLocation))
                // res.writeHead(200, {
                //     "Content-disposition": `attachment; filename=${file}`,
                //     "Content-Type": "file",
                //     "Content-Length": stat.size,
                // });
                // var readStream = fileSystem.createReadStream(fileLocation);
                // readStream.pipe(res);
                return res.status(200).send(data)
            } else {
                let fl = await Files.findOne({ where : { fileName: params.fileName }})
                console.log(fl)
                if(fl && fl!=null) {
                    console.log("Result=====> ", fl.id);
                    res.status(200).send({
                        data: fl.data
                    });
                }
            }    
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    })
}

module.exports = {
    upload,
    getUploadedFiles,
    downloadTemplate
}