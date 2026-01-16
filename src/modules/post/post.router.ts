import express from 'express'
import { postController } from './post.controller'
import auth, { UserRole } from '../../middleware/auth'
const router=express.Router()
router.get('/',postController.getAllPost)
router.get('/:postId',postController.getPostById)
router.get('/post/my-post',auth(UserRole.ADMIN,UserRole.USER),postController.getMyPosts)
router.patch('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.updatedPost)
router.post('/',auth(),postController.createPost)

export const postRouter=router