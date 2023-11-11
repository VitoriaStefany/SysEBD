/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// models
const User = require('./models/User')

const app = express()

// Configuração de resposta JSON
app.use(express.json())

// Rota Publica
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

// Rota Privada
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id

    // Checar se o usuário existe
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: "Usuário não encontrado!" })
    }

    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({ msg: 'Acesso negado!'})
    }

    try{

        const secret = process.env.secret

        jwt.verify(token, secret)

        next()

    } catch(error) {
        res.status(400).json({msg: "Token inválido!"})
    }
}

// Registro de Usuário
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmPassword} = req.body

    // Validações
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
        return res.status(422).json({msg: "As senhas não conferem! "})
    }

    // Checar se usuário existe
    const userExists = await User.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({msg: 'Por favor, utilize outro email! '})
    }

    // Criação da Senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criação do Usuário
    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save() // save: Salva o usuário no banco de dados
    
        res.status(201).json({msg: "Usuário cadastrado com sucesso!"})
    } catch(error) {
        res.status(500).json({msg: 'Aconteceu algo inesperado! Por favor, tente novamente mais tarde.'})
    }
})

// Login de Usuário
app.post("/auth/login", async (req, res) => {
    const { email, password} = req.body

    // Validações
    if(!email){
        return res.status(422).json({msg: "O email é obrigatório! "})
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória! "}) 
    }

    // Checar se usuário existe
    const user = await User.findOne({ email: email})

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado! '})
    }
    
    // Checar senha do usuário
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' })
    }

    try{
        const secret = process.env.secret
        
        const token = jwt.sign({
            id: user._id
        }, 
        secret,
    )

    res.status(200).json({msg: "Autenticação realizada com sucesso!", token})

    } catch(err){
        res.status(500).json({msg: 'Aconteceu algo inesperado! Por favor, tente novamente mais tarde.'})
    }
})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.5lmk5ho.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(8080)
    console.log("Conectado ao banco!")
})
.catch((err) => consolelog(err))