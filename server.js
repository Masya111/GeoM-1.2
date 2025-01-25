const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;


const url = "mongodb+srv://maksimvasilenko223:Agurecfantastik887@cluster0.xbz9sbz.mongodb.net/GeoM?retryWrites=true&w=majority&appName=Cluster0";

let db;

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('GeoM');
        console.log('Подключение к MongoDB установлено');
        startServer();
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', err);
    }
}

function startServer() {
    app.use(cors());
    app.use(bodyParser.json());

    app.post('/api/register', async (req, res) => {
        const userData = req.body;
        console.log('Получены данные для регистрации:', userData);

        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }

            const collection = db.collection('User');
            const result = await collection.insertOne(userData);
            console.log('Результат вставки данных:', result);
            res.status(201).json({ message: 'Пользователь зарегистрирован', userId: result.insertedId });
        } catch (error) {
            console.error('Ошибка вставки данных пользователя:', error);
            res.status(500).json({ message: 'Ошибка регистрации пользователя' });
        }
    });

    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }

            const collection = db.collection('User');
            const userByName = await collection.findOne({ name: username });
            const userByEmail = await collection.findOne({ email: username });

            if (userByName && userByName.password === password) {
                res.status(200).json({ message: 'Успешный вход', userId: userByName._id });
            } else if (userByEmail && userByEmail.password === password) {
                res.status(200).json({ message: 'Успешный вход', userId: userByEmail._id });
            } else {
                res.status(401).json({ message: 'Неправильный логин или пароль' });
            }
        } catch (error) {
            console.error('Ошибка при входе пользователя:', error);
            res.status(500).json({ message: 'Ошибка при входе' });
        }
    });
    app.post('/api/updateScoreFast', async (req, res) => {
        const { userId, newScore } = req.body;

        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }

            const collection = db.collection('User');
            const user = await collection.findOne({ _id: new ObjectId(userId) });

            if (user) {
                if (newScore > user.score_fast) {
                    await collection.updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { score_fast: newScore } }
                    );
                    res.status(200).json({ message: 'Score_fast updated successfully' });
                } else {
                    res.status(400).json({ message: 'New score_fast is not greater than current score_fast' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении score_fast:', error);
            res.status(500).json({ message: 'Ошибка при обновлении score_fast' });
        }
    });
    app.post('/api/updateScoreQuiz', async (req, res) => {
        const { userId, newScore } = req.body;

        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }

            const collection = db.collection('User');
            const user = await collection.findOne({ _id: new ObjectId(userId) });

            if (user) {
                if (newScore > user.score_quiz) {
                    await collection.updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { score_quiz: newScore } }
                    );
                    res.status(200).json({ message: 'Score_quiz updated successfully' });
                } else {
                    res.status(400).json({ message: 'New score_quiz is not greater than current score_quiz' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении score_quiz:', error);
            res.status(500).json({ message: 'Ошибка при обновлении score_quiz' });
        }
    });
    app.post('/api/updateScoreFlag', async (req, res) => {
        const { userId, newScore } = req.body;

        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }

            const collection = db.collection('User');
            const user = await collection.findOne({ _id: new ObjectId(userId) });

            if (user) {
                if (newScore > user.score_flag) {
                    await collection.updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { score_flag: newScore } }
                    );
                    res.status(200).json({ message: 'Score_flag updated successfully' });
                } else {
                    res.status(400).json({ message: 'New score_flag is not greater than current score_flag' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении score_flag:', error);
            res.status(500).json({ message: 'Ошибка при обновлении score_flag' });
        }
    });
    app.get('/api/facts', async (req, res) => {
        const place = req.query.place;
        
        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }
    
            const collection = db.collection('facts');
            const country = await collection.findOne({ name: place });
    
            if (country) {
                res.status(200).json(country);
            } else {
                res.status(404).json({ message: 'Страна не найдена' });
            }
        } catch (error) {
            console.error('Ошибка при получении данных о стране:', error);
            res.status(500).json({ message: 'Ошибка при получении данных' });
        }
    });
    app.get('/api/quiz_questions', async (req, res) => {
        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }
    
            const collection = db.collection('quiz_questions');
            const quizQuestions = await collection.find({}).toArray();
    
            if (quizQuestions.length > 0) {
                res.status(200).json(quizQuestions);
            } else {
                res.status(404).json({ message: 'Вопросы для викторины не найдены' });
            }
        } catch (error) {
            console.error('Ошибка при получении данных о викторине:', error);
            res.status(500).json({ message: 'Ошибка при получении данных' });
        }
    });
    app.get('/api/ukraine_questions', async (req, res) => {
        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }
    
            const collection = db.collection('ukraine_questions');
            const questions = await collection.find({}).toArray();
    
            if (questions.length > 0) {
                res.status(200).json(questions);
            } else {
                res.status(404).json({ message: 'Вопросы для викторины не найдены' });
            }
        } catch (error) {
            console.error('Ошибка при получении данных о викторине:', error);
            res.status(500).json({ message: 'Ошибка при получении данных' });
        }
    });
    app.get('/api/player_stats', async (req, res) => {
        try {
            if (!db) {
                console.error('База данных не инициализирована');
                return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
            }
    
            const collection = db.collection('User');
            const players = await collection.find({}).toArray();
    
            if (players.length > 0) {
                res.status(200).json(players);
            } else {
                res.status(404).json({ message: 'Игроки не найдены' });
            }
        } catch (error) {
            console.error('Ошибка при получении данных о игроках:', error);
            res.status(500).json({ message: 'Ошибка при получении данных' });
        }
    });

    app.listen(port, () => {
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
}


connectToDatabase();