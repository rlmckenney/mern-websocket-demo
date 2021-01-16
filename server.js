const mongoose = require('mongoose')
const express = require('express')
const http = require('http')
const path = require('path')

// Connect to the Mongo DB
mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/myawesomeapp',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log(`Connected to MongoDB ...`)
  })
  .catch(err => {
    console.log(`Error connecting to MongoDB ...`, err.message)
    process.exit(1)
  })

// Create the Express app
const app = express()

// Define middleware here
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Serve up static assets when in production (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

// Define API routes here
app.use('/api/cats', require('./routes/cats'))

// This is a fall-back for development mode.
// Send every other request to the React app.
// Define all other valid API routes before this one.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// Create the http server with the Express app as the route handlers
const httpServer = http.createServer(app)

// Pass the http server to socket.io
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*'
  }
})

const Message = require('./models/Message')
const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage'
io.on('connection', socket => {
  // Join a conversation
  const {roomId} = socket.handshake.query
  socket.join(roomId)

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, async data => {
    // Save to database
    const newMessage = new Message(data)
    await newMessage.save()
    // Broadcast back to all connected clients
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, newMessage.toJSON())
  })

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId)
  })
})

// Start the HTTP server listing for requests
const PORT = process.env.PORT || 3001
httpServer.on('listening', () =>
  console.log(`🌎 ==> API server now on port ${PORT}!`)
)
httpServer.listen(PORT)
