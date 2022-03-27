const express = require('express');

const router = express.Router();

const middleware=require('../auth/auth')
const userController=require('../controllers/userController')
const boardController=require('../controllers/boardController')
const todoController=require('../controllers/todoController')

const multer= require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


//SignUp API
router.post('/SignUp',upload.single('profileImage'),userController.registerUser)
// login API
router.post('/login', userController.loginPassword)
router.post('/login/phone', userController.loginPhone);
router.post('/login/phone/otp', userController.otpVerification);
router.put('/user/update/:userId', middleware.userAuth, userController.updateUser);

//enter otp



// create board API
router.post('/board/:userId',middleware.userAuth,boardController.createBoard)
// get by Id
router.get('/board/:boardId',middleware.userAuth,boardController.getboardById)
//update Board
// delete board
router.delete('/board/:boardId',middleware.userAuth, boardController.deleteBoardById)

//create task
router.post('/board/:boardId/task',middleware.userAuth,todoController.createtask)
//get task by id
router.get('/board/:boardId/task/:taskId',middleware.userAuth,todoController.getTaskById)
//update task
router.put('/board/:boardId/task/:taskId',middleware.userAuth,todoController.updatetask)
//delete task
router.delete('/board/:boardId/task/:taskId',middleware.userAuth,todoController.deleteTaskById)

module.exports = router