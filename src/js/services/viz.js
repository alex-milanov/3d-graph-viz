'use strict';

// lib
const d3 = require("d3");

const dragsubject = ({simulation, width, height}) => simulation
	.find(d3.event.x - width / 2, d3.event.y - height / 2);

const dragstarted = ({simulation}) => {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
};

const dragged = () => {
	d3.event.subject.fx = d3.event.x;
	d3.event.subject.fy = d3.event.y;
};

const dragended = ({simulation}) => {
	if (!d3.event.active) simulation.alphaTarget(0);
	d3.event.subject.fx = null;
	d3.event.subject.fy = null;
};

const drawLink = ({context, d}) => {
	context.moveTo(d.source.x, d.source.y);
	context.lineTo(d.target.x, d.target.y);
};

const drawNode = ({context, d}) => {
	context.moveTo(d.x + 12, d.y);
	context.arc(d.x, d.y, 12, 0, 2 * Math.PI);
};

// init d3

const hook = (state$, actions) => {
	var nodes = d3.range(15).map(function(i) {
		return {
			index: i
		};
	});

	var links = d3.range(nodes.length - 1).map(function(i) {
		return {
			source: Math.floor(Math.sqrt(i)),
			target: i + 1
		};
	});

	var simulation = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody())
		.force("link", d3.forceLink(links).distance(40).strength(1))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.on("tick", ticked);

	const canvas = document.querySelector("canvas#view");
	const context = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	d3.select(canvas)
		.call(d3.drag()
			.container(canvas)
			.subject(() => dragsubject({simulation, width, height}))
			.on("start", () => dragstarted({simulation}))
			.on("drag", () => dragged({simulation}))
			.on("end", () => dragended({simulation})));

	function ticked() {
		context.clearRect(0, 0, width, height);
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		links.forEach(d => drawLink({context, d}));
		context.strokeStyle = "#aaa";
		context.strokeWidth = 4;
		context.stroke();

		context.beginPath();
		nodes.forEach(d => drawNode({context, d}));
		context.fill();
		context.strokeStyle = "#fff";
		context.stroke();

		context.restore();
	}
};

module.exports = {
	hook
};
