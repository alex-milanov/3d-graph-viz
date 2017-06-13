'use strict';

// dom
const {section, button, span, canvas} = require('iblokz-snabbdom-helpers');
// components
const counter = require('./counter');

module.exports = ({state, actions}) => section('#ui', [
	counter({state, actions}),
	state.needsRefresh === false ? canvas('#view[width="640"][height="480"]') : span()
]);
