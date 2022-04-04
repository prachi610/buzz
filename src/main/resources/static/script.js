
let stompClient = null;

function connect(){
	
	let socket = new SockJS("/connectTo")
	stompClient = Stomp.over(socket);
	
	stompClient.connect({}, function(frame){
		
		$("#name-form").addClass('d-none')
		$("#chat-room").removeClass('d-none')
		let chtHd = document.getElementById('head-chat')
		let name = $("#name-value").val();
		chtHd.innerText = `Welcome ${name} ...`;
		connectionSuccess();
		
	})
	
}

function connectionSuccess() {
	stompClient.subscribe('/topic/return-to', onMessageReceived);

	stompClient.send("/app/chat.newUser", {}, JSON.stringify({
		name : localStorage.getItem("name"),
		type : 'newUser'
	}))

}

function sendMessage(event) {

		var chatMessage = {
			name : localStorage.getItem("name"),
			content: $("#message-value").val(),
			type : 'CHAT'
			}

		stompClient.send("/app/chat.sendMessage", {}, JSON
				.stringify(chatMessage));
		document.querySelector('.input-group').value = '';
	}



function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);


	if (message.type === 'newUser') {
		showMessagenew(JSON.parse(payload.body));
		
	} else if (message.type === 'LEAVE') {
		showMessageleft(JSON.parse(payload.body));
	} else {
		showMessage(JSON.parse(payload.body));
		
	}

	
}


function showMessagenew(message){
	
	$("#msg-container").prepend(`
		
		<p>
		<b>${message.name}</b>
		joined!
		</p>
		
	`)
	
}

function showMessageleft(message){
	console.log("left called")
	$("#msg-container").prepend(`
		
		<p>
		<b>${message.name}</b>
		left!
		</p>
		
	`)
	
}
function showMessage(message){
	
	$("#msg-container").prepend(`
		
		<div>
		<b> ${message.name} </b> <br>
		<span> ${message.content} </span>
		</div>
		
	`)
	
}


function connectionRemove() {
	var chatMessage = {
			name : localStorage.getItem("name"),
			content: '',
			type : 'LEAVE'
			}

		stompClient.send("/app/chat.sendMessage", {}, JSON
				.stringify(chatMessage));
}

$(document).ready((e)=>{
	
	$("#login").click(() =>{
		let name = $("#name-value").val();
		localStorage.setItem("name", name);
		connect();
		
	})
	document.getElementById('name-value').onkeydown = function(e){
	   if(e.keyCode == 13){
	     let name = $("#name-value").val();
		 localStorage.setItem("name", name);
		 connect();
	   }
	};
	
	$("#send-btn").click(() =>{
		sendMessage();
		console.log(stompClient)
		document.getElementById('message-value').value = "";
	     document.getElementById("chat-hint").style.opacity = '0';
		
	})
	document.getElementById('message-value').onkeydown = function(e){
	   if(e.keyCode == 13){
	     sendMessage();
	     document.getElementById('message-value').value = "";
	     document.getElementById("chat-hint").style.opacity = '0';
	   }
	};
	
	$("#logout").click(() =>{
		
		connectionRemove()
		localStorage.removeItem("name")
		if(stompClient !== null){
			stompClient.disconnect()
			
			$("#name-form").removeClass('d-none')
			$("#chat-room").addClass('d-none')
		}
	})
	
	
})









