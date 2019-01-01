const express = require('express');
const fs = require('fs');
const _ = require('lodash');

const router = express.Router();

const multer = require('multer');

const path = require('path');
var XLSX = require('xlsx');

const directoryPath = path.join('D:', 'hyrelabs', 'backend', 'files');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: storage }).array('files', 10);



router.get('/files', (req, res) => {
    let sheetName = [];
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            var workbook = XLSX.readFile(path.resolve(__dirname, `../../files/${file}`));
            var sheet_name_list = workbook.SheetNames;
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            let duplicatesRemovedxlData = _.uniqBy(xlData, (data) => data.id)
            if(sheetName.indexOf(file) == -1 ){
                sheetName.push(file);
            }
        });
        res.send({array: sheetName})
    });
})

router.post('/files', (req, res) => {
    let xlData = []
    upload(req, res, function(err){
        console.log(req.body, "body");
        console.log(req.files, "files")
        if(err){
            console.log(err);
        }
        req.files.forEach(file => {
            var workbook = XLSX.readFile(path.resolve(__dirname, `../../files/${file.originalname}`));
            var sheet_name_list = workbook.SheetNames;
            xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        })
        let duplicatesRemovedxlData = _.uniqBy(xlData, (data) => data.id)

        res.send({
            rowsProcessed: xlData.length,
            rowsIgnored: duplicatesRemovedxlData.length,
            name: req.files[0].originalname
        });
    })
})

module.exports = {
    uploadsController: router
}