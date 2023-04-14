const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/db.sqlite');

db.serialize(() => {

});

db.on('close', () => {
    db.close();
});


module.exports = db;