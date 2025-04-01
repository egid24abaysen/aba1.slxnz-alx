const express = require('express');
const { pool, show } = require('./db'); // Changed from 'con' to 'pool'
const { showCar, conxn } = require('./cardb');
const app = express();

app.use(express.json());


// Make the route async to properly handle the database promise
app.get('/', async (req, res) => {
    try {
        const data = await show(); // Await the async function
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/car', async (req,res)=>{
    try{
        const info = await showCar();
        res.json(info);
    } catch(err){
        console.error('Error in fetching data:',err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})


app.listen(1212, () => {
    console.log(`Server is running on http://localhost:1212`);
});