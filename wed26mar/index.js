const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express'); // import express
const app = express(); // create express app
const port = 3030; // port to server will run on


//middleware
app.use(bodyParser.json());
app.use(cors());

// json : js object notation
const cars = [

    {id:1,carname: "Bugatata", brand: "Bugati", year: 2020},

    {id:2,carname:"BMW", brand:"Toyota", year:"2025"}

];

//display all cars
app.get('/',(req,res)=>{
    res.json(cars); // display all cars
});

//display one car
app.get('/one_item',(req,res)=>{
    const chosencar = "Bugati";//specify wat u nedd
    const foundcar= cars.find((car)=>car.brand === chosencar);// searching using find()
    res.json(foundcar); // display the car
    res.status(200).send(); // giving signal
});
// sending data to the server
app.post('/',(req,res)=>{
    //const newCar = {id:3, carname:"Hammer", brand:"jip",year:2025}; // new data to be added
    const newCar = {
        id: req.body._index, 
        carname:req.body._carname, 
        brand:req.body._brand,
        year:req.body._year
    };
    cars.push(newCar); // function of adding new data
    res.json(cars); // display them again
});

// update the existing data
app.put('/put/:id',(req,res)=>{
    const id = parseInt(req.params.id); // car to be updated
    let newcar = {// updated car data
        id : req.body._index, 
        carname: req.body._carname, 
        brand: req.body._brand, 
        year: req.body._year
    }; 
    let findid = cars.find((car)=>car.id === id); //find  the car to be updated
    let handleposion=cars.indexOf(findid); //handlle the postion of needed car 
    findid = newcar; // action update car
    cars[handleposion] = findid; // update whole dataset
    res.json(cars); //show all data again
});

app.delete('/del/:id',(req,res)=>{
    const id  = parseInt(req.params.id); // chosen car
    let searchid = cars.findIndex((car)=>car.id == id);
    cars.splice(searchid,1); // delete chosen car
    res.json(cars); // show all data again 
})

app.listen(port, ()=>{ // activating the server
    console.log(`launched on http://localhost:${port}`);
});