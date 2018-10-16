const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	handle: {
		type: String,
		required: true,
		max: 40
	},
	company: {
		type: String
	},
	structure: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},

	experience: [
		{
			title: {
				type: String,
				required: true
			},
			company: {
				type: String,
				required: true
			},
			location: {
				type: String,
				required: true
			},
			from: {
				type: Date,
				required: true
			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			},
			skills: {
				type: [ String ],
				required: true
			}
		}
	],
	education: [
		{
			school: {
				type: String,
				required: true
			},
			degree: {
				type: String,
				required: true
			},
			field: {
				type: String,
				required: true
			},
			from: {
				type: Date,
				required: true
			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,
				default: false
			},
			location: {
				type: String
			},
			skills: {
				type: [ String ],
				required: true
			}
		}
	],
	social: {
		linkedin: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
})
module.exports = Profile = mongoose.model('profile', ProfileSchema)
