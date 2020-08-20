# Code Challenge

Code Challenge

## Instructions

1. The server will handle requests for existing ``food`` indices as expected, but it will call ``next`` with an error in response to a request for a non-existent food.

Complete the ``errorHandler`` function as an Express [error handling function](http://expressjs.com/en/guide/error-handling.html). It should set the response status equal to the error object’s ``status`` property if it exists, and ``500`` by default if there is no ``status`` on the error object. It should send the ``message`` property of the error object as its response.


> Hint
```javascript
const errorHandler = (err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
}
```