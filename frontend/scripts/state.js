"use strict";

const app = {
	username: "",
	room: {
		current: "",
		list: new Set(),
		element: {
			toggleClass: function (roomname, classname) {
				this[roomname].elm.classList.toggle(classname);
			},
		},
	},
	server: "localhost",
	port: 8000,
};

const message = {
	template: document.querySelector(".message-container>template"),
	list: document.querySelector(".msg-list"),
	last_child: function () {
		return this.list.querySelector(".msg:last-child");
	},
};
