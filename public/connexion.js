let connexion = () => {
	let pseu = document.getElementById("pseudo").value;
	let mdp = document.getElementById("mdp").value;

	fetch("/connexion", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			pseudo: pseu,
			password: mdp,
		}),
	})
		.then((response) => {
			if (response.redirected) {
				window.location.href = response.url; // Redirection vers "/"
			} else {
				console.log("Mot de passe incorrect ou utilisateur inexistant");
			}
		})
		.catch((error) => {
			console.log("Une erreur s'est produite lors de la connexion :", error);
		});
};

let initiate = () => {
	let btnValid = document.getElementById("btnValider");
	btnValid.addEventListener("click", connexion);
};

initiate();
