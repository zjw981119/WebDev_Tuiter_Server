import posts from "./tuits.js";

let tuits = posts;

const createTuit = (req, res) => {
    const newTuit = req.body;
    newTuit._id = (new Date()).getTime() + '';
    newTuit.liked = false;
    newTuit.likes = 0;
    newTuit.dislikes = 0;
    newTuit.replies = 0;
    newTuit.retuits = 0;
    newTuit.avatar = 'nasa.jpeg';
    newTuit.userName = "NASA";
    newTuit.handle = "@nasa";
    newTuit.time = "2h";
    tuits.push(newTuit);
    res.json(newTuit);
}

// find all tuits
const findTuits = (req, res) => res.json(tuits);

// update tuit by id
const updateTuit = (req, res) => {
    const tuitdIdToUpdate = req.params.tid;
    const updates = req.body;
    // find tuit by id
    const tuitIndex = tuits.findIndex((t) => t._id === tuitdIdToUpdate)
    // load previous properties, only change properties in updates
    tuits[tuitIndex] = {...tuits[tuitIndex], ...updates};
    res.sendStatus(200)
}

// delete tuit by id
const deleteTuit = (req, res) => {
    const tuitId = req.params.tid;
    tuits = tuits.filter(t => t._id !== tuitId);
    res.sendStatus(200);
}

export default (app) => {
    app.post('/api/tuits', createTuit);
    app.get('/api/tuits', findTuits);
    app.put('/api/tuits/:tid', updateTuit);
    app.delete('/api/tuits/:tid', deleteTuit);
}
