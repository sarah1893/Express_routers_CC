# Code Challenge

Code Challenge

## Instructions

1. Import the [morgan](https://github.com/expressjs/morgan) logging middleware to log all requests. Use the [predefined format](https://github.com/expressjs/morgan#predefined-formats) ‘short’ instead of ‘tiny’.

> Hint
```javascript
const morgan = require('morgan');
app.use(morgan('short'));
```