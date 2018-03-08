const mongoose = require("mongoose");

const Account = require("../models/account");
const Transaction = require("../models/transaction");

exports.create = (req, res, next) => {
  const transaction = new Transaction({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(req.body.date),
      expense: req.body.expense,
      concept: req.body.concept,
      value: Math.abs(req.body.value),
      main_account: req.body.main_account,
      secondary_account: req.body.secondary_account,
      author: req.userData.userId
  });
  console.log(transaction);
    transaction.save()
      .then(result => {
          const updateValue = transaction.expense ? -transaction.value : transaction.value;
          console.log(updateValue);
          Account.where({ _id: transaction.main_account })
              .update({ $inc: { balance: updateValue }})
              .exec()
              .catch(err => {
                  console.log(err);
                  return res.status(500).json({
                      status: "NOK",
                      message: err
                  });
              });
          // 201 Created
          return res.status(201).json({
              status: "OK",
              message: "Transaction created",
              request: {
                  type: "GET",
                  url: "/transaction/" + result._id
              }
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
  Transaction.findById(req.params.transactionId)
      .populate("main_account")
      .populate("secondary_account")
      .exec()
      .then(transaction => {
          if(transaction.main_account.owners.indexOf(req.userData.userId) > -1) {
              return res.status(200).json({
                  status: "OK",
                  date: transaction.date,
                  value: transaction.value,
                  expense: transaction.expense,
                  concept: transaction.concept,
                  main_account: transaction.main_account,
                  secondary_account: transaction.secondary_account
              });
          } else {
              return res.status(401).json({
                  status: "NOK",
                  message: "Authorization failed"
              });
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          });
      });
};

exports.delete = (req, res, next) => {
    Transaction.findByIdAndRemove(req.params.transactionId)
        .exec()
        .then(transaction => {
            console.log(transaction);
            if(!transaction) {
                return res.status(404).json({
                        status: "NOK",
                        message: "Not found"
                    })
            } else {
                const updateValue = transaction.expense ? -transaction.value : transaction.value;
                console.log(updateValue);
                Account.where({_id: transaction.main_account})
                    .update({$inc: {balance: -updateValue}})
                    .exec()
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            status: "NOK",
                            message: err
                        });
                    });
                res.status(200).json({
                    status: "OK",
                    message: "Transaction deleted"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};