const express = require('express')
const router = express.Router()
const Cat = require('../models/Cat')

router.get('/', async (req, res) => {
  const cats = await Cat.find()
  res.json({data: cats})
})

router.post('/', async (req, res) => {})

router.get('/:id', async (req, res) => {})

router.patch('/:id', async (req, res) => {})

router.put('/:id', async (req, res) => {})

router.delete('/:id', async (req, res) => {})

module.exports = router
