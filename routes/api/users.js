const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const async = require('async')
const path = require('path')

// Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const validateForgotpassInput = require('../../validation/forgotpass')

// Load User model
const User = require('../../models/User')

// @route GET api/users/test
// @desc Register User route
// @access Public

router.get('/test', (req, res) => res.json({ msg: 'User works' }))

// @route GET api/users/register
// @desc Tests users route
// @access Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body)

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists'
			return res.status(400).json(errors)
		} else {
			const newUser = new User({
				name: req.body.name,
				last_name: req.body.last_name,
				email: req.body.email,
				password: req.body.password,
				structure: req.body.structure,
				fonction: req.body.fonction,
				location: req.body.location
			})
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err
					newUser.password = hash
					newUser.save().then((user) => res.json(user)).catch((err) => console.log(err))
				})
			})
		}
	})
})

// @route GET api/users/login
// @desc Login User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body)

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const email = req.body.email
	const password = req.body.password

	// Find user by email
	User.findOne({ email }).then((user) => {
		// Check for user
		if (!user) {
			errors.email = 'User not found'
			return res.status(404).json(errors)
		}
		// Check Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// User Matched
				const payload = {
					id: user.id,
					name: user.name,
					last_name: user.last_name,
					structure: user.structure,
					location: user.location,
					fonction: user.fonction
				} // Create JWT Payload

				// Sign Token
				jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer' + token
					})
				})
			} else {
				errors.password = 'Password incorrect'
				return res.status(400).json(errors)
			}
		})
	})
})
// @route GET api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		email: req.user.email,
		name: req.user.name,
		last_name: req.user.last_name,
		structure: req.user.structure,
		fonction: req.user.fonction,
		location: req.user.location
	})
})

// @route GET api/forgot_password
// @desc Return forgot password
// @access Private
// forgot password
router.get('/forgot', function(req, res) {
	res.render('forgot')
})
router.post('/forgot_password', (req, res) => {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex')
				done(err, token)
			})
		},
		function(token, done) {
			const { errors, isValid } = validateForgotpassInput(req.body)
			// Check Validation

			if (!isValid) {
				return res.status(400).json(errors)
			}
			User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					errors.email = 'User not found'
					return res.status(404).json(errors)
				}

				user.resetPasswordToken = token
				user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

				user.save(function(err) {
					done(err, token, user)
				})
			})
		},
		function(token, user, done) {
			var transporter = nodemailer.createTransport({
				service: 'Hotmail',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: 'mr.souid@live.fr', // generated ethereal user
					pass: 'ad&gjk456' // generated ethereal password
				}
			})

			let mailOptions = {
				from: '"Souhail" <mr.souid@live.fr>', // sender address
				to: user.email,
				replyTo: 'mr.souid@live.fr', // list of receivers
				subject: 'Contact request ✔', // Subject line
				text:
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' +
					'localhost:3000' +
					'/reset/' +
					token +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			}
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error)
				}
				console.log('Message sent: %s', info.messageId)
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
				res.render('contact', { msg: 'Your message has been sent' })
			})
		}
	])
})

router.post('/reset/:token', function(req, res) {
	User.findOne({
		reset_password_token: req.body.token,
		reset_password_expires: {
			$gt: Date.now()
		}
	}).exec(function(err, user) {
		if (!err && user) {
			if (req.body.password === req.body.password2) {
				user.hash_password = bcrypt.hashSync(req.body.password, 10)
				user.reset_password_token = undefined
				user.reset_password_expires = undefined
				user.save(function(err) {
					if (err) {
						return res.status(422).send({
							message: err
						})
					} else {
						var transporter = nodemailer.createTransport({
							service: 'Hotmail',
							port: 587,
							secure: false, // true for 465, false for other ports
							auth: {
								user: 'mr.souid@live.fr', // generated ethereal user
								pass: 'ad&gjk456' // generated ethereal password
							}
						})

						let mailOptions = {
							to: user.email,
							from: '"Souhail" <mr.souid@live.fr>',
							subject: 'Your password has been changed',
							text:
								'Hello,\n\n' +
								'This is a confirmation that the password for your account ' +
								user.email +
								' has just been changed.\n'
						}
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								return console.log(error)
							}
							console.log('Message sent: %s', info.messageId)
							console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
							res.render('contact', { msg: 'Your message has been sent' })
						})
					}
				})
			}
		}
	})
})

// @route Post api/users/api/form
// @desc Return contact details to corpalif
// @access Private
// Contact Form

router.post('/api/form', (req, res) => {
	nodemailer.createTestAccount((err, account) => {
		const htmlEmail = `

		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
		<li>First_name: ${req.body.first_name}</li>
		<li>Last_name: ${req.body.last_name}</li>
		<li>Email: ${req.body.email}</li>
		</ul>
		<h3>Message</h3>
		<p>${req.body.message}</p>

		`
		let transporter = nodemailer.createTransport({
			service: 'Hotmail',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'mr.souid@live.fr', // generated ethereal user
				pass: 'ad&gjk456' // generated ethereal password
			}
		})
		let mailOptions = {
			from: '"Souhail" <mr.souid@live.fr>', // sender address
			to: 'souhailsouid4@gmail.com',
			replyTo: 'mr.souid@live.fr', // list of receivers
			subject: 'Contact request ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: htmlEmail // html body
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error)
			}
			console.log('Message sent: %s', info.messageId)
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
			res.render('contact', { msg: 'Your message has been sent' })
		})
	})
})

module.exports = router
