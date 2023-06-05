const protectionRoute = (req, res, next) => {
	if (!req.session.idUtilisateur) {
		res.redirect("/connexion");
	} else {
		next();
	}
};
