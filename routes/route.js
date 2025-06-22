const express = require("express");
const router = express.Router();

// Import Controllers and Middlewares
const { getForm, postAttendence } = require("./../controllers/attendence");
const {adminForm, admin, checkAccess} = require("./../controllers/admin");

// Define Routes
router.get("/", getForm);
router.post("/",checkAccess, postAttendence);
router.get("/admin", adminForm);
router.post("/admin", admin)

module.exports = router;