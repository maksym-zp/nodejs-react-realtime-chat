const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Content is required.'],
        trim: true,
        minLength: 3
    },
    userId: {
        type: ObjectId,
        required: [true, 'userId is required.'],
    },
    parentId: {
        // type: ObjectId,
        type: String,
        required: false,
    }

}, {
    timestamps: true
});

messageSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Message', messageSchema);
