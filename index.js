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



/* 
Websockets 
*/
io.on('connection', (socket) => {
    console.log('socket.id', socket.id)
    socket.on('changeMessage', (msg) => {
        console.log("Got message from client:")
        console.log({msg})
        console.log("-------------------")
        socket.broadcast.emit('changeMessage', msg)
    })
    socket.on('messageFromExtension', (msg) => {
        console.log("Got message from extension:")
        console.log({msg})
        console.log("-------------------")
        socket.broadcast.emit('messageToClient', msg)
    })
    socket.on('messageFromClient', (msg) => {
        console.log("Got message from client:")
        console.log({msg})
        console.log("-------------------")
        socket.broadcast.emit('messageToExtension', msg)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})




const connection = process.env.MONGO_DB_URI;

console.log("MongoDbConnection:\t", connection)


/*
Callback Funktion für die Verbindung mit der MongoDB
Gibt alle Collection der Datenbank aus (für Debugging)
*/
const onConnection = (res) => {
    console.log("Server sucessfully connected to MongoDB")
    //mongodbService.getDBOverview()
}


/*
Verbindet den Server mit der MongoDB
*/
mongoose.connect(connection,)
    .then(res => onConnection(res))
    .catch(err => console.error("Error connecting to MongoDB:", err));

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
})
mongoose.connection.on('connected', async () => {
    console.log('MongoDB connected');
    console.log(await mongoose.connection.db.listCollections().toArray())

})


/*
Erzeugt einen neuen Benutzer in der Datenbank
*/
app.post('/users', async (req, res) => {
    const { email, name, age, motivation, occupation,language } = req.body;
    console.log("Called POST /users")
    console.log({
        email, name, age, motivation, occupation
    })
    const result = mongodbService.createUser({ email, name, age, motivation, occupation, language });
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.send("Success")
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})


/*
Lädt die Benutzerdaten aus der Datenbank
*/
app.get('/users', async (req, res) => {
    const { email } = req.query;
    console.log("Called GET /users")
    console.log({ email })
    const result = await mongodbService.getUserByEmail({ email });
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.json(result)
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Ändert die Benutzerdaten in der Datenbank
*/
app.post('/goals', async (req, res) => {
    const { email, topic, description, focus, subgoals } = req.body;
    console.log("Called POST /goals")
    console.log({
        email, topic, description, focus, subgoals
    })
    const result = await mongodbService.createGoals({ email, topic, description, focus, subgoals });
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.send("Success")
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})


/*
Lädt die Ziele aus der Datenbank
*/
app.get('/goals', async (req, res) => {
    const { email } = req.query
    console.log("Called GET /goals")
    console.log({ email })
    const result = await mongodbService.getGoalsByEmail({ email });

    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.json(result)
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Erzeugt die Präferenzen in der Datenbank
*/
app.post('/preferences', async (req, res) => {
    const { email, summary } = req.body;
    console.log("Called POST /preferences")
    console.log({
        email, summary
    })
    const result = await mongodbService.createPreferences({ email, summary });
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.send("Success")
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Ändert die Präferenzen in der Datenbank
*/
app.get('/preferences', async (req, res) => {
    const { email } = req.query;
    console.log("Called GET /preferences")
    console.log({ email })
    const result = await mongodbService.getPreferencesByEmail({ email });
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.json(result)
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Lädt die ChatSession aus der Datenbank
*/
app.get('/chatSession', async (req, res) => {
    const { id } = req.query;
    console.log("Called GET /chatSession")
    console.log({ id })
    const result = await mongodbService.loadChatSession({ id })
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.json(result)
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Speichert die ChatSession in der Datenbank
*/
app.post('/chatSession', async (req, res) => {
    const { id, messages } = req.body;
    console.log("Called POST /chatSession")
    console.log({
        id, messages
    })
    const result = await mongodbService.saveChatSession({ id, messages })
    if (result) {
        console.log("Sending: Success")
        console.log("-------------------")
        res.send("Success")
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")
    }
})

/*
Speichert die Subgoals in der Datenbank
*/
app.post('/subgoal', async (req, res) => {
    const { email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty } = req.body;
    console.log("Called POST /subgoal")
    console.log({
        email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty
    })
    const result = await mongodbService.changeSubgoalByEmail({ email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty })
    if(result){
        console.log("Sending: Success")
        console.log("-------------------")
        res.send("Success")
    } else {
        console.log("Sending: Failed")
        console.log("-------------------")
        res.send("Failed")

    }
})


/*
Prüft ob der Server aktiv ist
*/
app.get('/health', (req, res) => {
    res.send('Server is healthy');
})




server.listen(serverPort, () => {
    console.log('Server is running on port:\t' + serverPort);
})
