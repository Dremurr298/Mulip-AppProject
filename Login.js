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

    		document.getElementById('submitForm').innerHTML = `
	    		<div style="
					width: 25px;
					height: 25px;
					border-radius: 50%;
					border: 7px solid #FFFFFF;
					border-top: 7px solid #23272A;
					animation: rotating 1s linear infinite;
					margin: 0 auto;
				"></div>
    		`

    		if(!email && !password || !email || !password) {
    			document.getElementById("smalltext").innerText = "Tolong Isi Semua Param!"
    			document.getElementById("submitForm").innerHTML = "Submit"
    			return
    		}

    		document.getElementById("smalltext").innerText = "\u00a0"
    		var em_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    		if(!em_regex.test(email)) {
    			document.getElementById("smalltext").innerText = "Email Invalid!"
    			document.getElementById("submitForm").innerHTML = "Submit"
    			return
    		}

    		fetch(`http://127.0.0.1:3000/login?email=${email}&password=${password}`)
    		.then(response => response.json())
    		.then(data => {
    			if(data['status'] == 404) {
    				document.getElementById("submitForm").innerHTML = "Submit"
    				document.getElementById("smalltext").innerText = "Email Tidak Ditemukan!"
    				return
    			}

    			else if(data['status'] == 401) {
    				document.getElementById("submitForm").innerHTML = "Submit"
    				document.getElementById("smalltext").innerText = "Password Salah!"
    				return
    			}

    			return document.getElementById("submitForm").innerHTML = "Submit"
    		})
    		.catch((err)=>{
    			console.log(err)
			})
    	})

    	document.getElementById('emailForm').addEventListener('keyup', () => {
    		let email = document.getElementById("emailForm").value
    		var em_regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    		if(!em_regex.test(email)) {
    			document.getElementById("EnvelopeSvgs").innerHTML = `
    				<img src="/Envelope_invalid.svg" style="width: 45px;height: 45px;">
    			`
    			return
    		}

    		document.getElementById("EnvelopeSvgs").innerHTML = `
				<img src="/Envelope_valid.svg" style="width: 45px;height: 45px;">
    		`
    	})
    }
}