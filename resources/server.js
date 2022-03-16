// Importing the required modules
const express = require("express");
const bodyParser = require("body-parser");
// require("dotenv").config();

const { dbReadAll, dbCreate, dbUpdate, dbDelete } = require("./mongodb");

// Creating the express app
const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});

// Creating a rooute to list all the urls
app.get("/", (req, res) => {
    dbReadAll().then((results) => {
        res.json({ urls: results });
    });
});

// Creating a urls route to create a new url
app.post("/", (req, res) => {
    if (!req.body.url) {
        res.status(400).json({ error: "url is required" });
    } else {
        // Inserting the url into the database
        dbCreate(req.body.url)
            .then((result) => {
                // Sending the response back to the client
                res.json({
                    message: "Successfully created URL",
                });
            })
            .catch((err) => {
                // Logging the error and sending the response
                console.log(err);
                res.json({ message: `Error: ${err}` });
            });
    }
});

// Creating update route for urls
app.put("/", (req, res) => {
    if (req.body.url && req.body.newUrl) {
        dbUpdate(req.body.url, req.body.newUrl)
            .then((result) => {
                // Send a JSONified response after successful update transaction //res.send("Success");
                console.log(result);
                if (result.modifiedCount === 0) {
                    res.json({
                        message: `${req.body.url} doesn't exist in Database!`,
                    });
                } else {
                    res.json({
                        message: `Successfully updated ${req.body.url} to ${req.body.newUrl}`,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                // Send a JSONified response about the error
                res.json({ message: `Error: ${err}` });
            });
    } else {
        res.json({
            message: "Please provide both urlToUpdate and newUrl",
        });
    }
});

// Creating delete route for urls
app.delete("/", (req, res) => {
    if (req.body.url) {
        dbDelete(req.body.url)
            .then((result) => {
                if (result.deletedCount === 0) {
                    res.json({
                        message: `Could not delete: ${req.body.url} - Resource don't exist`,
                    });
                } else {
                    res.json({
                        message: `Successfully deleted URL: ${req.body.url}`,
                    });
                }
                console.log(result);
            })
            .catch((error) => console.error(error));
    } else {
        res.json({ message: "Please mention which URL to delete!" });
    }
});

module.exports = app;
