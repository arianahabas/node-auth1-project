const bcrypt = require('bcryptjs')
const Users = require('./usersModel')

function restrict() {
    return async (req, res, next) => {
        try {
            // const { username, password } = req.headers
            // //make sure the values are not empty
            // if (!username || !password){
            //     return res.status(401).json({
            //         message:"invalid credentials"
            //     })
            // }
            // //make sure the user exists
            // const user = await Users.findBy({username}).first()
            
            // if (!user){
            //     return res.status(401).json({
            //         message: "invalid credentials"
            //     })
            // }

            // const passwordValid = await bcrypt.compare(password, user.password)
            // if (!passwordValid){
            //     return res.status(401).json({
            //         message: "invalid credentials"
            //     })
            // }

            if (!req.session || !req.session.user ){
                return res.status(401).json({
                    message: "you shall not pass"
                })
            }
            //everything validated, we're good to go
            next()

        } catch (err) {
            next(err)
        }
    }
}

module.exports = {
    restrict,
}