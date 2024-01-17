import express from "express";

const app = express();
app.use(express.json());
const port = 8000;

let articleInfo = [
	{
		name: "learn-react",
		upvotes: 0,
		comments: [],
	},
	{
		name: "learn-node",
		upvotes: 0,
		comments: [],
	},
	{
		name: "mongodb",
		upvotes: 0,
		comments: [],
	},
];

// Upvote endpoint
app.put("/api/articles/:name/upvote", (req, res) => {
	const { name } = req.params;
	const article = articleInfo.find((a) => a.name === name);
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
