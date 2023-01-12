"use strict";

function main() {
	let username_form = document.querySelector("#input-username");

	username_form.addEventListener("keydown", (event) => {
		if (event.key === "Enter" && username_form.value) {
			document.querySelector(".login").classList.toggle("fadeout");
			let username_input = document.querySelector(".username");
			username_input.textContent = app.username = username_form.value;
			username_input.classList.toggle("show-username");
			document.querySelector("main").classList.toggle("fadein");
		}
	});

	let new_room_input = document.querySelector(".room-input>input");

	new_room_input.addEventListener("keyup", (event) => {
		if (event.key === "Enter" && new_room_input.value) {
			create_room_menu(new_room_input.value);
			new_room_input.value = "";
		}
	});

	let message_input = document.querySelector(".message-input textarea");

	const send_message = () => {
		if (!app.username || !app.room.current) return;

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

}

main();
