import { prisma } from "../../lib/prisma"

const createComments=async(data:{content:string,authorId:string,postId:string,parentId?:string})=>{
    await prisma.post.findUniqueOrThrow({
        where:{
            id:data.postId
        }
    })
    if(data.parentId){
         await prisma.comment.findUniqueOrThrow({
            where:{
                id:data.parentId
            }
        })
    }
      return await prisma.comment.create({
        data
    })
}

const getCommentById=async(id:string)=>{
    return await prisma.comment.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    views:true
                }
            }
        }
    })
}

const getCommentByAuthor=async(authorId:string)=>{
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    views:true
                }
            }
        }
    })
}

const deleteComment=async(commentId:string,authorId:string)=>{
    const findComment= await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        }
    })
    return  await prisma.comment.delete({
        where:{
            id:commentId
        }
    })
}

export const commentsService={
    createComments,
    getCommentById,
    getCommentByAuthor,
    deleteComment
}