const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).
  then(() => console.log('Database connection successfully...!'))
  .catch(err => console.log(err));

const app = require('./app');

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`'Server running on port ${port}...!'`));