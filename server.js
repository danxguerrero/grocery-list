const app = require("./src/app");
const { db } = require("./db/connection");
const port = 3000;
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE',
    headers: '*'
}));

app.listen(port, () => {
    db.sync();
    console.log(`Listening at http://localhost:${port}/`)
})