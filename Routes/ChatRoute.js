import express from 'express'
import { createChat, findChats, userChats } from '../Controller/ChatController.js'

const router = express.Router()

router.post('/', createChat)
router.get('/:userId', userChats)
router.get('/find/:firstId/:secondId', findChats)

export default router