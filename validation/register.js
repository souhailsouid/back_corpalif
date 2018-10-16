const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterinput(data) {
	let errors = {}
	;(data.name = !isEmpty(data.name) ? data.name : ''),
		(data.last_name = !isEmpty(data.last_name) ? data.last_name : ''),
		(data.email = !isEmpty(data.email) ? data.email : ''),
		(data.structure = !isEmpty(data.structure) ? data.structure : ''),
		(data.fonction = !isEmpty(data.fonction) ? data.fonction : ''),
		(data.location = !isEmpty(data.location) ? data.location : ''),
		(data.password = !isEmpty(data.password) ? data.password : ''),
		(data.password2 = !isEmpty(data.password2) ? data.password2 : '')

	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Name must be between 2 and 30 characters'
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required'
	}
	if (!Validator.isLength(data.last_name, { min: 2, max: 30 })) {
		errors.last_name = 'Last_name must be between 2 and 30 characters'
	}
	if (Validator.isEmpty(data.last_name)) {
		errors.last_name = 'Last_name field is required'
	}
	if (Validator.isEmpty(data.structure)) {
		errors.structure = 'Structure field is required'
	}
	if (Validator.isEmpty(data.location)) {
		errors.location = 'Location field is required'
	}
	if (Validator.isEmpty(data.fonction)) {
		errors.fonction = 'Fonction field is required'
	}
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	}
	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters'
	}
	if (Validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm Password field is required'
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords must match'
	}
	return {
		errors,
		isValid: isEmpty(errors)
	}
}
