'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;

// iblokz
const vdom = require('iblokz-snabbdom-helpers');
const {obj, arr} = require('iblokz-data');

// app
const app = require('./util/app');
let actions = app.adapt(require('./actions'));
let ui = require('./ui');
// services
let viz = require('./services/viz');

let actions$;
let state$;

// hot reloading
if (module.hot) {
	// actions
	actions$ = $.fromEventPattern(
		h => module.hot.accept("./actions", h)
	).flatMap(() => {
		actions = app.adapt(require('./actions'));
		return actions.stream.startWith(state => state);
	}).merge(actions.stream);
	// ui
	module.hot.accept("./ui", function() {
		ui = require('./ui');
		actions.stream.onNext(state => state);
	});
	module.hot.accept("./services/viz", function() {
		console.log('updating viz');
		viz = require('./services/viz');
		actions.set('needsRefresh', true);
		// state$.connect();
	});
} else {
	actions$ = actions.stream;
}

// actions -> state
state$ = actions$
	.startWith(() => actions.initial)
	.scan((state, change) => change(state), {})
	.map(state => (console.log(state), state))
	.publish();

// state -> ui
const ui$ = state$.map(state => ui({state, actions}));
vdom.patchStream(ui$, '#ui');

// refesh
state$.distinctUntilChanged(state => state.needsRefresh)
	.subscribe(state => {
		console.log('refresh', state.needsRefresh);
		if (!state.needsRefresh) setTimeout(() => viz.hook(state$, actions), 100);
		else
			actions.toggle('needsRefresh');
	});

state$.connect();
