const { Server } = require("socket.io");
require('dotenv').config();
const http = require('http')
const express = require('express');
const mongoose = require('mongoose');
const mongodbService = require('./mongodbService');
const langchainService = require('./langchainService');
const serverPort = process.env.PORT || 3000;

const app = express();
app.use(express.json());
const server = http.createServer(app)

/* No Cors  */
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



/*
Gibt "Hello World!" zurück
*/
app.get('/', (req, res) => {
    res.send('Hello World!');
})

const connection = process.env.MONGO_DB_URI;

console.log("MongoDbConnection:\t", connection)


/*
Callback Funktion für die Verbindung mit der MongoDB
Gibt alle Collection der Datenbank aus (für Debugging)
*/
const onConnection = (res) => {
    console.log("Server sucessfully connected to MongoDB")
    console.log({ res })
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
    const { email, name, age, motivation, occupation } = req.body;
    console.log(req.body)
    const result = mongodbService.createUser({ email, name, age, motivation, occupation });
    result ? res.send("Success") : res.send("Failed");
})


/*
Lädt die Benutzerdaten aus der Datenbank
*/
app.get('/users', async (req, res) => {
    const { email } = req.query;
    console.log("e:", email);
    const result = await mongodbService.getUserByEmail({ email });
    result ? res.json(result) : res.send("Failed");
})

/*
Ändert die Benutzerdaten in der Datenbank
*/
app.post('/goals', async (req, res) => {
    const { email, topic, description, focus, subgoals } = req.body;
    console.log(req.body)
    const result = await mongodbService.createGoals({ email, topic, description, focus, subgoals });
    result ? res.send("Success") : res.send("Failed");
})


/*
Lädt die Ziele aus der Datenbank
*/
app.get('/goals', async (req, res) => {
    const { email } = req.query
    const result = await mongodbService.getGoalsByEmail({ email });
    result ? res.json(result) : res.send("Failed");
})

/*
Erzeugt die Präferenzen in der Datenbank
*/
app.post('/preferences', async (req, res) => {
    const { email, summary } = req.body;
    const result = await mongodbService.createPreferences({ email, summary });
    result ? res.send("Success") : res.send("Failed");
})

/*
Ändert die Präferenzen in der Datenbank
*/
app.get('/preferences', async (req, res) => {
    console.log("req.query:", req.query)
    const { email } = req.query;
    console.log("email:", email);
    const result = await mongodbService.getPreferencesByEmail({ email });
    console.log("!!!!!result:", result)
    result ? res.json(result) : res.sendStatus(400);
})

/*
Lädt die ChatSession aus der Datenbank
*/
app.get('/chatSession', async (req, res) => {
    const { id } = req.query;
    const result = await mongodbService.loadChatSession({ id })
    result ? res.json(result) : res.send("Failed");
})

/*
Speichert die ChatSession in der Datenbank
/*
app.post('/chatSession', async (req, res) => {
    const { id, messages } = req.body;
    const result = await mongodbService.saveChatSession({ id, messages })
    result ? res.send("Success") : res.send("Failed");
})

/*
Speichert die Subgoals in der Datenbank
*/
app.post('/subgoal', async (req, res) => {
    const { email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty } = req.body;
    const result = await mongodbService.changeSubgoalByEmail({ email, topic, subgoalTopic, count, maxCount, chatSessionId, difficulty })
    result ? res.send("Success") : res.send("Failed");
})


/*
Prüft ob der Server aktiv ist
*/
app.get('/health', (req, res) => {
    res.send('Server is healthy');
})


/*
Erzeugt eine Zusammenfassung eines PDFs
*/
app.post("/summary", (req, res) => {

    const base64Data = req.body.file;

    const filePath = path.join(__dirname, 'uploads', 'file.pdf');

    const binaryData = Buffer.from(base64Data, 'base64');

    fs.writeFile(filePath, binaryData, error => {
        if (error) {
            return res.status(500).send('Error saving the file');
        }
        const resultFromLangchain = langchainService.summarizePdf(filePath);
        return res.json(resultFromLangchain);

    });

})


server.listen(serverPort, () => {
    console.log('Server is running on port:\t' + serverPort);
})
