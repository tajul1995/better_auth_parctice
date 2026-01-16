import { Request, Response } from "express";
import { commentsService } from "./comments.service";


const createComments=async(req:Request,res:Response)=>{
   try {
               const user= req.user
               console.log(user)
               req.body.authorId=user?.id
               const result= await commentsService.createComments(req.body)
               res.status(200).json({
                   success:true,
                   message:'comments created successfully',
                   data:result
   
               })
           } catch (error:any) {
              res.status(500).json({
                   success:false,
                   message:'comments does not created',
                   data:error.message
   
               }) 
           }


}

const getCommentById=async(req:Request,res:Response)=>{
    try {
               const {commentId}= req.params
               const result= await commentsService.getCommentById(commentId as string)
               res.status(200).json({
                   success:true,
                   message:'comments get by id successfully',
                   data:result
   
               })
           } catch (error:any) {
              res.status(500).json({
                   success:false,
                   message:'comments does not get by id',
                   data:error.message
   
               }) 
           }


}

const getCommentByAuthor=async(req:Request,res:Response)=>{
    try {
               const {authorId}= req.params
               const result= await commentsService.getCommentByAuthor(authorId as string)
               res.status(200).json({
                   success:true,
                   message:'comments get by author successfully',
                   data:result
   
               })
           } catch (error:any) {
              res.status(500).json({
                   success:false,
                   message:'comments does not get by author',
                   data:error.message
   
               }) 
           }


}

const deleteComment=async(req:Request,res:Response)=>{
    try {
               const {commentId}= req.params
               const user=req.user
               const result= await commentsService.deleteComment(commentId as string,user?.id as string)
               res.status(200).json({
                   success:true,
                   message:'comments deleted successfully',
                   data:result
   
               })
           } catch (error:any) {
              res.status(500).json({
                   success:false,
                   message:'comments does not deleted',
                   data:error.message
   
               }) 
           }


}

const moderateComment= async(req:Request,res:Response)=>{
    try {
               const {commentId}=req.params
                // console.log("maderate comment",req.user)
               const result= await commentsService.moderateComment(commentId as string,req.body)
               res.status(200).json({
                   success:true,
                   message:'comments status updated successfully',
                   data:result
   
               })
           } catch (error:any) {
              res.status(500).json({
                   success:false,
                   message:'comments  status does not updated',
                   data:error.message
   
               }) 
           }
}

export const commentController={
    createComments,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    moderateComment
}