const express = require('express');
const cron = require('node-cron');
const path = require('path');
const routes = require("./routes/route");
//require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Path to your data file
const filePath = path.join(__dirname, 'data.xlsx');

const clearDataFile = () => {
    try {
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Clear the file by truncating it (emptying it)
            fs.truncateSync(filePath, 0);
            console.log(`Cleared data file: ${filePath}`);
        } else {
            console.log(`File ${filePath} not found.`);
        }
    } catch (err) {
        console.error(`Error clearing data file: ${err.message}`);
    }
};

// Schedule task to run daily at midnight (00:00:00)
cron.schedule('0 0 * * *', () => {
    console.log('Running daily data clearing task...');
    clearDataFile();
});


// Start the server and listen on port 3000
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});
