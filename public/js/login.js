
function loadingAnimationFunction() {
	myVar = setTimeout(showPage, 100);
}

function showPage() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("loadingAnimationWrapper").style.display = "block";
}        


let messageFrom = this.document.querySelector('form');
let inputID = document.querySelector('#id');
let inputPassword = document.querySelector('#password');

messageFrom.addEventListener('submit', (e) => {


	fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				id: inputID.value,			
				password: inputPassword.value,
			}
		)
	})
	// .then(function(result) {
	// 		alert(JSON.stringify(result));
	// 	}
	// )

    // alert("로그인 \n"+"inputID.value : "+inputID.value+"\n inputPassword.value : " + inputPassword.value)
    
})