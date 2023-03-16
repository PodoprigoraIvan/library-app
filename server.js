const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
const routes = require("./routes");
app.use("/", routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})