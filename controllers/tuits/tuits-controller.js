// import posts from "./tuits.js";
// let tuits = posts;
import * as tuitsDao from '../../DAOs/tuits/tuits-dao.js'

const createTuit = async (req, res) => {
    const newTuit = req.body;
    // newTuit._id = (new Date()).getTime() + '';
    newTuit.liked = false;
    newTuit.likes = 0;
    newTuit.dislikes = 0;
    newTuit.replies = 0;
    newTuit.retuits = 0;
    newTuit.avatar = 'nasa.jpeg';
    newTuit.userName = "NASA";
    newTuit.handle = "@nasa";
    newTuit.time = "2h";
    const insertedTuit = await tuitsDao.createTuit(newTuit);
    res.json(insertedTuit);
}

// find all tuits
const findTuits = async (req, res) => {
    // Mongoose model interacts with the MongoDB database asynchronously
    const tuits = await tuitsDao.findTuits()
    res.json(tuits);
}


// update tuit by id
const updateTuit = async (req, res) => {
    const tuitId = req.params.tid;
    const updates = req.body;
    const status = await tuitsDao.updateTuit(tuitId, updates);
    res.json(status)
}

// delete tuit by id
const deleteTuit = async (req, res) => {
    const tuitId = req.params.tid;
    const status = await tuitsDao.deleteTuit(tuitId);
    res.json(status);
}

export default (app) => {
    app.post('/api/tuits', createTuit);
    app.get('/api/tuits', findTuits);
    app.put('/api/tuits/:tid', updateTuit);
    app.delete('/api/tuits/:tid', deleteTuit);
}
