const express = require('express');
const cors = require('cors'); // Import the cors module
const db = require('./config/connection');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
require('./middleware/passport')

// Routes
const candidateRouter = require('./routes/candidate');
const recruiterRouter = require('./routes/recruiter');
const adminRouter = require('./routes/admin')
const chatRouter = require('./routes/chat')
const postRouter = require('./routes/post')
const followRouter = require('./routes/follow')


const app = express();

// Enable CORS with all origins
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.connect();

app.use('/', candidateRouter);
app.use('/recruiter', recruiterRouter);
app.use('/chat', chatRouter);
app.use('/admin',adminRouter)
app.use('/post', postRouter)
app.use('/follow', followRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});