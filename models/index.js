import mongoose from 'mongoose'

const connect = () => {
	if (process.env.DEBUG !== 'false') {
		mongoose.set('debug', true)
	}
}

mongoose.connect('mongodb://52.79.134.64/:27017/admin', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	user:"test",
	pass:"test"
}, err => {
	if (err) console.error('MongoDB 에러', err)
	else console.log('MongoDB 연결 성공')
})

mongoose.connection.on('error', err => {
	console.error('MongoDB 연결 에러', err)
	connect()
})

connect()