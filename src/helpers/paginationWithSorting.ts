
type IOptions={
    pages?:number|undefined
    limit?:number|undefined
    sortBy?:string
    sortOrder?:string

}

type IOptionsReturn={
    pages:number
    limit:number
    skip:number
    sortBy:string
    sortOrder:string
}
const pagtnationBysorting=(options:IOptions):IOptionsReturn=>{
        const pages:number=Number(options.pages??1)
        const limit:number=Number(options.limit??10)
        const skip:number=(pages-1)*limit
        const sortBy:string=options.sortBy ||"createdAt"
        const sortOrder:string=options.sortOrder||"desc"
        return {
            pages,
            limit,
            skip,
            sortBy,
            sortOrder}




        
}
export default pagtnationBysorting