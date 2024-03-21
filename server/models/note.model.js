import mongoose from 'mongoose'
const NoteSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    isTask: {
        type: Boolean,
        default: false
    },
    isTaskFinished: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Note', NoteSchema);
