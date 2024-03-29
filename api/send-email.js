const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const nodemailer = require('nodemailer');

const cwd = process.cwd();

const modelFinder = require(`${cwd}/middleware/model-finder.js`);

router.param('model', modelFinder.load);

router.post('/verify', verifyRecapthca);
router.get("/:model", getEmails);
router.post("/:model", sendEmail);
router.put('/:model/:id', updateOne);
router.delete('/:model/:id', deleteOne);

router.get("/models", (req, res) => {
  modelFinder.list()
    .then(models => res.status(200).json(models));
})


const transport = {
  host: 'smtp.gmail.com',//grab smtp host of gmail
  port: 587 || 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
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

async function verifyRecapthca(req, res) {
  try {
    let { token, action} = req.body;
    let url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    
    const response = await axios.post(url);

    let verification = response.data.success

    res.status(200).send(verification)
  } catch (e) {
    console.log(e)
  }
}

async function sendEmail(req, res) {
  try {
    let { first, last, email, number, message } = req.body;
    let content = `Name: ${first} ${last} \n Email: ${email} \n Phone Number: ${number} \n Content: ${message}`;
    let value = {
      name: first + last,
      email: email,
      number: number,
      message: message
    }
    let mail = {
      from: first + last,
      to: process.env.EMAIL,
      subject: 'New Contact from ' + first + last,
      text: content
    }
    const response = await req.model.post(value);
    
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.status(400).json({
          status: 'fail'
        })
      } else {
        res.status(200).json({
          status: 'success',
          response
        })
      }
    })
  } catch (e) {console.error(e)}
}

async function getEmails(req, res) {
  try {
    
    const response = await req.model.get();
    const results = {
      count: response.length,
      results: response,
    }
    res.status(200).json(results);
  } catch (e) {console.error(e)}
}

async function updateOne(req, res) {
  try {

    const currentID = req.params.id;
    const response = await req.model.put(currentID, req.body)
    res.status(200).json(response);
  } catch (e) {console.error(e)}
}

async function deleteOne(req, res) {
  try {

    const currentID = req.params.id;
    const response = await req.model.delete(currentID);
    res.status(200).json(response);
  } catch (e) {console.error(e)}
}


module.exports = router;