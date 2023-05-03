var login_or_signup = "Login"

window.onload = function() {
    if(document.readyState == "complete") {

    	document.getElementById("checkmark-input").addEventListener("click", () => {
    		let checking = document.querySelector(".checkmark-input").checked
    		if(!checking) {
    			return document.getElementById("passwordForm").type = "password"
    		}
    		return document.getElementById("passwordForm").type = "text"
    	})

    	document.getElementById("submitForm").addEventListener("click", () => {
    		let email = document.getElementById("emailForm").value
    		let password = document.getElementById("passwordForm").value
    		let username = document.getElementById("NameForm").value

    		document.getElementById("LdAnim").style.display = "block"
    		document.getElementById("SBLB").style.display = "none"

    		if(!email && !password || !email || !password) {
    			document.getElementById("smalltext").innerText = "Tolong Isi Semua Param!"
    			document.getElementById("LdAnim").style.display = "none"
    			document.getElementById("SBLB").style.display = "block"
    			return
    		}

    		document.getElementById("smalltext").innerText = "\u00a0"
    		var em_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    		if(!em_regex.test(email)) {
    			document.getElementById("smalltext").innerText = "Email Invalid!"
    			document.getElementById("LdAnim").style.display = "none"
    			document.getElementById("SBLB").style.display = "block"
    			return
    		}

    		if(login_or_signup != "SignUp") {
	    		fetch(`/login?email=${email}&password=${password}`)
	    		.then(response => response.json())
	    		.then(data => {
	    			if(data['status'] == 404) {
	    				document.getElementById("LdAnim").style.display = "none"
	    				document.getElementById("SBLB").style.display = "block"
	    				document.getElementById("smalltext").innerText = "Email Tidak Ditemukan!"
	    				return
	    			}

	    			else if(data['status'] == 401) {
	    				document.getElementById("LdAnim").style.display = "none"
	    				document.getElementById("SBLB").style.display = "block"
	    				document.getElementById("smalltext").innerText = "Password Salah!"
	    				return
	    			}

	    			document.getElementById("LdAnim").style.display = "none"
	    			document.getElementById("SBLB").style.display = "block"
	    			return
	    		})
	    		.catch((err)=>{
	    			document.getElementById("LdAnim").style.display = "none"
	    			document.getElementById("SBLB").style.display = "block"

	    			document.getElementById("smalltext").innerText = `ERROR : ${err}`
	    			console.log(err)
	    			return
				})
				return
			}

			if(!username) {
				document.getElementById("smalltext").innerText = "Tolong isi bagian username"
    			document.getElementById("LdAnim").style.display = "none"
    			document.getElementById("SBLB").style.display = "block"
    			return
			}

			fetch(`/SignUp?email=${email}&name=${username}&password=${password}`)
			.then(response => response.json())
	    	.then(data => {
	    		if(data['status'] == 409) {
	    			document.getElementById("LdAnim").style.display = "none"
		    		document.getElementById("SBLB").style.display = "block"
	    			document.getElementById("smalltext").innerText = `Email Sudah Digunakan!`
	    			return
	    		}

	    		document.getElementById("LdAnim").style.display = "none"
		    	document.getElementById("SBLB").style.display = "block"
		    	return
	    	})
	    	.catch((err)=>{
	    		document.getElementById("LdAnim").style.display = "none"
	    		document.getElementById("SBLB").style.display = "block"

	    		document.getElementById("smalltext").innerText = `ERROR : ${err}`
	    		console.log(err)
	    		return
			})
    	})

    	document.getElementById("emailForm").addEventListener("keyup", () => {
    		let email = document.getElementById("emailForm").value
    		var em_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    		if(!em_regex.test(email)) {
    			document.getElementById("EnvelopeSvgs").innerHTML = `
    				<img src="/Login-SignUp/Envelope_invalid.svg" style="width: 45px;height: 45px;">
    			`
    			return
    		}

    		document.getElementById("EnvelopeSvgs").innerHTML = `
				<img src="/Login-SignUp/Envelope_valid.svg" style="width: 45px;height: 45px;">
    		`
    	})

    	document.getElementById("Switcher").addEventListener("click", () => {
    		if(login_or_signup == "Login") {
    			login_or_signup = "SignUp"
    			document.getElementById("LgText").innerText = "Sign-Up"
    			document.getElementById("Switcher").innerText = "Login"
    			document.getElementById("UName").style.display = "flex"
    			return
    		}
    		login_or_signup = "Login"
    		document.getElementById("LgText").innerText = "Login"
    		document.getElementById("Switcher").innerText = "Sign-Up"
    		document.getElementById("UName").style.display = "none"
    		return
    	})
    }
}