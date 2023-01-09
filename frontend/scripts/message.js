"use strict";

// add new message to the message list
// this load message from the eventstream
const add_message = function (msg) {
	// check if this message is from the user or not
	msg.sender = app.username === msg.user;

	let message_arr = app.room.element[msg.room].msg;
	let prev_message = message_arr[message_arr.length - 1];

	// add message to the list
	// so when user leave the room and load again
	// the message still persist
	app.room.element[msg.room].msg.push(msg);

	// get the elment template add append to the list
	let elm = message.template.content.cloneNode(true);
	message.list.appendChild(elm);

	// get the element that recently added
	let child = message.last_child();

	// edit message
	let [from, new_message] = child.querySelectorAll("*");
	[from.innerText, new_message.innerText] = [msg.user, msg.msg];

	// if this is user message add sender class so the message go to the right side
	if (msg.sender) child.classList.toggle("sender");
	if (prev_message.user === msg.user) from.remove();

	// for now scroll to the very bottom of the view
	let container = document.querySelector(".message-container");
	container.scrollTop = container.scrollHeight;
};

// subscribe to the server stream
const get_event_source = function (roomname) {
	let uri = encodeURI(
		`http://${app.server}:${app.port}/message-stream/${roomname}`
	);
	let source = new EventSource(uri);

	// add callback to call when we get the message form stream
	source.onmessage = (e) => {
		add_message(JSON.parse(e.data));
	};

	// store the event source to the object
	app.room.element[roomname].src = source;
};

// request message of the room from server
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
			// itterate trought the response list and store it to our own list
			res.forEach((element) => {
				element.sender = app.username == element.user;
				app.room.element[roomname].msg.push(element);
			});
		});
};

// load message from the message list
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
		// remove sender element if the message is from the same user before
		if (lastadded === o.user) from.remove();

		lastadded = o.user;
	});
};

// post message to server
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
