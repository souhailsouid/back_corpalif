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
		errors.registerName = 'Name must be between 2 and 30 characters'
	}

	if (Validator.isEmpty(data.name)) {
		errors.registerName = 'Name field is required'
	}
	if (!Validator.isLength(data.last_name, { min: 2, max: 30 })) {
		errors.registerLast_name = 'Last_name must be between 2 and 30 characters'
	}
	if (Validator.isEmpty(data.last_name)) {
		errors.registerLast_name = 'Last_name field is required'
	}
	if (Validator.isEmpty(data.structure)) {
		errors.registerStructure = 'Structure field is required'
	}
	if (Validator.isEmpty(data.location)) {
		errors.registerLocation = 'Location field is required'
	}
	if (Validator.isEmpty(data.fonction)) {
		errors.registerFonction = 'Fonction field is required'
	}
	if (Validator.isEmpty(data.email)) {
		errors.registerEmail = 'Email field is required'
	}
	if (!Validator.isEmail(data.email)) {
		errors.registerEmail = 'Email is invalid'
	}
	if (Validator.isEmpty(data.password)) {
		errors.registerPassword = 'Password field is required'
	}
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.registerPassword = 'Password must be at least 6 characters'
	}
	if (Validator.isEmpty(data.password2)) {
		errors.registerPassword2 = 'Confirm Password field is required'
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.registerPassword2 = 'Passwords must match'
	}
	return {
		errors,
		isValid: isEmpty(errors)
	}
}
