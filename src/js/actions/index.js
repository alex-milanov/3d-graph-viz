'use strict';

// lib
const {obj} = require('iblokz-data');

const users = require('./users');

// initial
const initial = {
	number: 0,
	needsRefresh: false,
	users: []
};

// actions
const set = (path, value) => state => obj.patch(state, path, value);
const toggle = path => state => obj.patch(state, path, !obj.sub(state, path));

module.exports = {
	initial,
	users,
	set,
	toggle
};
