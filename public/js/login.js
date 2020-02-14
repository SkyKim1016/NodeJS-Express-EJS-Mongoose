let messageFrom = this.document.querySelector('form');
let inputID = document.querySelector('#inputID');
let inputPassword = document.querySelector('#inputPassword');

messageFrom.addEventListener('submit', (e) => {


	fetch('/writePost', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				inputID: inputID.value,			
				inputPassword: inputPassword.value,
			}
		)
	});

    alert("로그인 \n"+"inputID.value : "+inputID.value+"\n inputPassword.value : " + inputPassword.value)
    
})