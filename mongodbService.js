const UserModel = require('./models/UserModel');
const PreferencesModel = require('./models/PreferencesModel');
const GoalsModel = require('./models/GoalsModel');


const createUser = async ({ email, name, age, motivation, occupation }) => {
    try {
        const result = await UserModel.create({
            email, name, age, motivation, occupation
        })
        return true

    }
    catch (err) {
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
        return false
    }
}

const getUserByEmail = async ({ email }) => {
    try {
        const result = await UserModel.findOne({ email });
        return result;
    }
    catch (err) {
        console.log('Fehler:', err)
        return null
    }
}

const createGoals = async ({ userEmail, topic, focus, subgoals, done, lastChanged }) => {
    try {
        const result = await GoalsModel.create({
            userEmail, topic, focus, subgoals, done, lastChanged
        })
        return true

    }
    catch (err) {
        return false
    }
}

const changeGoalsByEmail = async ({ userEmail, topic, focus, subgoals, done, lastChanged }) => {
    try {
        const result = await GoalsModel.updateOne({
            userEmail: userEmail
        }, {
            $set: { topic: topic, focus: focus, subgoals: subgoals, done: done, lastChanged: lastChanged }
        });
        return true
    }
    catch (err) {
        return false
    }
}

const getGoalsByEmail = async ({ userEmail }) => {
    try {
        const result = await GoalsModel.findOne({ userEmail });
        return result;
    }
    catch (err) {
        return null
    }
}

const createPreferences = async ({ summary, testTypes, userEmail }) => {
    try {
        const result = await PreferencesModel.create({
            summary, testTypes, userEmail
        })
        return true

    }
    catch (err) {
        return false
    }
}

const getPreferencesByEmail = async ({ userEmail }) => {
    try {
        const result = await PreferencesModel.findOne({ userEmail})
        return result;
    }
    catch (err) {
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


