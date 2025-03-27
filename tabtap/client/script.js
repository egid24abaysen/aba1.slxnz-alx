document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const usersTableBody = document.getElementById('usersTableBody');
    const cancelBtn = document.getElementById('cancelBtn');
    
    let editingUserId = null;
    
    // Fetch all users and display them
    function fetchUsers() {
        fetch('http://localhost:4000/api/users')
            .then(response => response.json())
            .then(users => {
                usersTableBody.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
                        </td>
                    `;
                    
                    usersTableBody.appendChild(row);
                });
                
                // Add event listeners to edit and delete buttons
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', handleEdit);
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', handleDelete);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    
    // Handle form submission
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        if (editingUserId) {
            // Update existing user
            updateUser(editingUserId, { name, email });
        } else {
            // Create new user
            createUser({ name, email });
        }
    });
    
    // Handle cancel button
    cancelBtn.addEventListener('click', function() {
        editingUserId = null;
        userForm.reset();
        document.getElementById('userId').value = '';
    });
    
    // Create a new user
    function createUser(user) {
        fetch('http://localhost:4000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(() => {
            userForm.reset();
            fetchUsers();
        })
        .catch(error => console.error('Error creating user:', error));
    }
    
    // Update a user
    function updateUser(id, user) {
        fetch(`http://localhost:4000/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(() => {
            editingUserId = null;
            userForm.reset();
            document.getElementById('userId').value = '';
            fetchUsers();
        })
        .catch(error => console.error('Error updating user:', error));
    }
    
    // Handle edit button click
    function handleEdit(e) {
        const id = e.target.getAttribute('data-id');
        
        fetch(`http://localhost:4000/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('userId').value = user.id;
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                
                editingUserId = user.id;
            })
            .catch(error => console.error('Error fetching user:', error));
    }
    
    // Handle delete button click
    function handleDelete(e) {
        const id = e.target.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`http://localhost:4000/api/users/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchUsers();
            })
            .catch(error => console.error('Error deleting user:', error));
        }
    }
    
    // Initial fetch of users
    fetchUsers();
});