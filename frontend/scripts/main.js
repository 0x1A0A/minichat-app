"use strict";

function main() {
	let username_form = document.querySelector("#input-username");

	username_form.addEventListener("keyup", (event) => {
		if (event.key === "Enter" && username_form.value) {
			document.querySelector(".login").classList.toggle("fadeout");
			let username_input = document.querySelector(".hide-username");
			username_input.textContent = app.username = username_form.value;
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
			create_room_menu(new_room_input.value);
			new_room_input.value = "";
		}
	});

	let message_input = document.querySelector(".message-input");
	let message_send = document.querySelector(".message-send-icon");

	const send_message = () => {
		let val = message_input.value;
		val = val.trim();

		if (!val) return;

		let msg = {
			user: app.username,
			room: app.room.current,
			msg: val,
		};

		if (app.room.current) post_message(msg);
	};

	message_input.addEventListener("keyup", (event) => {
		if (event.key === "Enter" && !event.getModifierState("Shift")) {
			send_message();
			message_input.value = "";
		}
	});

	message_send.addEventListener("click", () => {
		send_message();
	});
}

main();
