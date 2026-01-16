import { Payload } from './../../../generated/prisma/internal/prismaNamespace';
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { boolean } from 'better-auth/*';

const createPost=async(data:Omit<Post,"id"|"createdAt"|"updatedAt"|"authorId">,id:string)=>{
    return await prisma.post.create({
        data:{
            ...data,
            authorId:id
        }

        

    })
}
const getAllPost=async(payload:{search:string|undefined,tags:string[]|[]},isFeatured:boolean,status:PostStatus|undefined,authorId:string|undefined,pages:number,limit:number,skip:number,sortBy:string,sortOrder:string)=>{
    
    const andCondition:PostWhereInput[]=[]
    if(payload.search){
        andCondition.push({ OR:[
                {
                    title:{
                contains:payload.search as string,
                mode:"insensitive"
            },
                },{
                    content:{
                contains:payload.search as string,
                mode:'insensitive'
            }
                },
                {
                    tags:{
                        has:payload.search as string
                    }
                }
            ]})
    }
    if(payload.tags.length >0){
        andCondition.push({tags:{
                hasEvery:payload.tags
            }
})
    }
    if(typeof isFeatured === 'boolean'){
        andCondition.push({
            isFeatured
        })
    }
    if(status){
        andCondition.push({
            status
        })
    }
    if(authorId){
        andCondition.push({authorId})
    }
    const allPost= await prisma.post.findMany({
        take:limit,
        skip,
        where:{
           AND:andCondition
            
            
            
        },
        orderBy:{
            [sortBy]:sortOrder
        },
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }

        
    })
    const postCount= await prisma.post.count({
        where:{
           AND:andCondition
            
            
            
        }
    })
    return {
        data:allPost,
        pagination:{
            totalpost:postCount,
            pages,
            limit,
            totalPages:Math.ceil(postCount/limit)
        }
    }
}

const getPostById= async(id:string)=>{

return await prisma.$transaction(async(tx)=>{
    await tx.post.update({
        where:{
            id
        },
        data:{
            views:{
                increment:1
            }
        }
    })
    const result= await tx.post.findUniqueOrThrow({
        where:{
            id
        },
        include:{
            comments:{
                where:{
                    parentId:null,
                    status:CommentStatus.APPROVED
                },
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    replies:{
                        where:{status:CommentStatus.APPROVED},
                        orderBy:{
                    createdAt:"asc"
                },
                        include:{
                            replies:{
                                where:{status:CommentStatus.APPROVED},
                                orderBy:{
                    createdAt:"asc"
                },
                                include:{
                                    replies:{
                                        where:{status:CommentStatus.APPROVED},
                                        orderBy:{
                    createdAt:"asc"
                },
                      
                                    },
                                              }
                            }
                        }
                    }
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }
        }
    })
    return result
})

    
}


const getMyPosts=async(authorId:string)=>{
    await prisma.user.findFirstOrThrow({
        where:{
            id:authorId,
            status:"ACTIVE"
        }
    })
    const result= await prisma.post.findMany({
        where:{
            authorId
        },
        include:{
            _count:{
                select:{
                    comments:true
                }
            }
        }
    })
const total= await prisma.post.count({
    where:{
        authorId
    }
})
return {
    data:result,
    total
}

}
    
const updatedPost=async(postId:string,data:Partial<Post>,authorId:string,isAdmin:boolean)=>{
    // authorId dia check korly another author r post pabo na .r admin shobar post update korty parby na
    const postData= await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })
    if(!isAdmin&&(postData.authorId!==authorId)){
        throw new Error("you are not owner of this post")
    }
    if(!isAdmin){
        delete data.isFeatured
    }
     return await prisma.post.update({
        where:{
            id:postId
        },
        data
     })

}    

const countStats= async()=>{
    return await prisma.$transaction(async(tx)=>{
        const [totalPost,publishedPost,draftPost,totalComments,approvedComments,rejectComments,totalUser,adminUser,normalUser,totalViews]= await Promise.all([
              await tx.post.count(),
         await tx.post.count({
            where:{
                status:PostStatus.PUBLISHED
            }
        }),
         await tx.post.count({
            where:{
                status:PostStatus.DRAFT
            }

        }),
        
         await tx.comment.count(),
        await tx.comment.count({
            where:{
                status:CommentStatus.APPROVED
            }
        }),
        await tx.comment.count({
            where:{
                status:CommentStatus.REJECT
            }
        }),
        await tx.user.count(),
        await tx.user.count({
            where:{
                role:"ADMIN"
            }
        }),
        await tx.user.count({
            where:{
                role:"USER"
            }
        }),
        await tx.post.aggregate({
            _sum:{
                views:true
            }
        })

        ])

       
        return {
        totalPost,
        publishedPost,
        draftPost,
        totalComments,
        approvedComments,
        rejectComments,
        totalUser,
        adminUser,
        normalUser,
        totalViews:totalViews._sum.views



    }

    })
    

}


export const postService={
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatedPost,
    countStats
}