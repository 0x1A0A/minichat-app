"use strict";

const select_room = function (roomname) {
	if (app.room.current === roomname) return;

	if (!app.room.current) {
		app.room.element.toggleClass(roomname, "room-selected");
	} else {
		if (!app.room.list.has(roomname)) return;
		app.room.element.toggleClass(app.room.current, "room-selected");
		app.room.element.toggleClass(roomname, "room-selected");
	}
	app.room.current = roomname;
	load_msg(roomname);
};

const create_room_menu = async function (roomname) {
	if (app.room.list.has(roomname)) return;

	app.room.list.add(roomname);

	let parent = document.querySelector(".rooms-list");
	let template = document.querySelector(".room-list-container template");
	let elm = template.content.cloneNode(true);
	parent.appendChild(elm);

	let addedChild = parent.querySelector(".room:last-child");

	app.room.element[roomname] = new Object();
	app.room.element[roomname].elm = addedChild;
	app.room.element[roomname].msg = new Array();

	get_event_source(roomname);

	get_messages(roomname).then(() => {
		if (!app.room.current) select_room(roomname);

		addedChild.querySelector("p").innerText = roomname;

		addedChild.addEventListener("click", () => select_room(roomname));
	});
};
