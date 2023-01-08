const roomList = new Set();
const roomElm = {};
let currentRoom = "";
let username = "";

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
	let lastadded = "";
	roomElm[room].msg.forEach((o) => {
		let elm = msgTemplate.content.cloneNode(true);
		msglist.appendChild(elm);
		let child = msglist.querySelector('.msg:last-child');
		child.querySelector(".msg-from").innerText = o.user;
		child.querySelector(".msg-string").innerText = o.msg;
		if (o.sender) child.classList.toggle("sender");
		if (lastadded === o.user) {
			child.querySelector(".msg-from").remove();
		}

		lastadded = o.user;
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

message_input.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && !event.getModifierState("Shift")) {
		message_input.value = "";
	}
});
