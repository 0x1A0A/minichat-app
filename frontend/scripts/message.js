"use strict";

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

// render message to the site
const render_message = function (msg) {
	// the latest message in the list
	let prev_message = message.last_child();

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
	if (prev_message && prev_message.user === msg.user) from.remove();

	// for now scroll to the very bottom of the view
	let container = document.querySelector(".message-container");
	container.scrollTop = container.scrollHeight;
};

// add new message to the message list
// this load message from the eventstream
// msg = { user, room, msg }
const add_message = function (msg) {
	// check if this message is from the user or not
	msg.sender = app.username === msg.user;

	// add message to the list so when user leave the room and load again the message still persist
	app.room.element[msg.room].msg.push(msg);

	// then render message to the site
	render_message(msg);
};

// load message from the message list
const load_msg = function (roomname) {
	// clear old messages
	message.list.innerHTML = "";
	// render all messages from the list for current room
	app.room.element[roomname].msg.forEach(render_message);
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
