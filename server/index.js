const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("RFID")
});

app.listen(3001, () => {
    console.log('Server is running at port 3001')
});