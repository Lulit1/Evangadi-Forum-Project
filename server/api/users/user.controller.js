const {
	register,
	profile,
	userById,
	getUserByEmail,
	getAllUsers,
} = require("./users.service");
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
module.exports = {
	createUser: (req, res) => {
		const { userName, firstName, lastName, email, password } = req.body;
		if (!userName || !firstName || !lastName || !email || !password)
			return res.status(400).json({ msg: "Not all fields have been provided" });
		if (password.length < 8)
			return res
				.status(400)
				.json({ msg: "Password must be at least eight characters long" });
		pool.query(
			"SELECT * FROM registration WHERE user_email= ?",
			[email],
			(err, results) => {
				if (err) {
					return res.status(err).json({ msg: "database connection err" });
				}
				if (results.length > 0) {
					return res
						.status(400)
						.json({ msg: "An account with this email already exists!" });
				} else {
					const salt = bcrypt.genSaltSync();
					req.body.password = bcrypt.hashSync(password, salt);
					register(req.body, (err, results) => {
						if (err) {
							console.log(err);
							return res.status(500).json({ msg: "database connection err" });
						}
						pool.query(
							"SELECT * FROM registration WHERE user_email= ?",
							[email],
							(err, results) => {
								if (err) {
									return res
										.status(err)
										.json({ msg: "database connection err" });
								}
								req.body.userId = results[0].user_id;
								console.log(req.body);
								profile(req.body, (err, results) => {
									if (err) {
										console.log(err);
										return res
											.status(500)
											.json({ msg: "database connection err" });
									}
									return res.status(200).json({
										msg: "New user added successfully",
										data: results,
									});
								});
							}
						);
					});
				}
			}
		);
	},
};
