
import express from 'express'
import { commentController } from './comments.controller'
import auth, { UserRole } from '../../middleware/auth'

const router=express.Router()
router.post('/',auth(UserRole.USER,UserRole.ADMIN) ,  commentController.createComments)
router.get('/:commentId',auth(UserRole.USER,UserRole.ADMIN) ,  commentController.getCommentById)
router.delete('/:commentId',auth(UserRole.USER,UserRole.ADMIN) ,  commentController.deleteComment)
router.get('/author/:authorId',auth(UserRole.USER,UserRole.ADMIN) ,  commentController.getCommentByAuthor)
router.patch('/:commentId/moderate',auth(UserRole.USER,UserRole.ADMIN) ,  commentController.moderateComment)
 export const commentsRouter=router