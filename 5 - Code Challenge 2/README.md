# Code Challenge

Code Challenge

## Instructions

1. The current ``moodleware`` middleware function should attach a ``mood`` property to the request object on every request and then continue on with the rest of the route matching. Something is missing! Fix it so that it moves on after attaching the ``req.mood``.

> Hint
```javascript
const moodleware = (req, res, next) => {
  const randomMoodIndex = Math.floor(Math.random() * moods.length);
  req.mood = moods[randomMoodIndex];
  // Don't forget next!
  next();
}
```