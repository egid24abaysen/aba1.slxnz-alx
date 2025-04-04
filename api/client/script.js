document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('userform');
    const list = document.getElementById('userlist');

    const fetchItem = async ()=>{
        const response = await fetch('http://localhost:9000/');
        const items =  await response.json();
        list.innerHTML = items.map(item => `<li> ${item.id} | ${item.name} </li>`).join('');
    }
    fetchItem();

});