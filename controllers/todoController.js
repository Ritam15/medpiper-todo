const userModel = require('../models/user')
const boardModel = require('../models/board')
const todoModel = require('../models/todo')

const createtask = async function (req, res) {
    try {
        let boardId = req.params.boardId
        let requestBody = req.body
        let userIdFromToken = req.userId


        let boardData = await boardModel.findOne({ _id: boardId })

        if (!boardData) {
            return res.status(400).send({ status: false, message: `${boardId} is not present` })
        }

        if (boardData.userId.toString() != userIdFromToken) {
            return res.status(400).send({ status: false, message: `Unauthorized access! Owner info doesn't match` })
        }


        let obj = {}
        obj['boardId'] = boardId
        //Extract Body
        let { task, status } = requestBody

        let TodoList = await todoModel.findOne({ task: task })

        if (TodoList) {
            return res.status(400).send({ status: false, message: `${task} alredy present` })
        }
        obj['task'] = task

        if (requestBody.hasOwnProperty('status')) {

            obj['status'] = status

        }

        let data = await todoModel.create(obj)
        res.status(201).send({ status: true, data: data })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }



}


const getTaskById = async function (req, res) {
    try {
        let boardId = req.params.boardId
        let taskId = req.params.taskId


        let boardData = await boardModel.findOne({ _id: boardId, isDeleted: false })

        if (!boardData) {
            return res.status(400).send({ status: false, message: `${boardId} is not present` })
        }

        let task = await todoModel.findOne({ _id: taskId, isDeleted: false })

        if (!task) {
            return res.status(400).send({ status: false, message: `${taskId} is not present` })
        }

        res.status(200).send({ status: true, data: task })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


const updatetask = async function (req, res) {
    try {
        let boardId = req.params.boardId
        let taskId = req.params.taskId
        let requestBody = req.body
        let userIdFromToken = req.userId

        let boardData = await boardModel.findOne({ _id: boardId, isDeleted: false })

        if (!boardData) {
            return res.status(400).send({ status: false, message: `${boardId} is not present` })
        }

        if (boardData.userId.toString() != userIdFromToken) {
            return res.status(400).send({ status: false, message: `Unauthorized access! Owner info doesn't match` })
        }
       
        let task = await todoModel.findOne({ _id: taskId, isDeleted: false, status:'Done' })
        let taskStatus = task.status

        if (!task) {
            return res.status(400).send({ status: false, message: `${taskId} is not present` })
        }

        if(task.status==='Done'){
            return res.status(400).send({ status: false, message: `Cannot update as Task is been alredy Done` })
        }

        let obj = {}

       
            //extract body
            var { tasknew, status } = requestBody

                obj['task'] = tasknew
            

            if (requestBody.hasOwnProperty('status')) {
              
                    if (taskStatus === 'Done') {
                        return res.status(400).send({ status: false, message: `the task is alredy Done` })
                    }
                    obj['status'] = status
                
            }

        

        let updateData = await todoModel.findOneAndUpdate({ _id: taskId }, obj, { new: true })

        res.status(200).send({ status: true, data: updateData })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const deleteTaskById = async function (req, res) {
    try {
        let boardId = req.params.boardId
        let taskId = req.params.taskId
        let userIdFromToken = req.userId

        

        let boardData = await boardModel.findOne({ _id: boardId, isDeleted: false })

        if (!boardData) {
            return res.status(400).send({ status: false, message: `${boardId} is not present or alredy deleted` })
        }

        if (boardData.userId.toString() != userIdFromToken) {
            return res.status(400).send({ status: false, message: `Unauthorized access! Owner info doesn't match` })
        }

        if (!validator.isValidObjectId(taskId)) {
            return res.status(400).send({ status: false, message: "Invalid boardId in params." })
        }

        if (!validator.isValid(taskId)) {
            return res.status(400).send({ status: false, message: `${boardId} is not a valid user id or not present ` })

        }

        let task = await todoModel.findOne({ _id: taskId, isDeleted: false })


        if (!task) {
            return res.status(400).send({ status: false, message: `${taskId} is not present or alredy deleted` })
        }

        let deleteTask = await todoModel.findOneAndUpdate({ _id: taskId }, { isDeleted: true }, { new: true })

        res.status(204).send({ status: true })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}



module.exports = {
    createtask, getTaskById, updatetask, deleteTaskById
}