const cors = require("cors")
const path = require("path")

// EXPRESS
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "/")))
app.use(cors({ origin: "*" }))


app.use(function(req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval'")
	next();
})

// MONGODB
const MongoClient = require("mongodb").MongoClient
const url = process.env.MULIPDB

// SOCKET IO
const http = require("http").Server(app)
const io = require("socket.io")(http)

// MONGODB SIMPLEST FUNCTION

async function count_data () {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			let count = client.db("MulipDB").collection("Data").countDocuments({})
			return resolve(count)
		})
	})
}

async function cursor_insert(obj) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			let cursor = client.db("MulipDB").collection("Data")
			cursor.insertOne(obj, function(err, res) {
		    	if (err) reject(err)
		    	client.close()
		    	return resolve(res)
			})
		})
	})
}

async function cursor_find(obj_search, obj_id) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			let cursor = client.db("MulipDB").collection("Data")
			cursor.findOne({[obj_search]:obj_id}, function(err, res) {
		    	if (err) throw reject(err)
		    	client.close()
		    	return resolve(res)
			})
		})
	})
}

async function cursor_update(obj_id, obj) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			let cursor = client.db("MulipDB").collection("Data")
			cursor.updateOne({"Email":obj_id}, {$set: obj}, function(err, res) {
				if (err) reject(err)
				client.close()
				return resolve(res)
			})
		})
	})
}

function cursor_delete(obj_id) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			let cursor = client.db("MulipDB").collection("Data")
			cursor.deleteOne({"Email":obj_id}, function(err, res) {
		    	if (err) throw err
		    	client.close()
		    	return resolve(res)
			})
		})
	})
}

// EXPRESS WEBSITE PATH..?

app.get("/", async function(req,res) {
    res.sendFile('/Login-SignUp/Login.html',{ root: __dirname })
})

app.get("/debug", async function(req,res) {
	res.sendFile("/Main_App/Main.html",{ root: __dirname })
})

app.get("/signup", async function(req, res) {
    var Email = req.query.email
    var UserName = req.query.name
    var Password = req.query.password

    // [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$ EMAIL REGEX
    let get_data = await cursor_find("Email", `${Email}`)
    if(get_data == null || get_data == " ") {
    	let count = await count_data() + 1
       	let new_data = {
            "Email": Email,
            "Password": Password,
            "User": {
                "Name": UserName,
                "Bio": `Hello im ${UserName}!`,
                "Status": "",
                "tag": count,
                "pfp": "",
            },
            "friend_list": [
                /*
                {
                    
	                "Name": "friend_name",
	                tag": "0000",
	                "chistory": [
	                	{
	                		"time": "x-xx-xxxx",
	                		"chat": "The movie is ready?",
	                		"user": "true"
	                    },
	                    {
	                    	"time": "x-xx-xxxx",
	                    	"chat": "yes, sure. the movie is ready",
	                    	"user": "false",
	                    }
	                ]
                }
                */
            ]
        }

       	try {
        	await cursor_insert(new_data)
        }
        catch(err) {
        	console.log("ERROR", err)
        	return res.send({
	    		status: 500,
	    		message: `ERROR : ${err}`,
	    		data: null
	    	})
        }

	    return res.send({
	    	status: 200,
	    	message: "Response is resolved",
	    	data: await cursor_find("Email", Email)
	    })
    }

    return res.send({
    	status: 409,
    	message: "Credentials have been used"
    })

})

app.get("/login", async function(req, res) {	// http://<DOMAIN>/login?email=EMAIL@gmail.com&password=passwords
    var Email = req.query.email
    var Password = req.query.password

    // [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$ EMAIL REGEX
    let get_data = await cursor_find("Email", `${Email}`)
    if(get_data == null || get_data == " ") {
    	return res.send({
    		status: 404,
    		message: "Data Not Found",
    		data: null
    	})
    }

    if(Password != get_data["Password"]) {
    	return res.send({
    		status: 401,
    		message: "Invalid credentials",
    		data: null
    	})
    }

    return res.send({
    	status: 200,
    	message: "Response is resolved",
    	data: get_data
    })
})

// START SERVER
http.listen(port, "0.0.0.0", () => {
    console.log(`Server is running!\nPORT : ${port}`)
})