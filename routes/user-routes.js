const express = require('express');
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser,
       login
      } = require('../controllers/userController');

const router = express.Router();

router.post('/user', addUser);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);


module.exports = {
    routes: router
}