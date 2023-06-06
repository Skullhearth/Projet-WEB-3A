function validateForm() {
	console.log("on appelle");
	var pseudo = document.forms["myForm"]["pseudo"].value;
	var email = document.forms["myForm"]["email"].value;
	var dateNaissance = document.forms["myForm"]["dateNaissance"].value;
	var newPassword = document.forms["myForm"]["newPassword"].value;
	var confirmPassword = document.forms["myForm"]["confirmPassword"].value;

	if (pseudo === "" || email === "" || dateNaissance === "" || newPassword === "" || confirmPassword === "") {
		alert("Veuillez remplir tous les champs !");
		return false;
	}

	if (newPassword !== confirmPassword) {
		alert("Les mots de passe ne correspondent pas !");
		document.forms["myForm"]["confirmPassword"].focus();
		return false;
	}

	// Envoyer les informations à la base de données serveur
	console.log("user : ", pseudo, email, dateNaissance, newPassword, confirmPassword);
	// Code pour envoyer les données à la base de données ici

	const util = {
		pseudo: pseudo,
		email: email,
		dtnaiss: dateNaissance,
		pswd: newPassword,
	};

	const utilJSON = JSON.stringify(util);

	fetch("/newuser", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: utilJSON,
	})
		.then(function (response) {
			if (response.ok) {
				console.log("User was recorded");
				document.location.href = "http://localhost:3000";
				return;
			}
			throw new Error("Request failed.");
		})
		.catch(function (error) {
			console.log(error);
		});
}

let initiate = () => {
	let btnValid = document.getElementById("valid");
	btnValid.addEventListener("click", validateForm);
};

initiate();
