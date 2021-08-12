import mongoose from 'mongoose'

const uri = 'mongodb+srv://pjh2149:jh920613^^@cluster0.zrncq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const connect2 =  async( )=> {
    try{
        await mongoose.connect(uri,{
            dbName: 'local2',
            useNewUrlParser: true,
            useFindAndModify: false,
            userCreateIndex: true
        });
        console.log('서버 연결됨')
    }catch(error){
        console.error(error);
    }
}


connect2();

mongoose.connection.on('error', (error)=>{
console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on('disconnected', ()=>{
console.error("몽고디비 연결 끊김, 연결 재시도");
connect();
});





