import mongoose from 'mongoose'

const uri = 'mongodb+srv://pjh2149:jh920613^^@cluster0.zrncq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	const connect =  async( )=> {
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


connect();

mongoose.connection.on('error', (error)=>{
	console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on('disconnected', ()=>{
	console.error("몽고디비 연결 끊김, 연결 재시도");
	connect();
});






// import dotenv from "dotenv"

// dotenv.config()
// const connect = () => {
// 	if (process.env.DEBUG !== 'false') {
// 		mongoose.set('debug', true)
// 	}
// }
// const IP = process.env.IPADDRESS
// const dbId = process.env.DBID
// const dbPw = process.env.DBPW

// // mongoose.connect('mongodb://localhost:27017/calories', {
// // 	useNewUrlParser: true,
// // 	useUnifiedTopology: true,
// // }, err => {
// // 	if (err) console.error('MongoDB 에러', err)
// // 	else console.log('MongoDB 연결 성공')
// // })

// mongoose.connect(`mongodb://${dbId}:${dbPw}@${IP}:27017/admin`, {
// 	dbName: 'calories',
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// }, err => {
// 	if (err) console.error('MongoDB 에러', err)
// 	else console.log('MongoDB 연결 성공')
// })



// mongoose.connect(`mongodb://${dbId}:${dbPw}@${IP}:27017/admin`, {
// 	dbName: 'calories',
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useCreateIndex: true,
// }, err => {
// 	if (err) console.error('MongoDB 에러', err)
// 	else console.log('MongoDB 연결 성공')
// })


// mongoose.connection.on('error', err => {
// 	console.error('MongoDB 연결 에러', err)
// 	connect()
// })


// connect()