const http = require("http");
const express = require("express");
const fs = require("fs");
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cookieParser = require("cookie-parser");

var app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
	session({
		secret: "randomstringtavumagueule1546531",
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: false,
	})
);

app.listen(3000, function () {
	console.log("Serveur démarré sur le port 3000");
});

//Ouverture de la page lors de la connexion au serveur
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

//Client de la base de données
const uri = "mongodb+srv://AntoineK:Confiture2@webensibs.xcljq97.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

var utilisateurs;
var pokeDetenus;
client
	.connect()
	.then(() => {
		var db = client.db("ProjetWEB");
		utilisateurs = db.collection("Utilisateur");
		pokeDetenus = db.collection("Poke_Detenus");

		console.log("Connecté à la base de données");
	})
	.catch((err) => {
		console.error(err);
	});

//Middleware
const protectionRoute = (req, res, next) => {
	if (!req.session.pseudo) {
		res.redirect("/connexion");
	} else {
		next();
	}
};

app.get("/connecte", protectionRoute, (req, res) => {
	console.log("Chuis dedans");
	res.sendFile(__dirname + "/public/pokedex/pokedex.html");
});

//Ajout d'une nouvelle tâche
app.post("/newuser", async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const passwordToSave = await bcrypt.hash(req.body.password, salt);

	const user = { pseudo: req.body.nickname, email: req.body.email, dtnaiss: req.body.dtnaiss, pswd: passwordToSave };

	try {
		await utilisateurs.insertOne(user);
		console.log("Utilisateur ajouté à la base");
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
	}
});

app.post("/connexion", async (req, res) => {
	const { pseudo, password } = await req.body;
	if (pseudo && password) {
		const query = { pseudo: pseudo };
		const utilisateur = await utilisateurs.findOne(query);
		console.log(utilisateur);
		if (utilisateur) {
			const validPassWord = await bcrypt.compare(password, utilisateur.pswd);

			if (validPassWord) {
				req.session.pseudo = utilisateur.pseudo;
				return res.redirect("/connecte");
			} else {
				console.log("Mot de passe incorrect");
			}
		} else {
			console.log("Utilisateur n'existe pas");
		}
	}
});

/*

//Envoie de toutes les tâches vers le JS client
app.get("/tasks", (req, res) => {
	//console.log("Reçu le fetch");
	taches
		.find()
		.toArray()
		.then((docs) => {
			//console.log("Eléments de la table : ", docs);
			res.json(docs);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Erreur lors de la récupération des tâches");
		});
});

//Suppression d'une tâche
app.delete("/deletetask/:id", async (req, res) => {
	try {
		const taskId = req.params.id;
		console.log(`ID de la tâche à supprimer : ${taskId}`);

		const query = { _id: new ObjectId(taskId) };

		const result = await taches.deleteOne(query);
		if (result.deletedCount === 0) {
			console.log("Aucun document trouvé avec l'ID spécifié");
			res.status(404).send("Aucun document trouvé avec l'ID spécifié");
		} else {
			console.log("Document supprimé avec succès");
			res.status(204).send("Document supprimé avec succès");
		}
	} catch (error) {
		console.error("Erreur lors de la suppression du document :", error);
		res.status(500).send("Erreur lors de la suppression du document");
	}
});

//Modification de l'état d'un tâche
app.put("/updatetask/:id", async (req, res) => {
	try {
		const taskId = req.params.id;
		const updatedField = req.body.field;
		const updatedValue = req.body.value;

		const query = { _id: new ObjectId(taskId) };
		const update = { $set: { [updatedField]: updatedValue } };

		const result = await taches.updateOne(query, update);

		if (result.matchedCount === 0) {
			console.log("Aucun document trouvé avec l'ID spécifié");
		} else {
			console.log("Document mis à jour avec succès");
		}
	} catch (error) {
		console.error("Erreur lors de la mise à jour du document :", error);
	}
});
*/
