# Code Challenge

Code Challenge

## Instructions

1. This server currently sends the same response for ‘/whatis/apple’, ‘/whatis/orange’, and ‘/whatis/banana’. Write a function to send the same response, and DRY the code by using that function as a callback for all three routes.

> Hint
```javascript
const sendFruitResponse = (req, res, next) => {
  res.send('fruit');
}

app.get('/whatis/apple', sendFruitResponse);

app.get('/whatis/orange', sendFruitResponse);

app.get('/whatis/banana', sendFruitResponse);
```