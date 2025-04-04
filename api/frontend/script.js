document.addEventListener('DOMContentLoaded',(e)=>{
    const form = document.getElementById('form');
    const ul  = document.getElementById('itemlist');

    const fetchItem = async() => {
        const response = await fetch('http://localhost:3300/');
        const items = await response.json();
        ul.innerHTML = items.map(i => `<li>${i.id} - ${i.name}</li>`).join('');
    };

    form.addEventListener('submit',async (e) => {
        e.preventDefault();
        const id = document.getElementById('index').value;
        const name = document.getElementById('name').value;

        const response = await fetch('http://localhost:3300/post/',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({id , name})
        });
        if(response.ok){
            fetchItem();
            form.reset();
        }
    });
    fetchItem();
})