import { Payload } from './../../../generated/prisma/internal/prismaNamespace';
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"

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
export const postService={
    createPost,
    getAllPost,
    getPostById
}