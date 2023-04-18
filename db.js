const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/db.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS guilds (id TEXT, feur INTEGER)`);

    db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT, feur INTEGER)`);

    db.run(`CREATE TABLE IF NOT EXISTS date (date TEXT, feur INTEGER)`);

    db.run(`CREATE TABLE IF NOT EXISTS bot (id TEXT, feur INTEGER)`);
});

db.on('close', () => {
    db.close();
});


module.exports = db;