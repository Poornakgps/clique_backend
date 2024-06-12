require('dotenv').config();

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ExpressPeerServer } = require('peer')
const path = require('path')

const db = require('./models');

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const http = require('http').createServer(app)

// Create peer server
ExpressPeerServer(http, { path: '/' })

// Routes
app.use('/api/', require('./routes/auth'))
app.use('/api/', require('./routes/user'))
app.use('/api/', require('./routes/post'))
app.use('/api/', require('./routes/comment'))


// Sequelize connection
db.sequelize.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// }
// );

const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log('Server is running on port', port);
});