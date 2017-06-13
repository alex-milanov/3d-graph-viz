'use strict';

const {section, button, span} = require('iblokz-snabbdom-helpers');

module.exports = ({state, actions}) => section('.counter', [
	button({on: {click: () => actions.set('number', state.number - 1)}}, 'Decrease'),
	span(`Number:`),
	span('[contenteditable="true"]', {
		on: {input: ev => actions.set('number', parseInt(ev.target.textContent, 10))}
	}, state.number),
	button({on: {click: () => actions.set('number', state.number + 1)}}, 'Increase')
]);
