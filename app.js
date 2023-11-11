/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// models
const User = require('./models/User')

const app = express()

// Config JSON response
app.use(express.json())

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

// Register User
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmPassword} = req.body

    // validations
    if(!name){
        return res.status(422).json({msg: "O nome é obrigatório! "}) // 422: Requisão entendida pelo servidor, porém os dados estão incorretos!
    }
    if(!email){
        return res.status(422).json({msg: "O email é obrigatório! "}) 
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatório! "})
    }
    if(password!== confirmPassword) {
        return res.status(422).json({msg: "A senhas não conferem! "})
    }

    // check if user exists
    const userExists = await User.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({msg: 'Por favor, utilize outro email! '})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        email,
        password
    })

    try {
        await user.save() // save: Salva o usuário no bd
    
        res.status(201).json({msg: "Usuário cadastrado com sucesso!"})
    } catch(error) {
        res.status(500).json({msg: 'Algo inesperado ocorreu! Tente novamente mais tarde.'})
    }
})

// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.5lmk5ho.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(8080)
    console.log("Conectado ao banco!")
})
.catch((err) => consolelog(err))