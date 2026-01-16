import app from "./app";
import { prisma } from "./lib/prisma";
const port=process.env.PORT || 5000

async function server(){
    try {
        await prisma.$connect()
        console.log("database is connected to the postgres")
        app.listen(port,()=>{
            console.log(`database is connected on ${port}`)
        })
    } catch (error) {
        await prisma.$disconnect()
        process.exit(1)
    }
}
server()