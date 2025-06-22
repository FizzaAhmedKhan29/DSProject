const path = require('path');

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'letmein123';

let isAdminAllowed = false;
let accessEndTime = null;

exports.adminForm = (req, res) => {
  res.sendFile(path.join(__dirname, "../html/admin.html"));
};

exports.admin = (req, res) => {
  const { username, password, access, time } = req.body;

  if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (access === 'true') {
      const minutes = time ? parseInt(time) : 30;
      isAdminAllowed = true;
      accessEndTime = Date.now() + minutes * 60 * 1000;
      return res.send(`Access granted for ${minutes} minutes.`);
    } else {
      isAdminAllowed = false;
      return res.send('Access denied.');
    }
  }

  res.send("You are not Admin. Ask Admin to grant attendance access.");
};

exports.checkAccess = (req, res, next) => {
  if (isAdminAllowed && Date.now() < accessEndTime) {
    return next();
  }
  isAdminAllowed = false;
  res.status(403).send('Ask Admin to Allow Attendance');
};
