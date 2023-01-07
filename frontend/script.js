const roomList = new Set();
const roomElm = {};
let currentRoom = "";

const selectRoom = function (name) {
	if (!currentRoom) {
		roomElm[name].classList.toggle('room-selected');
	} else {
		if (!roomList.has(name)) return;
		roomElm[currentRoom].classList.toggle('room-selected');
		roomElm[name].classList.toggle('room-selected');
	}
	currentRoom = name;
};

const createRoomMenu = function (name) {
	if (roomList.has(name)) return;

	roomList.add(name);

	let parent = document.querySelector(".rooms-list");
	let template = parent.querySelector("template");
	let elm = template.content.cloneNode(true);
	parent.appendChild(elm);

	let addedChild = parent.querySelector(".room:last-child");

	roomElm[name] = addedChild;

	if (!currentRoom) selectRoom(name);

	addedChild.querySelector("p").innerText = name;

	addedChild.addEventListener("click", () => selectRoom(name));
};

let username_form = document.querySelector("#input-username");

username_form.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && username_form.value) {
		document.querySelector(".login").classList.toggle("fadeout");
		let username = document.querySelector(".hide-username");
		username.textContent = username_form.value;
		username.classList.toggle("show-username");
		document.querySelector(".main").classList.toggle("fadein");
	}
});

let new_room_container = document.querySelector(".room-input-container");
let new_room_p = new_room_container.querySelector("p");
let new_room_input = new_room_container.querySelector("input");

new_room_p.addEventListener("click", () => {
	new_room_input.classList.toggle("room-input-show");
});

new_room_input.addEventListener("keyup", (event) => {
	if (event.key === "Enter" && new_room_input.value) {
		createRoomMenu(new_room_input.value);
		new_room_input.value = "";
	}
});
