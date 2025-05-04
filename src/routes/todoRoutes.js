const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.post('/addTodo', todoController.createTodo);
router.get('/myTodo', authController.signup);
router.delete('/deleteTodo', authController.login);

module.exports = router;
