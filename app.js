/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = requiser('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.listen(3000)