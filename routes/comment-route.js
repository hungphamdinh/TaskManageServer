const express = require('express');
const {addComment,
    getCommentByTaskId
      } = require('../controllers/commentController');

const router = express.Router();

router.post('/comment', addComment);
router.get('/comment/getByTaskId', getCommentByTaskId);


module.exports = {
    routes: router
}