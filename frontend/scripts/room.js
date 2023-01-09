"use strict";

// when user select new room
// make element to switch state
const select_room = function (roomname) {
	if (app.room.current === roomname) return;

	if (!app.room.current) {
		// when there is no room has been selected
		// only change that element to selected state
		app.room.element.toggleClass(roomname, "room-selected");
	} else {
		if (!app.room.list.has(roomname)) return;
		// toogle old selected room and new selected room state
		app.room.element.toggleClass(app.room.current, "room-selected");
		app.room.element.toggleClass(roomname, "room-selected");
	}
	// change current room to room we are switching to
	app.room.current = roomname;
	// load new message to the message list
	load_messages(roomname);
};

// add new room to the room list
const create_room_menu = async function (roomname) {
	// prevent user from add the same name again
	if (app.room.list.has(roomname)) return;

	// add new room to the list for future reference
	app.room.list.add(roomname);

	// get the template and add to the element room list
	let parent = document.querySelector(".rooms-list");
	let template = document.querySelector(".room-list-container template");
	let elm = template.content.cloneNode(true);
	parent.appendChild(elm);

	// get newly added element for config
	let addedChild = parent.querySelector(".room:last-child");
	addedChild.querySelector("p").innerText = roomname;
	addedChild.addEventListener("click", () => select_room(roomname));

	// create new object for the room
	app.room.element[roomname] = {
		// dom element for future reference
		elm: addedChild,
		// list off the all message
		msg: new Array(),
	};

	// subscribe to server with the room name
	get_event_source(roomname);

	// load all message in the room from server
	get_messages(roomname).then(() => {
		// we select first room that has been added to be selected by default
		if (!app.room.current) select_room(roomname);
	});
};
