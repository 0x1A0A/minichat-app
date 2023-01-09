const roomList = new Set();
const roomElm = {};
let currentRoom = "";
let username = "";

const addmessage = function (msg) {
	msg.sender = username === msg.user;
	roomElm[msg.room].msg.push(msg);

	let msglist = document.querySelector(".msg-list");
	let msgTemplate = document.querySelector(".message-container>template");

	let childbefore = msglist.querySelector(".msg:last-child");

	let elm = msgTemplate.content.cloneNode(true);
	msglist.appendChild(elm);

	let child = msglist.querySelector(".msg:last-child");

	child.querySelector(".msg-from").innerText = msg.user;
	child.querySelector(".msg-string").innerText = msg.msg;
	child.setAttribute("from", msg.user);

	if (msg.sender) child.classList.toggle("sender");

	let before = childbefore.getAttribute("from");
	if (before === msg.user) child.querySelector(".msg-from").remove();

	let container = document.querySelector(".message-container");
	container.scrollTop = container.scrollHeight;
};

const getEventSource = function (room) {
	let uri = encodeURI(`http://localhost:8000/message-stream/${room}`);
	let source = new EventSource(uri);

	source.onmessage = (e) => {
		addmessage(JSON.parse(e.data));
	};

	roomElm[room].src = source;
};

const getMessages = async function (name) {
	const apiUrl = encodeURI(`http://localhost:8000/messages/${name}`);

	const requestOption = {
		method: "GET",
		header: { "Content-Type": "application/json" },
	};

	await fetch(apiUrl, requestOption)
		.then((response) => response.json())
		.then((res) => {
			res.forEach((element) => {
				element.sender = username == element.user;
				roomElm[name].msg.push(element);
			});

			console.log(roomElm[name].msg);
		});
};

const loadMsg = function (room) {
	let msglist = document.querySelector(".msg-list");
	let msgTemplate = document.querySelector(".message-container>template");
	msglist.innerHTML = "";
	lastadded = "";
	roomElm[room].msg.forEach((o) => {
		let elm = msgTemplate.content.cloneNode(true);
		msglist.appendChild(elm);
		let child = msglist.querySelector(".msg:last-child");
		child.querySelector(".msg-from").innerText = o.user;
		child.querySelector(".msg-string").innerText = o.msg;
		if (o.sender) child.classList.toggle("sender");
		if (lastadded === o.user) {
			child.querySelector(".msg-from").remove();
		}

		lastadded = o.user;

		msglist.setAttribute("from", o.user);
	});
};

const selectRoom = function (name) {
	if (currentRoom === name) return;

	if (!currentRoom) {
		roomElm[name].elm.classList.toggle("room-selected");
	} else {
		if (!roomList.has(name)) return;
		roomElm[currentRoom].elm.classList.toggle("room-selected");
		roomElm[name].elm.classList.toggle("room-selected");
	}
	currentRoom = name;
	loadMsg(name);
};

const createRoomMenu = async function (name) {
	if (roomList.has(name)) return;

	roomList.add(name);

	let parent = document.querySelector(".rooms-list");
	let template = document.querySelector(".room-list-container template");
	let elm = template.content.cloneNode(true);
	parent.appendChild(elm);

	let addedChild = parent.querySelector(".room:last-child");

	roomElm[name] = new Object();
	roomElm[name].elm = addedChild;
	roomElm[name].msg = new Array();

	getEventSource(name);

	getMessages(name).then(() => {
		if (!currentRoom) selectRoom(name);

		addedChild.querySelector("p").innerText = name;

		addedChild.addEventListener("click", () => selectRoom(name));
	});
};

let username_form = document.querySelector("#input-username");

username_form.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && username_form.value) {
		document.querySelector(".login").classList.toggle("fadeout");
		let username_input = document.querySelector(".hide-username");
		username_input.textContent = username = username_form.value;
		username_input.classList.toggle("show-username");
		document.querySelector(".main").classList.toggle("fadein");
	}
});

let new_room_container = document.querySelector(".room-input-container");
let new_room_p = new_room_container.querySelector("p");
let new_room_input = new_room_container.querySelector("input");

new_room_p.addEventListener("click", () => {
	if (new_room_input.classList.toggle("room-input-show")) {
		new_room_input.focus();
	}
});

new_room_input.addEventListener("focusout", () => {
	new_room_input.classList.toggle("room-input-show");
});

new_room_input.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && new_room_input.value) {
		createRoomMenu(new_room_input.value);
		new_room_input.value = "";
	}
});

let message_input = document.querySelector(".message-input");
let message_send = document.querySelector(".message-send-icon");

const sendMessage = async function (msg) {
	const apiUrl = encodeURI(`http://localhost:8000/message`);

	const requestOption = {
		method: "POST",
		header: { "Content-Type": "application/json" },
		body: JSON.stringify(msg),
	};

	await fetch(apiUrl, requestOption).then((response) =>
		console.log(response.ok ? "Success" : "failure")
	);
};

message_input.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && !event.getModifierState("Shift")) {
		let msg = {};
		let val = message_input.value;
		val = val.trim();

		if (!val) return;

		msg.user = username;
		msg.room = currentRoom;
		msg.msg = val;
		message_input.value = "";

		if (currentRoom) sendMessage(msg);
	}
});
