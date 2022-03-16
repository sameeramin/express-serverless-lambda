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

// Creating a rooute to list all the urls
app.get("/", (req, res) => {
    dbReadAll().then((results) => {
        res.send({ urls: results });
    });
});

// Creating a urls route to create a new url
app.post("/", (req, res) => {
    // Inserting the url into the database
    dbCreate(req.body.url)
        .then((result) => {
            // Sending the response back to the client
            res.json({
                id: result.insertedId,
                message: "Successfully created URL",
            });
        })
        .catch((err) => {
            // Logging the error and sending the response
            console.log(err);
            res.json({ message: `Error: ${err}` });
        });
});

// Creating update route for urls
app.put("/", (req, res) => {
    dbUpdate(req.body.url, req.body.newUrl)
        .then((result) => {
            console.log(result);
            if (result.lastErrorObject.updatedExisting) {
                // Send a JSONified response after successful update transaction //res.send("Success");
                res.json({
                    message: `Successfully updated to ${result.value.url}`,
                });
            } else {
                // Send a JSONified response after successful insert transaction
                res.json({
                    message: `Cloudn't find any url matching to the query, created new record!`,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            // Send a JSONified response about the error
            res.json({ message: `Error: ${err}` });
        });
});

// Creating delete route for urls
app.delete("/", (req, res) => {
    if (req.body.url) {
        dbDelete({ url: req.body.url })
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
            })
            .catch((error) => console.error(error));
    } else {
        res.json({ message: "Please mention which URL to delete!" });
    }
});

module.exports = app;
