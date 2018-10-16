const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateEducationinput(data) {
	let errors = {}
	;(data.school = !isEmpty(data.school) ? data.school : ''),
		(data.degree = !isEmpty(data.degree) ? data.degree : ''),
		(data.field = !isEmpty(data.field) ? data.field : ''),
		(data.from = !isEmpty(data.from) ? data.from : '')

	if (Validator.isEmpty(data.degree)) {
		errors.degree = 'Education degree is required'
	}
	if (Validator.isEmpty(data.school)) {
		errors.school = 'School field  is required'
	}
	if (Validator.isEmpty(data.field)) {
		errors.field = 'Field of study  is required'
	}
	if (Validator.isEmpty(data.from)) {
		errors.from = 'From date field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
