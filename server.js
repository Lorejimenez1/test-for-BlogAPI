'use strict';

const express = require('express');
const morgan = require('morgan');

const blogRouter = require('./blogRouter');
const app = express();

// log the http layer
app.use(morgan('common'));

app.use(express.json());

//when request come into `/blog-post`
//we'll route them to express router instances we've imported.
app.use('/blog-post', blogRouter);

app.listen(process.env.PORT || 8080, () => console.log(
	`Your app is listening on port ${process.env.PORT || 8080}`)
);
