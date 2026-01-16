import { PostStatus } from '../../../generated/prisma/enums';
import pagtnationBysorting from '../../helpers/paginationWithSorting';
import { UserRole } from '../../middleware/auth';
import { postService } from './post.service';
import { Request, Response } from "express";

const createPost=async(req:Request,res:Response)=>{
        try {
            console.log(req.user)
            const result=await postService.createPost(req.body,req.user?.id as string)
            res.status(200).json({
                success:true,
                message:'post created successfully',
                data:result

            })
        } catch (error:any) {
           res.status(500).json({
                success:false,
                message:'post does not created',
                data:error.message

            }) 
        }
}
const getAllPost=async(req:Request,res:Response)=>{
    try {
            const {search}=req.query
            const searchValue= typeof search ==="string"? search : undefined
            const tags=req.query.tags?(req.query.tags as string).split(","):[]
            const isFeatured = req.query.isFeatured==="true"?true:req.query.isFeatured==="false"?
            false:undefined
            
            undefined

            const status= req.query.status as PostStatus |undefined
            const authorId=req.query.authorId as string | undefined
            const pages=Number(req.query.pages?? 1)
            const limit=Number(req.query.limit?? 10)
            const skip=(pages-1)*limit
            const sortBy=req.query.sortBy as string??"createdAt"
            const sortOrder=req.query.sortOrder as string??"desc"
            // const options=pagtnationBysorting(req.body)
            // const {pages,limit,skip,sortBy,sortOrder}=options
            const result=await postService.getAllPost( {search:searchValue,tags},isFeatured as boolean,status,authorId,pages,limit,skip,sortBy,sortOrder)
            res.status(200).json({
                success:true,
                message:'get all post successfully',
                data:result

            })
        } catch (error:any) {
           res.status(500).json({
                success:false,
                message:'does not find any posts',
                data:error.message

            }) 
        }
}
const getPostById=async(req:Request,res:Response)=>{
    try {
            const {postId}=req.params
            
            const result=await postService.getPostById(postId as string)
            res.status(200).json({
                success:true,
                message:'get post by post successfully',
                data:result

            })
    } catch (error:any) {
        res.status(500).json({
                success:false,
                message:'does not find any post',
                data:error.message

            })
    }

}


const getMyPosts=async(req:Request,res:Response)=>{
    try {
            const user=req.user
            console.log(user)
            
            const result=await postService.getMyPosts(user?.id as string)
            res.status(200).json({
                success:true,
                message:'get mypost  successfully',
                data:result

            })
    } catch (error:any) {
        res.status(500).json({
                success:false,
                message:'does not get any post',
                data:error.message

            })
    }

}

const updatedPost=async(req:Request,res:Response)=>{
    try {
            const user=req.user
            const{postId}=req.params
            console.log(user)
            const isAdmin=user?.role=== UserRole.ADMIN
            
            const result=await postService.updatedPost(postId as string,req.body,user?.id as string,isAdmin)
            res.status(200).json({
                success:true,
                message:' mypost updated   successfully',
                data:result

            })
    } catch (error:any) {
        res.status(500).json({
                success:false,
                message:'does not updated any post',
                data:error.message

            })
    }

}

const countStats=async(req:Request,res:Response)=>{
    try {
           
            const result=await postService.countStats()
            res.status(200).json({
                success:true,
                message:' get all counts  successfully',
                data:result

            })
    } catch (error:any) {
        res.status(500).json({
                success:false,
                message:'does not get any count',
                data:error.message

            })
    }

}

export const postController={
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatedPost,
    countStats
}