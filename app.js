//Sam Denoncourt CMSC447 SP2023 Prof. Nick Allgood HW2

const express = require('express');
const bodyparser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var http = require('http');

const app = express();
const port = 3000;

app.use(express.static('/hw2'));
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});

  fs.readFile(__dirname + '/hw2.html', null, function(err, data){
    if ( err ) {
      throw err;
    }
    res.write(data);
    res.end();
  });
});

app.post('/add', (req, res) => {
  const name = req.body.namename;
  const id = req.body.idname;
  const points = req.body.pointsname;
  console.log({name, id, points});
  
  var db = new sqlite3.Database(__dirname + '/hw2db.db', sqlite3.OPEN_READWRITE);

  db.run(`INSERT INTO tbl1 VALUES(\'` + name + `\', ` + id + `, ` + points + `);`);

  db.close();
});

app.post('/delete', (req, res) => {
  const removename = req.body.removename;
  
  var db = new sqlite3.Database(__dirname + '/hw2db.db', sqlite3.OPEN_READWRITE);

  db.all(`SELECT * FROM tbl1`, [], (err, rows) => {
    var deleteexists = false;

    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.name == removename) {
        deleteexists = true;
      }
      console.log(row);
    });
    
    if (deleteexists) {
      db.run(`DELETE FROM tbl1 WHERE name = \'` + removename + `\';`);
    }
  });
  
  db.close();

  res.statusCode = 204;
  res.end();
});

app.post('/search', (req, res) => {

  const searchname = req.body.searchname;

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Search Results for: ' + searchname + '\n');
  
  var db = new sqlite3.Database(__dirname + '/hw2db.db', sqlite3.OPEN_READWRITE);

  db.all(`SELECT * FROM tbl1`, [], (err, rows) => {
    var searchexists = false;

    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.name == searchname || searchname == 'all') {
        searchexists = true;
        res.write('Name: ' + row.name + ', Id: ' + row.id + ', Points: ' + row.points + '\n');
      }
    });
    
    if (!searchexists) {
      res.write('No results found. Make sure to match exact case and spelling.\n');
    }

    res.write('\nClick your browser\'s back button to go back');
    res.end();
  });
  
  db.close();

});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
