import express from 'express'
import { postController } from './post.controller'
import auth from '../../middleware/auth'
const router=express.Router()
router.get('/',postController.getAllPost)
router.get('/:postId',postController.getPostById)
router.post('/',auth(),postController.createPost)

export const postRouter=router