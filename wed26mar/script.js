document.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    const list = document.getElementById('all_list'); // entering list from html
    const form = document.getElementById('my_form');
    const del = document.getElementById('delbtn');
    const fetchItem = async() => { // fetching data
        const response = await fetch('http://localhost:3030/'); // fetching data from server
        const data = await response.json(); // coverting data into json format
        //displaying data in list we created
        list.innerHTML = data.map(car => `<li>${car.carname} - ${car.brand} - ${car.year}</li>`).join(''); 
    };
    form.addEventListener('submit', async(e)=>{
        e.preventDefault();//prevent default action of form

        //capturing data from form inputs 
        const _index = document.getElementById('index').value;
        const _carname = document.getElementById('car_name').value;
        const _brand  = document.getElementById('car_brand').value;
        const _year = document.getElementById('car_year').value;

        //fetch but for posting data
        const response = await fetch('http://localhost:3030/',{
            method: 'POST', // to specify the method
            headers: { // to specify the type of data
                'Content-Type': 'application/json', 

            },
            body: JSON.stringify({_index, _carname, _brand, _year}) // converting data in jso format
        });  
        // condtion to update with changes
        if(response.ok){
            fetchItem(); // fetch again tosee added data 
            form.reset(); // clear form after sending data
        }
    });

    del.addEventListener('click', async function () {
        const id = document.getElementById('delid').value;
        
        if (!id) {
          alert('Please enter a user ID');
          return;
        }
        
        try {
          const response = await fetch(`http://localhost:3030/del/${id}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            document.getElementById('delid').value = '';
            fetchItem();
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      });
    //fetch for the first time
    fetchItem();
});