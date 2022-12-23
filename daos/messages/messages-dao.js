/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageModel from "./messages-model.js";


/**
 * Retrieve all messages that sent by a user
 * @param {string} uid User's primary key
 */
export const findAllMessagesSentByUser = async (uid) =>
    MessageModel
        .find({sentFrom: uid})
        .exec();

/**
 * Retrieve all messages that sent to a user
 * @param {string} uid User's primary key
 */
export const findAllMessagesSentToUser = async (uid) =>
    MessageModel
        .find({sentTo: uid})
        .exec();

/**
 * Retrieve all messages that sent to a user
 * @param {string} uid1 User's primary key
 * @param {string} uid2 User's primary key
 */
export const findAllMessages = async (uid1, uid2) =>
    MessageModel
        .find(
            {
                // find all messages between two users
                $or: [
                    {sentFrom: uid1, sentTo: uid2},
                    {sentFrom: uid2, sentTo: uid1}
                ]
            }
        )
        // sort by sentOn time in ascending order
        .sort({sentOn: 1})
        .exec();

/**
 * Inserts follow instance into the database
 * @param {string} sender User's primary key
 * @param {string} receiver User's primary key
 * @param {string} message message to be inserted into the database
 */
export const userSendsMessage = async (sender, receiver, message) =>
    //use "..." to parse object into key-value pairs instead of casting message object to string
    MessageModel.create({...message, sentFrom: sender, sentTo: receiver});

/**
 * Removes follow instance from the database
 * @param {string} mid Message's primary key
 */
export const userDeletesMessage = async (mid) =>
    MessageModel.deleteOne({_id: mid});

// just for test, delete messages by content
export const deleteMsgByContent = async (msg) =>
    MessageModel.deleteMany({message: msg});
