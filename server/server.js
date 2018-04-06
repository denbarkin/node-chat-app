const path = require('path');
let express = require('express');

let publicPath = path.join(__dirname, '../public')
let port = process.env.PORT || 3000;

var app = express();


app.use(express.static(publicPath))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
