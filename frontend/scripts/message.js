"use strict";

const add_message = function (msg) {
	msg.sender = app.username === msg.user;
	app.room.element[msg.room].msg.push(msg);

	let childbefore = message.last_child();
	let elm = message.template.content.cloneNode(true);

	message.list.appendChild(elm);

	let child = message.last_child();

	let [from, new_message] = child.querySelectorAll("*");
	[from.innerText, new_message.innerText] = [msg.user, msg.msg];

	child.setAttribute("from", msg.user);

	if (msg.sender) child.classList.toggle("sender");
	if (childbefore.getAttribute("from") === msg.user) from.remove();

	let container = document.querySelector(".message-container");
	container.scrollTop = container.scrollHeight;
};

const get_event_source = function (roomname) {
	let uri = encodeURI(
		`http://${app.server}:${app.port}/message-stream/${roomname}`
	);
	let source = new EventSource(uri);

	source.onmessage = (e) => {
		add_message(JSON.parse(e.data));
	};

	app.room.element[roomname].src = source;
};

const get_messages = async function (roomname) {
	const apiUrl = encodeURI(
		`http://${app.server}:${app.port}/messages/${roomname}`
	);

	const requestOption = {
		method: "GET",
		header: { "Content-Type": "application/json" },
	};

	await fetch(apiUrl, requestOption)
		.then((response) => response.json())
		.then((res) => {
			res.forEach((element) => {
				element.sender = app.username == element.user;
				app.room.element[roomname].msg.push(element);
			});
		});
};

const load_msg = function (roomname) {
	message.list.innerHTML = "";
	let lastadded = "";
	app.room.element[roomname].msg.forEach((o) => {
		let elm = message.template.content.cloneNode(true);

		message.list.appendChild(elm);
		let child = message.last_child();

		let [from, new_message] = child.querySelectorAll("*");
		[from.innerText, new_message.innerText] = [o.user, o.msg];

		if (o.sender) child.classList.toggle("sender");
		if (lastadded === o.user) from.remove();

		lastadded = o.user;

		child.setAttribute("from", o.user);
	});
};

const post_message = async function (msg) {
	const apiUrl = encodeURI(`http://${app.server}:${app.port}/message`);

	const requestOption = {
		method: "POST",
		header: { "Content-Type": "application/json" },
		body: JSON.stringify(msg),
	};

	await fetch(apiUrl, requestOption).then((response) =>
		console.log(response.ok ? "Success" : "failure")
	);
};
