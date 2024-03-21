import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import noteCtrl from '../controllers/note.controller.js'

const router = express.Router()

router.param('noteId', noteCtrl.noteByID)
router.param('userId', userCtrl.userByID)

router.route('/api/notes')
    .get(noteCtrl.list)

router.route('/api/note/:noteId')
    .get(noteCtrl.read)

router.route('/api/notes/by/:userId')
    .post(authCtrl.requireSignin, authCtrl.hasAuthorization, noteCtrl.create)
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, noteCtrl.listByOwner)

router.route('/api/notes/:noteId')
    .put(authCtrl.requireSignin, noteCtrl.isOwner, noteCtrl.update)
    .delete(authCtrl.requireSignin, noteCtrl.isOwner, noteCtrl.remove)

export default router
