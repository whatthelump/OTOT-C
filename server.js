// // Adapted from https://www.youtube.com/watch?v=mbsmsi7l3r4

require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username: "Alex",
        title: "Test Post 1"
    },
    {
        username: "Ben",
        title: "Test Post 2"
    }
]

app.get('/posts', authenticateToken, (request, response) => {
    response.json(posts.filter(post => post.username === request.user.name))
})

// Get token, verify correct user, return user for get posts function
function authenticateToken(request, response, next) {

    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // User has not sent a token
    if (token == null) return response.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Token no longer valid
        if (err) return response.sendStatus(403)
        request.user = user
        next()
    })
}   
app.listen(3000)