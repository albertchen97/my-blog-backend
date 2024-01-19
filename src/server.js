import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 8000;
app.use(express.json());

// Endpoint for front end to query article information
app.get("/api/articles/:name", async (req, res) => {
	// Query MongoDB using the ":name" URL parameter
	const { name } = req.params;

	// Connect Mongo client to the MongoDB server
	const client = new MongoClient("mongodb://127.0.0.1:27017");
	await client.connect();

	// Load the 'react-blog-db' database from MongoDB
	const db = client.db("react-blog-db");

	// Fetch the first document that matches the filter (documents that contains the name of the article)
	const article = await db.collection("articles").findOne({ name });

	// If the article exists
	if (article) {
		// Send a JSON response to the client
		res.json(article);
	}
	// If the article doesn't exist
	else {
		// Send the 404 HTTP status code
		res.status(404).send("404: Article not found!");
	}
});

// Upvote endpoint
app.put("/api/articles/:name/upvote", async (req, res) => {
	const { name } = req.params;
	const client = new MongoClient("mongodb://127.0.0.1:27017");
	await client.connect();

	const db = client.db("react-blog-db");

	await db.collection("articles").updateOne(
		{ name },
		{
			// Increament "upvotes" by 1
			$inc: {
				upvotes: 1,
			},
		}
	);

	const article = await db.collection("articles").findOne({ name });

	if (article) {
		article.upvotes += 1;
		res.send(`The ${name} article now has ${article.upvotes} upvote(s)!!!`);
	} else {
		res.send("That article doesn't exist!");
	}
});

// Comment endpoint
app.post("/api/articles/:name/comments", (req, res) => {
	const { postedBy, text } = req.body;
	const { name } = req.params;

	const article = articleInfo.find((a) => a.name === name);

	if (article) {
		article.comments.push({ postedBy, text });
		res.send(article.comments);
	} else {
		res.send("That article doesn't exist!!");
	}
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
