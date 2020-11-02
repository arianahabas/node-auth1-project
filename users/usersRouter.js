const express = require("express")
const bcrypt = require('bcryptjs')
const Users = require('./usersModel')
const { restrict } = require('./usersMiddleware')
 
const router = express.Router()

router.post('/api/register', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        //check to see if the username already exists
        if(user){
            return res.status(409).json({
                message: "username already taken"
            })
        }

        const newUser = await Users.add({
            username,
            // hash the password with a time complexity of 14, in this case (want it to take 1-2 seconds)
            password: await bcrypt.hash(password, 14)
        }) 

        res.status(201).json(newUser)

    } catch (err) {
        next(err)
    }
})
//Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.

router.post("/api/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (!user) {
			return res.status(401).json({
				message: "You shall not Pass!",
			})
		}
		// will be true or false depending on whether the password matched the hash
		const passwordValid = await bcrypt.compare(password, user.password)

		if(!passwordValid){
			return res.status(401).json({
				message: "You shall not Pass!",
		})
		}

		//creates a new session and sends it back to the client
		req.session.user = user

		res.json({
			message: `Welcome ${user.username}! You've been logged in successfully!`,
		})
	} catch(err) {
		next(err)
	}
})

//Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'

router.get('/api/users', restrict(), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch (err) {
        next(err)
    }
})
//If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.


module.exports = router