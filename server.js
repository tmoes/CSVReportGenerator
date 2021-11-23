const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  console.log('INSIDE APP.GET - server.js ln 13');
  res.send();
});

// Text Field Entry Post
app.post('/', (req, res) => {
  var body = JSON.parse(req.body.text);
  var dataObj = {};
  var data = ['firstName','lastName','county','city','role','sales'];

  for (var i = 0; i < data.length; i++) {
    dataObj[data[i]] = [];
  }

  var depthObj = (object) => {
    for (var i = 0; i < data.length; i++) {
      dataObj[data[i]].push(object[data[i]]);
    }

    if (object.children.length > 0) {
      for (var i = 0; i < object.children.length; i++) {
        depthObj(object.children[i]);
      }
    }
  };

  depthObj(body);
  dataObj['csv'] = handleCSV(dataObj);

  res.set({
    'Access-Control-Allow-Origin':  '/',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  res.status(201).send(dataObj);
});

// File picker post
app.post('/upload_json', function(req, res){
  // console.log(req.body);
  // var body = JSON.parse(req.body.data.split(';'));
  var body = req.body.data;

  var dataObj = {};
  var data = ['firstName','lastName','county','city','role','sales'];

  for (var i = 0; i < data.length; i++) {
    dataObj[data[i]] = [];
  }

  var depthObj = (object) => {
    for (var i = 0; i < data.length; i++) {
      dataObj[data[i]].push(object[data[i]]);
      console.log(dataObj[data[i]]);
    }

    if (object.children) {
      for (var i = 0; i < object.children.length; i++) {
        depthObj(object.children[i]);
      }
    }
  };

  depthObj(body);
  dataObj['csv'] = handleCSV(dataObj);
  console.log('dataObj:', dataObj);


  fs.writeFile('csv_report.csv', dataObj['csv'], function(err){
    if(err) console.log('ERROR: Creating File ');
    console.log('File created');
  });

  res.set({
    'Access-Control-Allow-Origin':  '/upload_json',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  res.status(201).send(dataObj['csv']);
});

// Download link
app.get('/download_json', function(req, res){
  res.download('./csv_report.csv');
});

var handleCSV = (body) => {
  var csvArr = [];
  var data = ['firstName','lastName','county','city','role','sales']
  for (var i = 0; i < body.firstName.length; i++) {
    var current = [];
    for (var j = 0; j < data.length; j++) {
      current.push(body[data[j]][i]);
    }
    csvArr.push(current);
  }
  csvStr = csvArr.join('\n');
  return csvStr;
}

app.listen(port, () => {
  console.log(`listening on port ${port}.`);
});