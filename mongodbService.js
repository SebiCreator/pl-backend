const UserModel = require('./models/UserModel');
const PreferencesModel = require('./models/PreferencesModel');
const GoalsModel = require('./models/GoalsModel');
const e = require('express');



const createUser = async ({ email, name, age, motivation, occupation, sex, language }) => {
    const filter = { email }
    const update = { email, name, age, motivation, occupation, sex, language }
    const options = { new: true, upsert: true }
    try {
        const result = await UserModel.findOneAndUpdate(filter, update, options)
        console.log('Result:', result)
        return true

    }
    catch (err) {
        console.log('Fehler:', err)
        return false
    }
}


const changeUserByEmail = async ({ email, name, age, motivation, occupation }) => {
    try {
        const result = await UserModel.updateOne(
            { email },
            { $set: { name: name , age: age, motivation: motivation, occupation: occupation } }
        );
        console.log('Update erfolgreich:', result);
        return result;
    } catch (error) {
        console.log('Fehler:', error)
        return false
    }
}

const getUserByEmail = async ({ email }) => {
    try {
        console.log('Email:', email)
        const result = await UserModel.findOne({ email });
        console.log('Result:', result)
        return result;
    }
    catch (err) {
        console.log('Fehler:', err)
        return null
    }
}

const createGoals = async ({ email, topic, focus, subgoals, done, lastChanged }) => {
    const filter = { topic,email }
    const update = { email , focus, subgoals, done, lastChanged}

    const options = { new: true, upsert: true }
    try {
        const result = await GoalsModel.findOneAndUpdate(filter, update, options)
        console.log('Result:', result)
        return true

    }
    catch (err) {
        console.log('Fehler:', err)
        return false
    }
}

const changeGoalsByEmail = async ({ email, topic, focus, subgoals, done, lastChanged }) => {
    try {
        const result = await GoalsModel.updateOne({
            email: email
        }, {
            $set: { topic: topic, focus: focus, subgoals: subgoals, done: done, lastChanged: lastChanged }
        });
        console.log('Update erfolgreich:', result);
        return true
    }
    catch (err) {
        console.log('Fehler:', err)
        return false
    }
}

const getGoalsByEmail = async ({ email }) => {
    try {
        console.log('Email:', email)
        const result = await GoalsModel.find({ email });
        console.log('Result:', result)
        return result;
    }
    catch (err) {
        console.log('Fehler:', err)
        return null
    }
}

const createPreferences = async ({ summary, testTypes, email}) => {
    const filter = { email }
    const update = { summary, testTypes, email }
    const options = { new: true, upsert: true }
    try {
        const result = await PreferencesModel.findOneAndUpdate(filter, update, options)
        console.log('Result:', result)
        return true

    }
    catch (err) {
        console.log('Fehler:', err)
        return false
    }
}

const getPreferencesByEmail = async ({ email }) => {
    try {
        const result = await PreferencesModel.findOne({ email})
        console.log('Result:', result)
        return result;
    }
    catch (err) {
        console.log('Fehler:', err)  
        return null
    }
}

module.exports = {
    createUser,
    changeUserByEmail,
    createGoals,
    changeGoalsByEmail,
    createPreferences,
    getUserByEmail,
    getGoalsByEmail,
    getPreferencesByEmail,
}


