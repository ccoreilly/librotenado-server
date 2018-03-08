const mongoose = require("mongoose");

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
              request: {
                  type: "GET",
                  url: "/account/" + result._id
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

exports.update = (req, res, next) => {
    const id = req.params.accountId;
    Account.findById(id)
        .exec()
        .then(account => {
            if (account.owners.indexOf(req.userData.userId) > -1) {
                const updateOps = {};
                for (const ops of req.body) {
                    updateOps[ops.propName] = ops.value;
                }
                if (typeof updateOps["owners"] !== 'undefined') {
                    if (updateOps["owners"].indexOf(req.userData.userId) === -1) {
                        updateOps["owners"].push(req.userData.userId);
                    }
                }
                Account.update({_id: id}, {$set: updateOps})
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            status: "OK",
                            message: "Account updated",
                            request: {
                                type: "GET",
                                url: "/account/" + id
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
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