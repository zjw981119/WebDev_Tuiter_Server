import mongoose from 'mongoose';
// non relational database do not require specifying the structure,
// or schema of the data stored in collections
// the responsibility has been delegated to the applications
const schema = mongoose.Schema({
                                   tuit: String,
                                   likes: Number,
                                   liked: Boolean,
                                   dislikes: Number,
                                   replies: Number,
                                   retuits: Number,
                                   avatar: String,
                                   userName: String,
                                   handle: String,
                                   time: String,
                               }, {collection: 'tuits'});
export default schema;