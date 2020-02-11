const app  = require('./app');
const port = process.env.PORT || 3333;

/** Init Server */
setTimeout(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}, 3000);