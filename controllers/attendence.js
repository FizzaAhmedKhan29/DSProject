const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./attendance.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to database.');
});

exports.getForm  = (req, res) => {
    res.sendFile(path.join(__dirname, "../html/index.html"));
};

exports.postAttendence = (req, res) => {
    console.log("REQUEST BODY ", req.body);
    let { name, rollNo, branch, year } = req.body;

    // Define the path to the spreadsheet
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const mt = String(today.getMonth() + 1).padStart(2, '0');
    const yr = today.getFullYear();
    const filename = `../${day}_${mt}_${yr}.xlsx`;
    const filePath = path.join(__dirname, filename);

    let workbook;
    let worksheet;

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // If file exists, read the existing workbook
        workbook = XLSX.readFile(filePath);
    } else {
        // If file doesn't exist, create a new workbook
        workbook = XLSX.utils.book_new();
    }

    // Check if the worksheet for the current year and branch exists
    const sheetName = `${branch}-${year}`;
    if (workbook.SheetNames.includes(sheetName)) {
        // If sheet exists, use it
        worksheet = workbook.Sheets[sheetName];
    } else {
        // If sheet doesn't exist, create a new sheet with headers
        worksheet = XLSX.utils.aoa_to_sheet([["Name", "Roll No", "Branch", "Year"]]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Convert worksheet to JSON to check for existing entries
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Check for duplicate roll number
    const duplicate = data.some(row => row[1] === rollNo);

    if (duplicate) {
        // If duplicate found, send a response indicating duplication
        res.status(400).send("Today's attendance for roll number " + rollNo + " was marked already");
    } else {
        // Append the new data to the sheet
        XLSX.utils.sheet_add_aoa(worksheet, [[name, rollNo, branch, year]], { origin: -1 });

        // Update the range of the worksheet
        const newRange = XLSX.utils.decode_range(worksheet['!ref']);
        newRange.e.r += 1;  // Increment the end row by 1
        worksheet['!ref'] = XLSX.utils.encode_range(newRange);

        // Write the updated workbook back to the file
        XLSX.writeFile(workbook, filePath);

        db.run(
            `INSERT INTO attendance(name, roll, branch, year) VALUES(?, ?, ?, ?)`, [name, rollNo, branch, year],
            function(err) {
                if (err) return console.log(err.message);
                // Send a success response
                res.sendFile(path.join(__dirname, "../html/success.html"));
            }
        );
    }
};
