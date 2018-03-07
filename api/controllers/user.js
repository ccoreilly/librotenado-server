const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
      .exec()
      .then(users => {
          if (users.length >= 1) {
              // If user exists return 409 Conflict
              res.status(409);
              res.json({
                  status: "NOK",
                  message: "User exists"
              });
              return res;
          } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                      return res.status(500).json({
                          status: "NOK",
                          message: "Bcrypt error: " + err
                      });
                  } else {
                      const user = new User({
                          _id: new mongoose.Types.ObjectId(),
                          email: req.body.email,
                          password: hash
                      });
                      user.save()
                          .then(result => {
                              console.log(result);
                              // 201 Created
                              return res.status(201).json({
                                  status: "OK",
                                  message: "User created",
                                  profile_url: "/user/" + result._id
                              });
                          })
                          .catch(err => {
                              console.log(err);
                              return res.status(500).json({
                                  status: "NOK",
                                  message: err
                              });
                          });
                  }
              });
          }
      })
};

exports.profile = (req, res, next) => {
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    status: "NOK",
                    message: "User not found"
                })
            } else {
                return res.status(200).json({
                    status: "OK",
                    email: user.email
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: "NOK",
                message: err
            });
        });
};

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    status: "NOK",
                    message: "Authorization failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        status: "NOK",
                        message: "Authorization failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        status: "OK",
                        message: "Authorization successful",
                        token: token,
                        profile_url: "/user/" + user[0]._id
                    });
                }
                res.status(401).json({
                    status: "NOK",
                    message: "Authorization failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};