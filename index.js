const bodyParser = require('body-parser'); // entering bodyparser
const cors = require('cors'); // entering cors
const express = require('express'); // entering express
const app = express(); //creating express app
const port = 3000; //port server is to be run on


//middlwares
app.use(express.json()); //using json format
app.use(bodyParser.json()); //handling form data into json
app.use(cors()); // security purpose


// fake dataset
const item = [
    {id: 1, name: "item one"},
    {id : 2, name: "item two"},
    {id:3, name:"item three"}
];


// routes / link / urls / endpoints

// send all items to screen
app.get ('/', (req,res)=> {
    res.json(item);
});

// send specific data item to screen
app.get('/oneitem/:id',(req,res)=>{
    const onetime = item.find((item)=>item.id === id);//finding specific item using find() method.
    res.json(onetime);
    if(res.status(200) == 200){
        res.json({message: "item found"});
    }else{
        res.json({message: "item not found"});
    }
});

//recieve data new item
app.post('/post',(req,res)=>{
    const newtem = {id: 4,name: "item four"};
    item.push(newtem); //adding new item
    res.json(newtem); //showing new item
});

//updating existing item
app.put('/put',(req,res)=>{ 
    const chosenitem = 3;
    let pos= chosenitem -1; // handle position
    let updateditem = item.find((item)=>item.id === chosenitem); // searching the item
    updateditem = {id : 0 , name: "updated item "}; // updating the item
    item[pos] = updateditem; // save changes in whole dataset
    res.json(item);
});

//deleting existing item
app.delete('/delete',(req,res)=>{
    const delitem= 2;
    item.splice(delitem,2); // deletting item
    res.json(item);
})

app.listen(port,()=>{ // start the server
    console.log(`Launched on http://localhost:${port}`);
});
