const express = require('express');
const path = require('path');
const router = express.Router();
const debug = require('debug')('abc:server:index.js');
const {checkSchema,validationResult} = require('express-validator')
// db functions
const db = require('../tools/database')

router.get("/", (req, res) => {
    debug("into /");
    console.log('into path');
    res.sendFile(path.join(__dirname, "..", "public", "mentor", "profile.html"));
});
router.all('/test', function (req, res) {
    debug("into /test");
    if (req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }
    res.send(`<h1>you visited ${req.session.viewCount}</h1>`);
});

router.get('/userdata',(req,res)=>{

    db.getProfileData(req.user.id)
      .then((results) => {
        console.log(results.rows)
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

router.get('/studentdata',(req,res)=>{

  db.postgreDatabase.query("Select user_name,organization from user_table where user_type=$1 ",["student"])
    .then((results) => {
      console.log(results.rows)
      res.send(results.rows);
    })
    .catch((err) => {
      debug(err);
      res.status(500).send(err);
    });
});

router.post('/updateuserdata',(req,res)=>{

    db.updateProfileData(req.body.phone_number, req.body.address, req.body.city, req.body.country, req.body.state, req.body.pincode, req.user.id)
      .then((results) => {
        console.log(results[0])
        res.redirect('/users/mentor')
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

module.exports = router;
