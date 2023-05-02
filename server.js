var cors = require('cors')

// EXPRESS
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/'))
app.use(cors({ origin: '*' }));

app.use(function(req, res, next) {
	res.setHeader('Content-Security-Policy', "default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval' http://127.0.0.1:3000")
	next();
})

// MONGODB
const MongoClient = require("mongodb").MongoClient
const url = process.env.MULIPDB

// SOCKET IO
const http = require('http').Server(app)
const io = require('socket.io')(http)

// MONGODB SIMPLEST FUNCTION
async function cursor_insert(obj) {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, client) {
			if (err) reject(err)

			var cursor = client.db("MulipDB").collection("Data")
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

			var cursor = client.db("MulipDB").collection("Data")
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

			var cursor = client.db("MulipDB").collection("Data")
			cursor.updateOne({"ID":obj_id}, {$set: obj}, function(err, res) {
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

			var cursor = client.db("MulipDB").collection("Data")
			cursor.deleteOne({"ID":obj_id}, function(err, res) {
		    	if (err) throw err
		    	client.close()
		    	return resolve(res)
			})
		})
	})
}

async function main() {
	let get_data = await cursor_find("Email", "MYID_LEMAO")
	if(!get_data) return console.log("DATA IS NOT EXIST")
	return console.log(get_data)
}

// EXPRESS WEBSITE PATH..?

app.get("/", async function(req,res) {
    res.sendFile('index.html',{ root: __dirname })
})

app.get("/signup", async function(req, res) {
    var Email = req.query.email
    var Password = req.query.password
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

    if(Password != get_data['Password']) {
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
http.listen(port, '0.0.0.0' ,() => {
    console.log(`Server is running!\nPORT : ${port}`)
})