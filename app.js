const express = require('express');
const cors = require('cors'); // Import the cors module
const db = require('./config/connection');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Routes
const userRouter = require('./routes/user');
const recruiterRouter = require('./routes/recruiter');

dotenv.config();

const app = express();

// Enable CORS with all origins
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.connect();

app.use('/', userRouter);
app.use('/recruiter', recruiterRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});