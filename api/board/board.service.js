const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const { ObjectId } = require('mongodb');

async function query(filterBy) {
  try {
    // const criteria = _buildCriteria(filterBy)
    const criteria = {};

    const collection = await dbService.getCollection('board');
    var boards = await collection.find(criteria).toArray();
    return boards;
  } catch (err) {
    logger.error('Cannot find boards', err);
    throw err;
  }
}
async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board');
    const board = collection.findOne({ _id: ObjectId(boardId) });
    return board;
  } catch (err) {
    logger.error(`Cannot find board ${boardId}`, err);
    throw err;
  }
}
async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board');
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`Cannot remove board ${boardId}`, err);
    throw err;
  }
}
async function add(board) {
  try {
    const collection = await dbService.getCollection('board');
    await collection.insertOne(board);
    return board;
  } catch (err) {
    logger.error('Cannot insert board', err);
    throw err;
  }
}
async function update(board) {
  try {
    var id = ObjectId(board._id);
    delete board._id;
    const collection = await dbService.getCollection('board');
    await collection.updateOne({ _id: id }, { $set: { ...board } });
    return board;
  } catch (err) {
    logger.error(`Cannot update board ${boardId}`, err);
    throw err;
  }
}
module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
