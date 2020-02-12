// let messageFrom = this.document.querySelector('form');
// let name = document.querySelector('#name');
// let email = document.querySelector('#email');
// let message = document.querySelector('#message');
// let url = document.querySelector('#url');
// let phone = document.querySelector('#phone');

messageFrom.addEventListener('submit', (e) => {


	fetch('/writePost', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			{
				name: name.value,			
				email: email.value,
				url: url.value,
				message: message.value,

			}
		)
	});

	alert("등록이 완료 되었습니다 \n"+"name.value : "+name.value+"\n message.value : " + message.value);
})