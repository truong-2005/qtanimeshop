const http = require('http');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
let body = '';
const append = (name, value) => {
  body += '--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"\r\n\r\n' + value + '\r\n';
};
append('name', 'Test Product');
append('slug', 'test-product');
append('description', 'test');
append('price', '100');
append('quantity', '10');
append('status', 'ACTIVE');
append('categoryId', '1');
append('brandId', '2');
body += '--' + boundary + '--\r\n';

const req = http.request('http://localhost:8083/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbjEyMyIsInJvbGUiOiJBRE1JTiIsImVtYWlsIjoiYWRtaW4xMjNAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODE1MTg4NjAsImV4cCI6MTc4MjEyMzY2MH0.Vmntlgfo9m4sOiN8l6gRWlFc0QfbS4fcPiWD-ero6MP_2vDQwrFuzWUcfl3PgV3zPjZbpo0ezsqqUs_YtBeYFA'
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(body);
req.end();
