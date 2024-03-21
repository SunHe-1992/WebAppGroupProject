import Note from '../models/note.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './../helpers/dbErrorHandler.js'
import formidable from 'formidable'

const create = async (req, res) => {
    // console.log("note create");
    const note = new Note(req.body)
    note.owner = req.profile
    try {
        await note.save()
        return res.status(200).json({
            message: "Successfully added a note!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const noteByID = async (req, res, next, id) => {
    try {
        let note = await Note.findById(id)
        if (!note)
            return res.status('400').json({
                error: "Note not found"
            })
        req.note = note
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve note"
        })
    }
}


const read = (req, res) => {
    return res.json(req.note)
}

const update = async (req, res) => {
    try {
        const noteId = req.params;
        // console.log("update a note by id" + noteId);
        let note = req.note
        note = extend(note, req.body)
        note.updated = Date.now()
        await note.save()
        res.json(note)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

}
const remove = async (req, res) => {
    try {
        let note = req.note
        let deletedNote = await note.deleteOne()
        res.json(deletedNote)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    try {
        let notes = await Note.find()
        res.json(notes)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByOwner = async (req, res) => {
    try {
        let notes = await Note.find({ owner: req.profile._id }).populate('owner')
        res.json(notes)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const isOwner = (req, res, next) => {
    const isOwner = req.note && req.auth && req.note.owner._id == req.auth._id
    if (!isOwner) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    create,
    noteByID,
    list,
    listByOwner,
    read,
    update,
    isOwner,
    remove
}
