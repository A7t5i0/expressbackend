const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/MERNtemplate'); for local mongodb
mongoose.connect('mongodb+srv://seb:1234@cluster0.pwuh9.mongodb.net/Cluster0?retryWrites=true&w=majority');

app.get('/', async (req,res) => {
  res.json('Welcome to the backend server!')
})

app.post('/api/register', async (req,res) => {
    console.log(req.body)
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    } catch (err) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
})

app.post('/api/login', async (req,res) => {
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user) {
        return { status: 'error', error: 'Invalid login'}
    }

    const isPasswordValid = await compare(
        req,body.password,
        user.password
    )

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secret1234'
        )

        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'error', user: false})
    }
})

app.post('/api/bug', async (req,res) => {
    console.log(req.body)
    try{
        await User.create({
            buggedFeature: req.body.buggedFeature,
            assignedTo: req.body.assignedTo,
            fixedStatus: req.body.fixedStatus,
        })
        res.json({status: 'ok'})
    } catch (err) {
        res.json({status: 'error', error: 'Bug already exists'})
    }
})

app.get('/api/bug', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret1234')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return(
            res.json({status: 'ok',
            buggedFeature: user.buggedFeature,
            assignedTo: user.assignedTo,
            fixedStatus: user.fixedStatus})
        )

    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
