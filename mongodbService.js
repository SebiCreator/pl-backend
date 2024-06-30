const UserModel = require('./models/UserModel');
const PreferencesModel = require('./models/PreferencesModel');
const GoalsModel = require('./models/GoalsModel');
const ChatSessionModel = require('./models/ChatSessionModel');


const allUsers = async () => {
    try {
        const result = await UserModel.find();
        return result;
    } catch (error) {
        console.log('Fehler:', error)
        return null
    }
}

const allGoals = async () => {
    try {
        const result = await GoalsModel.find();
        return result;
    } catch (error) {
        console.log('Fehler:', error)
        return null
    }
}

const allPreferences = async () => {
    try {
        const result = await PreferencesModel.find();
        return result;
    } catch (error) {
        console.log('Fehler:', error)
        return null
    }
}

const allSessions = async () => {
    try {
        const result = await ChatSessionModel.find();
        return result;
    } catch (error) {
        console.log('Fehler:', error)
        return null
    }
}

const getDBOverview = ( ) => {
    allSessions()
        .then(res => console.log('Sessions:', res))
        .catch(err => console.log('Fehler:', err))
    allGoals()
        .then(res => console.log('Goals:', res))
        .catch(err => console.log('Fehler:', err))
    allPreferences()
        .then(res => console.log('Preferences:', res))
        .catch(err => console.log('Fehler:', err))
    allUsers()
        .then(res => console.log('Users:', res))
        .catch(err => console.log('Fehler:', err))
}


const loadChatSession = async ({ id }) => {
    try {
        const result = await ChatSessionModel.findOne({ id });
        return result || { id, messages: [] };
    } catch (error) {
        console.log('Fehler:', error)
        return null
    }
}
const saveChatSession = async ({ id, messages }) => {
    const filter = { id }
    const update = { id, messages }
    const options = { new: true, upsert: true }
    try {
        const result = await ChatSessionModel.findOneAndUpdate(filter, update, options)
        return true
    } catch (error) {
        console.log('Fehler:', error)
        return false
    }
}


const createUser = async ({ email, name, age, motivation, occupation, sex, language }) => {
    const filter = { email }
    const update = { email, name, age, motivation, occupation, sex, language }
    console.log('Update:', update)
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
            { $set: { name: name, age: age, motivation: motivation, occupation: occupation } }
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

const createGoals = async ({ email, topic, description, focus, subgoals }) => {
    const filter = { topic, email }
    const update = { email, focus, description, subgoals }

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

const changeSubgoalByEmail = async ({ email, topic,subgoalTopic, count, maxCount, chatSessionId, difficulty }) => {
    try{
        const result = await GoalsModel.updateOne({
            email: email,
            topic: topic,
            'subgoals.topic': subgoalTopic,
        }, {
            $set: { 'subgoals.$.count': count, 'subgoals.$.maxCount': maxCount, 'subgoals.$.chatSessionId': chatSessionId, 'subgoals.$.difficulty': difficulty }
        });
        console.log('Update erfolgreich:', result);
        return true
    } catch (error) {
        console.log('Fehler:', error)
        return false

    }
}

const changeGoalsByEmail = async ({ email, topic, focus, description, subgoals }) => {
    try {
        const result = await GoalsModel.updateOne({
            email: email
        }, {
            $set: { topic: topic, focus: focus, description: description, subgoals: subgoals }
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

const createPreferences = async ({ summary, testTypes, email }) => {
    const filter = { email }
    const update = { summary, email }
    const options = { new: true, upsert: true }
    try {
        const result = await PreferencesModel.findOneAndUpdate(filter, update, options)
        console.log('Resultyyy:', result)
        return true

    }
    catch (err) {
        console.log('Fehleryyy:', err)
        return false
    }
}


const getPreferencesByEmail = async ({ email }) => {
    try {
        console.log('Emailxxx:', email)    
        const result = await PreferencesModel.findOne({ email })
        console.log('Resultxxx:', result)
        const text = result ? result.summary : ''
        return text;
    }
    catch (err) {
        console.log('Fehlerxxx:', err)
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
    loadChatSession,
    saveChatSession,
    changeSubgoalByEmail,
    getDBOverview
}


