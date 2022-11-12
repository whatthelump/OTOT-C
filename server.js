require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Alex',
    title: 'Test Post 1'
  },
  {
    username: 'Ben',
    title: 'Test Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  // Only return posts user has access to
  res.json(posts.filter(post => post.username === req.user.name))
})

// Get token sent, verify correct user, return user for get post function
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  // User has not sent token
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    // Token is no longer valid
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)