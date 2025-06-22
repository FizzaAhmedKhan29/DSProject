const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const routes = require("./routes/route");

let db = new sqlite3.Database('./attendance.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to database.');
});
db.run(`CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR (2500) NOT NULL,
  roll VARCHAR (2500) NOT NULL,
  branch VARCHAR (2500) NOT NULL,
  year VARCHAR (2500) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Start the server and listen on port 3000
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});
