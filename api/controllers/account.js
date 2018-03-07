const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Account = require("../models/account");

exports.create = (req, res, next) => {
  const account = new Account({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      balance: req.body.balance,
      owners: [req.userData.userId]
  });
  account.save()
      .then(result => {
          // 201 Created
          return res.status(201).json({
              status: "OK",
              message: "Account created",
              profile_url: "/account/" + result._id
          });
      })
      .catch(err => {
          console.log(err);
          return res.status(500).json({
              status: "NOK",
              message: err
          });
      });
};

exports.details = (req, res, next) => {
  Account.findById(req.params.accountId)
      .exec()
      .then(account => {
          if(account.owners.indexOf(req.userData.userId) > -1) {
              return res.status(200).json({
                  status: "OK",
                  name: account.name,
                  balance: account.balance,
                  owners: account.owners
              });
          } else {
              return res.status(401).json({
                  status: "NOK",
                  message: "Authorization failed"
              });
          }
      });
};