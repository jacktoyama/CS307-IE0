// backend.js
import express from "express";
import cors from "cors";


const app = express();
const port = 8000;

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "ddd234",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "ter122",
            name: "Trippi Troppi",
            job: "Aspring actress"
        },
        {
            id: "tee938",
            name: "Dennis",
            job: "Bartender"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World!");
});

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);
  
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
};  

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => (user["name"] === name && user["job"] === job)
    );
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (job != undefined && name != undefined) {
        let result = findUserByNameAndJob(name, job);
        result = { users_list: result };
        console.log(result);
        res.send(result);
    }
    else if (job != undefined) {
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result);
    }
    else if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const addUser = (user) => {
    user.id = String(Math.floor(Math.random() * 900) + 11);
    users["users_list"].push(user);
    return user;
};

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).send(userToAdd);
});

const findIndex = (id) => {
    for (let i = 0; i < users["users_list"].length; i++) {
        if (users["users_list"].id === id) {
            return i;
        };
    };
};

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let index = findIndex(id);
    users["users_list"].splice(index, 1);
    res.status(204).send();
});