const mongoose = require("mongoose");
const userModel = require("../models/user");
const boardModel = require("../models/board");
const todoModel = require("../models/todo");

const createBoard = async function (req, res) {
  try {
    let requestBody = req.body;
    let userId = req.params.userId;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: `User doesn't exists by ${userId}` });
    }
    //Extract body
    let { boardName } = requestBody;
    let isBoardNamePresent = await boardModel.findOne({ boardName: boardName });
    if (isBoardNamePresent) {
      return res
        .status(400)
        .send({ status: false, message: `${boardName} Alredy present` });
    }
    let boardData = { boardName, userId };
    let board = await boardModel.create(boardData);

    res.status(201).send({ status: true, data: board });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getboardById = async function (req, res) {
  try {
    let boardId = req.params.boardId;
    let boardData = await boardModel.findOne({
      _id: boardId,
      isDeleted: false,
    });

    if (!boardData) {
      return res
        .status(400)
        .send({ status: false, message: `${boardId} is not present` });
    }

    let todoList = await todoModel.find({ isDeleted: false });
    let task = [];
    for (i in todoList) {
      if (todoList[i].boardId.toString() === boardId) {
        task.push(todoList[i]);
      }
    }
    let board = boardData.toObject();
    board["task"] = task;
    res.status(200).send({ status: true, data: board });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBoardById = async function (req, res) {
  try {
    let boardId = req.params.boardId;
    let userIdFromToken = req.userId;
    let boardData = await boardModel.findOne({
      _id: boardId,
      isDeleted: false,
    });

    if (!boardData) {
      return res
        .status(400)
        .send({ status: false, message: `${boardId} is not present` });
    }
    if (boardData.userId.toString() != userIdFromToken) {
      return res.status(400).send({
        status: false,
        message: `Unauthorized access! Owner info doesn't match`,
      });
    }

    let data = await boardModel.findOneAndUpdate(
      { _id: boardId },
      { isDeleted: true },
      { new: true }
    );
    await todoModel.updateMany({ _id: boardId }, { isDeleted: true });
    res
      .status(204)
      .send({ status: true, message: "Board deleted", data: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports = {
  createBoard,
  deleteBoardById,
  getboardById,
};
