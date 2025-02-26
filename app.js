const http = require('http'); 
const fs = require('fs'); 
const url = require('url'); 
const { parse } = require('querystring'); 
const PORT = 3000; 
const server = http.createServer((req, res) => { 
const parsedUrl = url.parse(req.url, true); 
const method = req.method; 
// Handle GET /users 
if (parsedUrl.pathname === '/users' && method === 'GET') { 
fs.readFile('users.json', 'utf8', (err, data) => { 
if (err) { 
res.writeHead(500, { 'Content-Type': 'application/json' }); 
return res.end(JSON.stringify({ message: 'Internal Server Error' })); } 
res.writeHead(200, { 'Content-Type': 'application/json' }); 
res.end(data); 
}); 
} 
// Handle POST /users 
else if (parsedUrl.pathname === '/users' && method === 'POST') { let body = ''; 
req.on('data', chunk => { 
body += chunk; 
}); 
req.on('end', () => { 
const newUser = JSON.parse(body); 
fs.readFile('users.json', 'utf8', (err, data) => { 
if (err) { 
res.writeHead(500, { 'Content-Type': 'application/json' });
return res.end(JSON.stringify({ message: 'Internal Server Error' })); } 
const users = JSON.parse(data); 
users.push(newUser); 
fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8', (err) => { 
if (err) { 
res.writeHead(500, { 'Content-Type': 'application/json' }); 
return res.end(JSON.stringify({ message: 'Error saving user data' })); 
} 
res.writeHead(201, { 'Content-Type': 'application/json' }); 
res.end(JSON.stringify(newUser)); 
}); 
}); 
}); 
} 
// Handle DELETE /users/:id 
else if (parsedUrl.pathname.startsWith('/users/') && method === 'DELETE') { const userId = parsedUrl.pathname.split('/')[2]; 
fs.readFile('users.json', 'utf8', (err, data) => { 
if (err) { 
res.writeHead(500, { 'Content-Type': 'application/json' }); 
return res.end(JSON.stringify({ message: 'Internal Server Error' })); } 
let users = JSON.parse(data); 
users = users.filter(user => user.id !== userId); 
fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8', (err) => { 
if (err) { 
res.writeHead(500, { 'Content-Type': 'application/json' }); 
return res.end(JSON.stringify({ message: 'Error deleting user' })); } 
res.writeHead(200, { 'Content-Type': 'application/json' }); 
res.end(JSON.stringify({ message: 'User deleted successfully' })); }); 
}); } 
// Handle unsupported routes 
else { 
res.writeHead(404, { 'Content-Type': 'application/json' }); 
res.end(JSON.stringify({ message: 'Route not found' })); 
} 
}); 
server.listen(PORT, () => { 
console.log(`Server running on http://localhost:${PORT}`); 
}); 
users.json 
[ 
{ "id": "1", "name": "Alice", "email": "alice@example.com" }, { "id": "2", "name": "Bob", "email": "bob@example.com" } 
] 
