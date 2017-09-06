const path = require('path');
const express = require('express');

//We use path instead of simlply __dirname + /../public because it joins
//paths correctly. Otherwise, we'd get a weird /server/../public path which might cause problems later
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();

//Serve the public folder
app.use(express.static(publicPath));


//Begin Serving
app.listen(PORT, () => console.log('Started serving at port '+PORT));