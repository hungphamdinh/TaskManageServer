const express = require('express');
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser,
       login,
       addNewMember,
       getMembersByUserID
      } = require('../controllers/userController');

const router = express.Router();

router.post('/user', addUser);
router.post('/login', login);
router.post('/user/addMember', addNewMember);
router.get('/members/getById', getMembersByUserID);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);


module.exports = {
    routes: router
}