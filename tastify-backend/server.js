import mysql from "mysql2";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const server = express();
server.use(bodyParser.json());
server.use(cors());

const port = 9002;

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Albania20027245",
    database: "tastifydb"
});

db.connect(function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Successfully connected");
    }
});

server.listen(port, function (error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Started on port " + port);
    }
});

server.get("/api/user", (req, res) => {

    let sql = "SELECT * FROM user";

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send({ status: true, data: result });
        }
    })
});

server.get("/api/user/:id", (req, res) => {

    let userId = req.params.id;
    let sql = "SELECT * FROM user WHERE id=" + "'" + userId + "'";

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send({ status: true, data: result });
        }
    })
});

server.post("/api/user/add", (req, res) => {

    let details = {
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        obscurityScore: req.body.obscurityScore
    };

    let sql = "INSERT INTO user SET ?";

    db.query(sql, details, (error) => {
        if (error) {
            console.log(error);
            res.send({ status: false, message: "Failed" });
        }
        else {
            res.send({ status: true, message: "Success" });
        }
    })
});

server.put("/api/user/update", (req, res) => {
    const userId = req.body.id;
    const newDetails = {
        username: req.body.username,
        email: req.body.email,
        obscurityScore: req.body.obscurityScore,
        imageUrl: req.body.imageUrl
    };

    const sql = "UPDATE user SET ? WHERE id = ?";

    db.query(sql, [newDetails, userId], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ status: false, message: "Failed to update user details" });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ status: true, message: "User details updated successfully" });
            } else {
                res.status(404).json({ status: false, message: "User not found" });
            }
        }
    });
});

server.delete("/api/user/delete/:id", (req, res) => {

    let userId = req.params.id;
    let sql = "DELETE FROM user WHERE id=" + userId;

    db.query(sql, (error) => {
        if (error) {
            console.log(error);
            res.send({ status: false, message: "Failed to delete" });
        }
        else {
            res.send({ status: true, message: "Successfully deleted" });
        }
    })
});

server.get("/api/obscurity", (req, res) => {

    let sql = "SELECT * FROM average_obscurity";

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send({ status: true, data: result });
        }
    });
});

server.put("/api/obscurity/update", (req, res) => {
    const id = req.body.id;
    const newDetails = {
        average_obscurity_score: req.body.average_obscurity_score,
    };

    const sql = "UPDATE average_obscurity SET ? WHERE id = ?";

    db.query(sql, [newDetails, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ status: false, message: "Failed to update user details" });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ status: true, message: "User details updated successfully" });
            } else {
                res.status(404).json({ status: false, message: "User not found" });
            }
        }
    });
});

server.get("/api/user_track/", (req, res) => {

    let sql = "SELECT * FROM user_track";

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send({ status: true, data: result });
        }
    });
});

server.get("/api/user_track/:track_id", (req, res) => {

    const trackId = req.params.track_id;

    let sql = "SELECT * FROM user_track WHERE track_id = ?";

    db.query(sql, trackId, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ status: false, message: "Failed to retrieve data" });
        } else {
            res.status(200).json({ status: true, data: results });
        }
    });
});


server.post("/api/user_track/add", (req, res) => {

    let details = {
        user_id: req.body.user_id,
        track_id: req.body.track_id
    };

    let checkSql = "SELECT * FROM user_track WHERE user_id = ? AND track_id = ?";

    db.query(checkSql, [details.user_id, details.track_id], (error, results) => {
        if (error) {
            console.log(error);
            res.send({ status: false, message: "Error checking for existing entry" });
        } else if (results.length > 0) {
            res.send({ status: false, message: "Entry already exists" });
        } else {
            let insertSql = "INSERT INTO user_track SET ?";

            db.query(insertSql, details, (error) => {
                if (error) {
                    console.log(error);
                    res.send({ status: false, message: "Failed to add entry" });
                } else {
                    res.send({ status: true, message: "Success" });
                }
            });
        }
    });
});

server.get("/api/user_artist/", (req, res) => {

    let sql = "SELECT * FROM user_artist";

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send({ status: true, data: result });
        }
    });
});

server.get("/api/user_artist/:artist_id", (req, res) => {

    const artistId = req.params.artist_id;

    let sql = "SELECT * FROM user_artist WHERE artist_id = ?";

    db.query(sql, artistId, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ status: false, message: "Failed to retrieve data" });
        } else {
            res.status(200).json({ status: true, data: results });
        }
    });
});


server.post("/api/user_artist/add", (req, res) => {

    let details = {
        user_id: req.body.user_id,
        artist_id: req.body.artist_id
    };

    let checkSql = "SELECT * FROM user_artist WHERE user_id = ? AND artist_id = ?";

    db.query(checkSql, [details.user_id, details.artist_id], (error, results) => {
        if (error) {
            console.log(error);
            res.send({ status: false, message: "Error checking for existing entry" });
        } else if (results.length > 0) {
            res.send({ status: false, message: "Entry already exists" });
        } else {
            let insertSql = "INSERT INTO user_artist SET ?";

            db.query(insertSql, details, (error) => {
                if (error) {
                    console.log(error);
                    res.send({ status: false, message: "Failed to add entry" });
                } else {
                    res.send({ status: true, message: "Success" });
                }
            });
        }
    });
});

server.get("/api/common_tracks", (req, res) => {
    const userId1 = req.query.user_id1;
    const userId2 = req.query.user_id2;

    if (!userId1 || !userId2) {
        res.status(400).send({ status: false, message: "Both user_id1 and user_id2 are required." });
        return;
    }

    let sql = `CALL get_common_tracks(?, ?)`;

    db.query(sql, [userId1, userId2], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send({ status: false, error: error.message });
        } else {
            res.send({ status: true, data: results[0] });
        }
    });
});

server.get("/api/common_artists", (req, res) => {
    const userId1 = req.query.user_id1;
    const userId2 = req.query.user_id2;

    if (!userId1 || !userId2) {
        res.status(400).send({ status: false, message: "Both user_id1 and user_id2 are required." });
        return;
    }

    let sql = `CALL get_common_artists(?, ?)`;

    db.query(sql, [userId1, userId2], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send({ status: false, error: error.message });
        } else {
            res.send({ status: true, data: results[0] });
        }
    });
});