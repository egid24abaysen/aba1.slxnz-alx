const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const item = [
    {id: 1, name: "item 1"},
    {id: 2, name: "item 2"},
];

app.get('/',(req,res)=>{
    res.json(item);
})
app.get('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    let found =  item.find((it)=> it.id == id);
    res.json(found);
})
app.post('/',(req,res)=>{
    newdata = {
        id: req.body.id,
        name: req.body.name
    }
    item.push(newdata);
    res.json(item);
})
app.put('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    let newdata = {
        id: req.body.id,
        name: req.body.name
    }
    let found =  item.findIndex((it)=> it.id == id);
    item[found] = newdata;
    res.json(item);
})
app.delete('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    let found =  item.findIndex((it)=> it.id == id);
    item.splice(found,1);
    res.json(item);
})

app.listen(9000,()=>{
    console.log('server on');
})