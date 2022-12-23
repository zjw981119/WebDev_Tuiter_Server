/**
 * @file Controller RESTful Web service API for messages resource
 */
import * as MessageDao from "../../daos/messages/messages-dao.js";
import {findAllUsersWithoutMe} from "../../daos/users/users-dao.js";

export default (app) => {
    app.get("/api/users/:uid/messages", findAllMessagesSentByUser);
    app.get("/api/messages/users/:uid", findAllMessagesSentToUser);
    app.get("/api/messages/:uid/contacts", findAllContacts);
    app.get("/api/messages", findAllMessages);
    app.post("/api/users/:sender/messages/:receiver", userSendsMessage);
    app.delete("/api/messages/:mid", userDeletesMessage);

    //for testing, not RESTful
    app.delete("/api/messages/content/:content/delete", deleteMsgByContent);
}

/**
 * Retrieves all messages that sent by a user from the database
 * @param {Request} req Represents request from client, including the path
 * parameter uid representing the user
 * @param {Response} res Represents response to client, including the
 * body formatted as JSON arrays containing the message objects
 */
const findAllMessagesSentByUser = (req, res) =>
    MessageDao.findAllMessagesSentByUser(req.params.uid)
        .then(follows => res.json(follows));

/**
 * Retrieves all messages that sent to a user from the database
 * @param {Request} req Represents request from client, including the path
 * parameter uid representing the user
 * @param {Response} res Represents response to client, including the
 * body formatted as JSON arrays containing the message objects
 */
const findAllMessagesSentToUser = (req, res) =>
    MessageDao.findAllMessagesSentToUser(req.params.uid)
        .then(follows => res.json(follows));

/**
 * Retrieves all messages between two users by sentOn time in ascending order
 * @param {Request} req Represents request from client
 * @param {Response} res Represents response to client, including the
 * body formatted as JSON arrays containing the users id
 */
const findAllMessages = async (req, res) => {
    const {sentFrom, sentTo} = req.body;
    // @ts-ignore
    let loginUserId = sentFrom === "me" && req.session['profile'] ?
        // @ts-ignore
                      req.session['profile']._id : sentFrom;
    // avoid server crash
    if (loginUserId === "me") {
        res.sendStatus(503);
        return;
    }
    // find all messages between two users
    const messages = await MessageDao.findAllMessages(loginUserId, sentTo);

    //add fromSelf property to message
    const modifiedMessages = messages.map(
        (msg) => {
            return {
                _id: msg._id,
                fromSelf: msg.sentFrom.toString() === loginUserId,
                message: msg.message
            }
        }
    )

    res.json(modifiedMessages);
}

/**
 * Retrieve all the contacts of the login user
 * @param {Request} req Represents request from client, including the path
 * parameter uid representing the user
 * @param {Response} res Represents response to client, including the
 * body formatted as JSON arrays containing the user objects
 */
const findAllContacts = async (req, res) => {
    // @ts-ignore
    let userId = req.params.uid === "my" && req.session['profile'] ?
        // @ts-ignore
                 req.session['profile']._id : req.params.uid;
    // avoid server crash
    if (userId === "my") {
        res.sendStatus(503);
        return;
    }
    findAllUsersWithoutMe(userId)
        .then(contacts => res.json(contacts));
}

/**
 * @param {Request} req Represents request from client, including the
 * path parameters uid1 and uid2 representing the user that is messaging
 * the other user and the other user being messaged
 * @param {Response} res Represents response to client, including the
 * body formatted as JSON containing the new message that was inserted in the
 * database
 */
const userSendsMessage = (req, res) => {
    // @ts-ignore
    const senderId = req.params.sender === "me" && req.session['profile'] ?
        // @ts-ignore
                   req.session['profile']._id : req.params.sender;
    const receiverId = req.params.receiver;
    const message = req.body;
    // avoid server crash
    if (senderId === "me") {
        res.sendStatus(503);
        return;
    }
    MessageDao.userSendsMessage(senderId, receiverId, message)
        .then(message => res.json(message));
}

/**
 * @param {Request} req Represents request from client, including the
 * path parameters mid representing the message that is being deleted
 * @param {Response} res Represents response to client, including status
 * on whether deleting the message was successful or not
 */
const userDeletesMessage = (req, res) =>
    MessageDao.userDeletesMessage(req.params.mid)
        .then(status => res.send(status));

// just for test, delete messages by content
const deleteMsgByContent = (req, res) =>
    MessageDao.deleteMsgByContent(req.params.content)
        .then(status => res.json(status));

