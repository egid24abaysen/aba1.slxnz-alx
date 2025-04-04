const bodyParser = require('body-parser'); // entering bodyparser
const cors = require('cors'); // entering cors
const express = require('express'); // entering express
const app = express(); //creating express app
const port = 3300; //port server is to be run on


//middlwares
app.use(express.json()); //using json format
app.use(bodyParser.json()); //handling form data into json
app.use(cors()); // security purpose


// fake dataset
const item = [
    {id: 1, name: "item one"},// pos 0
    {id : 2, name: "item two"},// pos 1
    {id:3, name:"item three"} // pos 2
];


// routes / link / urls / endpoints

// send all items to screen
app.get ('/', (req,res)=> {
    res.json(item);
});

// send specific data item to screen
app.get('/oneitem/',(req,res)=>{
    const id = 2; //chposing item to be seen
    const onetime = item.find((item)=>item.id === id);//finding specific item using find() method.
    res.json(onetime); //show data
    if(res.status(200) == 200){
        res.json({message: "item found"});
    }else{
        res.json({message: "item not found"});
    }
});

//recieve data new item
app.post('/post',(req,res)=>{
    const newtem = {id: 4,name: "item four"}; // new data to be added
    // const newtem = {
    //     id: req.body.id,
    //     name: req.body.name
    // };
    item.push(newtem); //adding new item
    res.json(item); //showing new item
});

//updating existing item
app.put('/put',(req,res)=>{ 
    const chosenitem = 3; // choose where to update
    let pos= chosenitem -1; // handle position
    let updateditem = item.findIndex((item)=>item.id === chosenitem); // searching the item
    nupdateditem = {id : 0 , name: "updated item "}; // updating the item
    item[updateditem] = nupdateditem; // save changes in whole dataset
    res.json(item);
});

//deleting existing item
app.delete('/delete',(req,res)=>{
    const delitem= 2;
    let trash = item.findIndex((item)=>item.id === delitem);
    item.splice(trash,2); // deletting item
    res.json(item);
})

app.listen(port,()=>{ // start the server
    console.log(`Launched on http://localhost:${port}`);
});
