var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
// var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);


const { body, check, validationResult } = require('express-validator');
const { default: axios } = require('axios');
const { response } = require('express');



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
  res.render('signup.ejs');
});


// Sign Up Form Validation
router.post('/', [check('email', 'Email is empty').notEmpty(),
check('email', 'Email is invalid').isEmail(),
check('password', 'Password field is empty').notEmpty(),
check('confirm_password', 'Confirm Password field is empty').notEmpty(),
body('confirm_password').custom((value, { req }) => {

  if (value !== req.body.password) {
    throw new Error('Confirm Password does not match with Password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
}),
], function (req, res) {

  var email = req.body.email;
  var password = req.body.password;
  var confirm_password = req.body.confirm_password;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var session = req.session;
  //console.log(email, password, confirm_password, fname, lname, session);

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors);
    const alert = errors.array();
    res.render('signup', { alert });
  }
  else {
    let newUser = {
      user_id: req.body.username,
      email: req.body.email,
      password,
      type: req.body.user_type,
      name: req.body.agencyName,
      description: req.body.description
    }
    // let newUser = {
    //   user_id: 'sartajekram',
    //   email: 'sartaj@iut.edu',
    //   password: '12as@A',
    //   type: 'APP'
    // }
    // console.log(newUser);

    axios({
      method: "post",
      url: "http://127.0.0.1:5000/register",
      data: newUser,
      // headers: { "Content-Type": `multipart/form-data; boundary=${form_data._boundary}`, ..form_data.getheaders() },
    })
      .then(function (response) {
        //handle success
        console.log(response.data);
        res.redirect('/login');
      })
      .catch(function (error) {
        //handle error
        console.log(error.response.data);
        res.redirect('/signup');
      });

  }
}
);


module.exports = router;