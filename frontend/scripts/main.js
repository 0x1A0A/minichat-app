"use strict";

const main = function () {
	const form = document.querySelector(".login-container");

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const input = form.querySelector("input");
		let val = input.value;

		val = val.trim();

		if (!val) return;

		app.username = val;
		input.value = "";

		document.querySelector(".username").textContent = app.username;
		form.parentElement.setAttribute("open", "false");
	});

	const room_w = document.querySelector(".room-input-w>form");
	const room_m = document.querySelector(".room-input-container>form");

	const getRoomName = function (e) {
		e.preventDefault();
		create_room_menu(e.target[0].value);
		e.target[0].value = "";
	};

	room_w.addEventListener("submit", getRoomName);
	room_m.addEventListener("submit", getRoomName);

	const textarea = document.querySelector("textarea");
	const icon = document.querySelector(".message-send");

	const send_message = (message) => {
		if (!app.username || !app.room.current) return;

		let val = message;
		val = val.trim();

		if (!val) return;

		let msg = {
			user: app.username,
			room: app.room.current,
			msg: val,
		};

		if (app.room.current) post_message(msg);
	};

	textarea.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !e.getModifierState("Shift")) {
			send_message(textarea.value);
			textarea.value = "";
		}
	});

	icon.addEventListener("click", (e) => {
		send_message(textarea.value);
		textarea.value = "";
	});

	const nav_t = document.querySelector(".navbar-toggle");
	let nav = document.querySelector("nav");
	nav_t.addEventListener("click", (e) => {
		let open = nav.getAttribute("open") === "true" ? "false" : "true";
		nav.setAttribute("open", open);
		nav_t.setAttribute("open", open);
	});
};

main();