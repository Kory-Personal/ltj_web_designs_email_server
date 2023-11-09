const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const transport = {
  host: 'smtp.gmail.com',//grab smtp host of gmail
  port: 587 || 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
}

console.log(transport)

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages.')
  }
})

router.get('/verify', emailVerify);
router.post('/send', sendEmail);

async function sendEmail(req, res) {
  try {
    console.log(req.body);
    let { name, email, number, message } = req.body;
    let content = `Name: ${name} \n Email: ${email} \n Phone Number: ${number} \n Content: ${message}`;

    let mail = {
      from: name,
      to: process.env.EMAIL,
      subject: 'New Contact from ' + name,
      text: content
    }

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          status: 'fail'
        })
      } else {
        res.json({
          status: 'success'
        })
      }
    })
  } catch (e) {console.error(e)}
}

async function emailVerify(req, res) {
  try {
    console.log(req.query.email)
    const emailAddress = req.query.email;
    const API_KEY = process.env.API_KEY
    const API_URL = process.env.API_URL
    const results = await axios(
      {
      method: 'GET',
      url: `${API_URL}?email=${emailAddress}`,
      headers: {
          Authorization: `Bearer ${API_KEY}`
      }
      })
    console.log({results})
    if (results.data.status === 'valid') {
      res.status(200).send(results.data.status);
    } else {
      res.status(500).send(results.data.status);
    }
  } catch (e) {'Boo'}
    
}

module.exports = router;