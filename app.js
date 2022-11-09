import express from 'express';
import cors from 'cors'
import HelloController from "./controllers/hello-controller.js";
import UserController from "./controllers/users/users-controller.js";
import TuitsController from "./controllers/tuits/tuits-controller.js";

const app = express();
// configure cors right after instantiating express
app.use(cors())
// parse data from the body
app.use(express.json());
HelloController(app);
UserController(app);
TuitsController(app);

// declares proper port for Heroku(process.env.PORT) and our local computer(4000)
app.listen(process.env.PORT || 4000);
