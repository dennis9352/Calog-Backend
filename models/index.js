import mongoose from 'mongoose'

const connect = () => {
	if (process.env.DEBUG !== 'false') {
		mongoose.set('debug', true)
	}
}

mongoose.connect('mongodb://localhost:27017/admin', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
}, err => {
	if (err) console.error('MongoDB 에러', err)
	else console.log('MongoDB 연결 성공')
})

mongoose.connection.on('error', err => {
	console.error('MongoDB 연결 에러', err)
	connect()
})

connect()