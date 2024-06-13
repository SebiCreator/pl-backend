const { Server } = require("socket.io");
require('dotenv').config();
const http = require('http')
const express = require('express');
const mongoose = require('mongoose');
const mongodbService = require('./mongodbService');



const serverPort = process.env.PORT || 3000;

const app = express();
app.use(express.json());
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})


io.on('connection', (socket) => {
    console.log('socket.id', socket.id)
    socket.on('changeMessage', (msg) => {
        socket.broadcast.emit('changeMessage', msg)
    })
    socket.on('messageFromExtension', (msg) => {
        console.log("messageFromExtension:", msg)
        socket.broadcast.emit('messageToClient', msg)
    })
    socket.on('messageFromClient', (msg) => {
        console.log("messageFromClient:", msg)
        socket.broadcast.emit('messageToExtension', msg)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})


app.get('/', (req, res) => {
    res.send('Hello World!');
})

const connection = process.env.MONGO_DB_URI;

console.log("connection:", connection)

mongoose.connect(connection,)
    .then(res => console.log("Server connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

app.post('/users', async (req, res) => {
    const { email, name, age, motivation, occupation } = req.body;
    console.log(req.body)
    const result = mongodbService.createUser({ email, name, age, motivation, occupation });
    result ? res.send("Success") : res.send("Failed");
})

app.patch('/users', async (req, res) => {
    const result = await mongodbService.changeUserByEmail(req.body);
    result ? res.send("Success") : res.send("Failed");
})

app.get('/users', async (req, res) => {
    const { email } = req.query;
    console.log("e:", email);
    const result = await mongodbService.getUserByEmail({ email });
    result ? res.json(result) : res.send("Failed");
})

app.post('/goals', async (req, res) => {
    const { email, topic, description, focus, subgoals } = req.body;
    console.log(req.body)
    const result = await mongodbService.createGoals({ email, topic, description, focus, subgoals });
    result ? res.send("Success") : res.send("Failed");
})

app.patch('/goals', async (req, res) => {
    const { email, topic, description, focus, subgoals } = req.body;
    const result = await mongodbService.changeGoalsByEmail({ email, topic, description, focus, subgoals });
    result ? res.send("Success") : res.send("Failed");
})

app.get('/goals', async (req, res) => {
    const { email } = req.query
    const result = await mongodbService.getGoalsByEmail({ email });
    result ? res.json(result) : res.send("Failed");
})

app.post('/preferences', async (req, res) => {
    const { email, summary, testTypes } = req.body;
    const result = await mongodbService.createPreferences({ email, summary, testTypes });
    result ? res.send("Success") : res.send("Failed");
})

app.get('/preferences', async (req, res) => {
    console.log("req.query:", req.query)
    const { email } = req.query;
    console.log("email:", email);
    const result = await mongodbService.getPreferencesByEmail({ email });
    result ? res.json(result) : res.send("Failed");
})

app.get('/chatSession', async (req, res) => {
    const { id } = req.query;
    const result = await mongodbService.loadChatSession({ id })
    result ? res.json(result) : res.send("Failed");
})
app.post('/chatSession', async (req, res) => {
    const { id, messages } = req.body;
    const result = await mongodbService.saveChatSession({ id, messages })
    result ? res.send("Success") : res.send("Failed");
})

app.post('/subgoal', async (req, res) => {
    const { email , topic, subgoalTopic, count, maxCount, chatSessionId, difficulty} = req.body;
    const result = await mongodbService.changeSubgoalByEmail({ email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty})
    result ? res.send("Success") : res.send("Failed");
})




app.get('/health', (req, res) => {
    res.send('Server is healthy');
})


server.listen(serverPort, () => {
    console.log('Server is running on port:\t' + serverPort);
})
