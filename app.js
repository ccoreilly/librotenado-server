const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const configDB = require("./config/database");
const userRoutes = require("./api/routes/user");
const accountRoutes = require("./api/routes/account");

mongoose.connect(configDB.url);

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use("/user", userRoutes);
app.use("/account", accountRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
});

module.exports = app;