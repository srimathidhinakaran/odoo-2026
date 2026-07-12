const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// Get documents by reference
router.get('/:refType/:refId', async (req, res) => {
  try {
    const docs = await Document.find({ 
      referenceModel: req.params.refType,
      referenceId: req.params.refId 
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload document
router.post('/', async (req, res) => {
  try {
    const newDoc = new Document(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
