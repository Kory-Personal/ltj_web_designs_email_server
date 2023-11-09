'use strict';

const cwd = process.cwd();

const express = require('express');
const router = express.Router();

const modelFinder = require(`${cwd}/middleware/model-finder.js`);

var fs = require('fs');
var path = require('path');

router.param('model', modelFinder.load);

router.get("/:model", getProjects);
router.post("/:model", createOne);
router.get('/:model/:id', getOne);
router.put('/:model/:id', updateOne);
router.delete('/:model/:id', deleteOne);

router.get("/models", (req, res) => {
  modelFinder.list()
    .then(models => res.status(200).json(models));
})


async function getProjects(req, res) {
  try {
    
    const response = await req.model.get();
    const results = {
      count: response.length,
      results: response,
    }
    res.status(200).json(results);
  } catch (e) {console.error(e)}
}

async function createOne(req, res) {
  try {
    const object = {
      name: req.body.name,
      deployed_link: req.body.deployed_link,
      github_link: req.body.github_link,
      tools: req.body.tools,
      image: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      description: req.body.description
    }
    const response = await req.model.post(req.body);
    console.log(response);
    res.status(200).send(response);
  } catch(e) { console.error(e)}
}

async function getOne(req, res) {
  try {

    const currentID = req.params.id;
    const response = await req.model.get(currentID);
    res.status(200).json(response);
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