const express = require('express');
const mongoose = require('mongoose');
const mongodbService = require('./mongodbService');


const app = express();
app.use(express.json());    

app.get('/', (req, res) => {
    res.send('Hello World!');
})
const host = 'localhost';
const port = '27017';
const database = 'pl-backend';

const connection = `mongodb://${host}:${port}/${database}`;

mongoose.connect(connection, )
  .then(res => console.log("Server connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.post('/user', async (req, res) => {
    const { email, name, age, motivation, occupation } = req.body;
    const result = mongodbService.createUser({ email, name, age, motivation, occupation });
    result ? res.send("Success") : res.send("Failed");
})

app.patch('/user', async (req, res) => {
    const result = await mongodbService.changeUserByEmail(req.body);
    result ? res.send("Success") : res.send("Failed");
})

app.get('/user', async (req, res) => {
    const { email } = req.query;
    console.log(email);
    const result = await mongodbService.getUserByEmail({ email});
    result  ? res.json(result) : res.send("Failed");
})

app.post('/goal', async (req, res) => {
    const { userEmail, topic, focus, subgoals, done, lastChanged } = req.body;
    const result = await mongodbService.createGoals({ userEmail, topic, focus, subgoals, done, lastChanged });
    result ? res.send("Success") : res.send("Failed");
})

app.patch('/goal', async (req, res) => {
    const { userEmail, topic, focus, subgoals, done, lastChanged } = req.body;
    const result = await mongodbService.changeGoalsByEmail({ userEmail, topic, focus, subgoals, done, lastChanged });
    result ? res.send("Success") : res.send("Failed");
})

app.get('/goal', async (req, res) => {
    const { userEmail } = req.params
    const result = await mongodbService.getGoalsByUserEmail({ userEmail });
    result ? res.json(result) : res.send("Failed");
})

app.post('/preferences', async (req, res) => {
    const { userEmail, summary, testTypes } = req.body;
    const result = await mongodbService.createPreferences({ userEmail, summary, testTypes });
    result ? res.send("Success") : res.send("Failed");
})

app.get('/preferences', async (req, res) => {
    const { userEmail } = req.params;
    const result = await mongodbService.getPreferencesByUserEmail({ userEmail });
    result ? res.json(result) : res.send("Failed");
})




app.get('/health', (req, res) => {
    res.send('Server is healthy');
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
