'use strict';

// lib
const {obj} = require('iblokz-data');

// initial
const initial = {
	number: 0,
	needsRefresh: false
};

// actions
const set = (path, value) => state => obj.patch(state, path, value);
const toggle = path => state => obj.patch(state, path, !obj.sub(state, path));

module.exports = {
	initial,
	set,
	toggle
};
