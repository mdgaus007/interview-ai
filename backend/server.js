import 'dotenv/config.js'
import app from "./src/app.js";
import ConnectDB from './src/config/db.js';

const PORT=process.env.PORT || 3000

ConnectDB()

app.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`);
})