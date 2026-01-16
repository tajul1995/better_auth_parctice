import express from 'express'
import { postController } from './post.controller'
import auth, { UserRole } from '../../middleware/auth'
const router=express.Router()
router.get('/',postController.getAllPost)
router.get('/:postId',postController.getPostById)
router.get('/post/my-post',auth(UserRole.ADMIN,UserRole.USER),postController.getMyPosts)
router.get('/count/stats/',auth(UserRole.ADMIN),postController.countStats)

router.post('/',auth(),postController.createPost)
router.patch('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.updatedPost)

export const postRouter=router