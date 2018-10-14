const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	structure: {
		type: String,
		required: true
	},
	fonction: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String
	}
})
module.exports = User = mongoose.model('users', UserSchema)
