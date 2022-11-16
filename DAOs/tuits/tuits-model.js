import mongoose from 'mongoose';
import tuitsSchema from './tuits-schema.js'
// Mongoose models provide similar functions to interact with MongoDB programmatically instead of manually
const tuitsModel = mongoose.model('TuitModel', tuitsSchema);
export default tuitsModel;