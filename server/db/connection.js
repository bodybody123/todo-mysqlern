import mysql from 'mysql';

const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'todo'
});

conn.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + conn.threadId);
});

export default conn;