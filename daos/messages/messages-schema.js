import mongoose, {Schema} from 'mongoose';

const MessageSchema = new mongoose.Schema(
    {
        message: {type: String, required: true},
        sentFrom: {type: Schema.Types.ObjectId, ref: "UserModel"},
        sentTo: {type: Schema.Types.ObjectId, ref: "UserModel"},
        sentOn: {type: Date, default: Date.now},
    }, {collection: 'messages'});
export default MessageSchema;