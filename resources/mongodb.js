const { MongoClient } = require("mongodb");

var URI = process.env.MONGODB_URI;

// Read all urls
async function dbReadAll() {
    const uri = URI;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
    });
    await client.connect();
    const results = await client
        .db("web-health-check")
        .collection("urls")
        .find({ url: { $exists: true } })
        .toArray();
    console.log(results);
    return results;
}

// Create a new url
async function dbCreate(url) {
    const uri = URI;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
    });
    await client.connect();
    const result = await client
        .db("web-health-check")
        .collection("urls")
        .insertOne({ url: url });
    console.log(`New url created with following id ${result.insertedId}`);
    await client.close();
}

// Update a url
async function dbUpdate(urlToUpdate, newUrl) {
    const uri = URI;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
    });
    await client.connect();
    const result = await client
        .db("web-health-check")
        .collection("urls")
        .updateOne({ url: urlToUpdate }, { $set: { url: newUrl } });
    console.log(`number of url modified ${result.modifiedCount}`);
    console.log(result);
    await client.close();
    return result;
}

// Delete a url
async function dbDelete(urlToDelete) {
    const uri = URI;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
    });
    await client.connect();
    const result = await client
        .db("web-health-check")
        .collection("urls")
        .deleteOne({ url: urlToDelete });
    console.log(`number of url deleted ${result.deletedCount}`);
    await client.close();
    return result;
}

// Export all functions
module.exports.dbReadAll = dbReadAll;
module.exports.dbCreate = dbCreate;
module.exports.dbUpdate = dbUpdate;
module.exports.dbDelete = dbDelete;
