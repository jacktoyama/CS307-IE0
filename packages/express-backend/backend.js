// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-services.js"

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

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
    const promise = userService.getUsers(name, job);
    promise.then((list) => {
        res.send(list);
    })
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
        if (users["users_list"][i].id === id) {
            return i;
        };
    };
    return -1;
};

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    userService.deleteUser(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(204).send();
        })
        .catch((err) => {
            console.error("Error deleting user:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});