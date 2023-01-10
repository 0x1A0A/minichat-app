"use strict";

// main application state
const app = {
	// username use to post message
	username: "",
	// room object
	room: {
		// current room that we are viewing
		current: "",
		// list of all the added room
		// this prevent user to add the same room to the list
		list: new Set(),
		// all element of room button that has been added
		// doing this so we don't need to query every time user change a room
		element: {
			toggleClass: function (roomname, classname) {
				this[roomname].elm.classList.toggle(classname);
			},
		},
	},
	// backend server and port
	// don't actually have specific reason to keep it here
	// just when we change server we don't need to hunt down the whole project
	server: "localhost",
	port: 8000,
};

// message list and template for easy access
const message = {
	template: document.querySelector(".messages>template"),
	list: document.querySelector(".message-list"),
	// hopefully the code look cleanner
	last_child: function () {
		return this.list.querySelector(".message:last-child");
	},
};
