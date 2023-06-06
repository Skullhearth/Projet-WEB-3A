function validateForm() {
	console.log("on appelle");
	var pseudo = document.forms["myForm"]["pseudo"].value.trim();
	var email = document.forms["myForm"]["email"].value.trim();
	var dateNaissance = document.forms["myForm"]["dateNaissance"].value.trim();
	var newPassword = document.forms["myForm"]["newPassword"].value.trim();
	var confirmPassword = document.forms["myForm"]["confirmPassword"].value.trim();

	if (pseudo === "" || email === "" || dateNaissance === "" || newPassword === "" || confirmPassword === "") {
		alert("Veuillez remplir tous les champs !");
		return false;
	}

	if (newPassword !== confirmPassword) {
		alert("Les mots de passe ne correspondent pas !");
		document.forms["myForm"]["confirmPassword"].focus();
		return false;
	}

	// Code pour envoyer les données à la base de données ici

	const util = {
		nickname: pseudo,
		email: email,
		dtnaiss: dateNaissance,
		password: newPassword,
	};

	console.log(util);
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

window.onload = (event) => {
	let btnValid = document.getElementById("valid");
	btnValid.addEventListener("click", validateForm);
};
