const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require('express-session')
const KnexSessionStore = require("connect-session-knex")(session)
const db = require('./data/config')
const welcomeRouter = require('./welcome/welcomeRouter')
const usersRouter = require('./users/usersRouter')



const server = express()
const port = process.env.PORT || 4000



server.use(helmet())
server.use(express.json())
server.use(session({
	resave:false, // avoid creating sessions that have not changed
	saveUninitialized: false, //GDPR laws against setting cookies
	secret: "keep it secret, keep it safe", // used to cryptographically sign the cookie
	store: new KnexSessionStore({
		knex: db, // configured instance of knex
		createTable: true, //if the table does not exist, it will create automatically
	})
}))

server.use(welcomeRouter)
server.use(usersRouter)



server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})


server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})