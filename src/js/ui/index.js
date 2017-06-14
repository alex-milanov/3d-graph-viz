'use strict';

// dom
const {form, input, section, button, span, canvas, ul, li} = require('iblokz-snabbdom-helpers');
// components
const counter = require('./counter');

const formToData = form => Array.from(form.elements)
	// .map(el => (console.log(el.name), el))
	.filter(el => el.name !== undefined)
	.reduce((o, el) => ((o[el.name] = el.value), o), {});

const clearForm = form => Array.from(form.elements)
	.forEach(el => (el.value = null));

module.exports = ({state, actions}) => section('#ui', [
	section('.content', [
		section('.left-pane', [
			form('.add-user', {on: {submit: ev => {
				ev.preventDefault();
				const data = formToData(ev.target);
				actions.users.add(data);
				clearForm(ev.target);
			}}}, [
				input('[type="text"][name="name"][placeholder="user name"]'),
				input('[type="number"][name="temperature"][placeholder="temperature"]'),
				input('[type="number"][name="humidity"][placeholder="humidity"]'),
				button('[type="submit"]', 'Add User')
			]),
			ul('.users', state.users.list.map(user =>
				li(user.name)
			))
		]),
		section('.view3d', state.needsRefresh === false ? canvas('#viz') : '')
	])
]);
