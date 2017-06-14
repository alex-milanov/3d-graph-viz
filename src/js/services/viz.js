'use strict';

// lib
const d3 = require("d3");
const time = require('../util/time');
const Rx = require('rx');
const $ = Rx.Observable;

const dragsubject = ({simulation, width, height}) => simulation
	.find(d3.event.x - width / 2, d3.event.y - height / 2);

const dragstarted = ({simulation}) => {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
};

const dragged = () => {
	d3.event.subject.fx = d3.event.x
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
	context.beginPath();
	context.shadowBlur = 12;
	context.shadowColor = d.color;
	context.moveTo(d.x + 6, d.y);
	context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
	context.fillStyle = d.color;
	context.fill();
	context.font = "12px Arial";
	context.fillText(d.name, d.x + 18, d.y);
	if (d.data) {
		context.fillStyle = 'white';
		context.font = "8px Arial";
		context.fillText(d.data.temperature + '°C', d.x + 18, d.y + 14);
		context.fillText(d.data.humidity + '%', d.x + 18, d.y + 28);
	}
};

const hook = (state$, actions, canvas) => {
	const context = canvas.getContext("2d");
	canvas.width = canvas.parentNode.offsetWidth;
	canvas.height = canvas.parentNode.offsetHeight;
	let width = canvas.width;
	let height = canvas.height;

	function render({nodes, links}) {
		context.clearRect(0, 0, width, height);
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		links.forEach(d => drawLink({context, d}));
		context.shadowBlur = 40;
		context.shadowColor = "#111";
		context.strokeStyle = "#111";
		context.lineWidth = 1;
		context.stroke();

		nodes.forEach(d => drawNode({context, d}));

		context.restore();
	}

	state$.distinct(state => state.users.list)
		.subscribe(state => {
			let nodes = [{name: 'root'}]
				.concat(state.users.list)
				.map((user, i) => Object.assign({}, user, {
					index: i,
					color: i > 0 ? 'green' : 'red'
				}));

			let links = d3.range(nodes.length - 1).map(function(i) {
				return {
					source: 0,
					target: i + 1
				};
			});

			let simulation = d3.forceSimulation(nodes)
				.force("charge", d3.forceManyBody())
				.force("link", d3.forceLink(links).distance(70).strength(1))
				.force("x", d3.forceX())
				.force("y", d3.forceY())
				.on('tick', () => render({nodes, links}));

			d3.select(canvas)
				.call(d3.drag()
					.container(canvas)
					.subject(() => dragsubject({simulation, width, height}))
					.on("start", () => dragstarted({simulation}))
					.on("drag", () => dragged({simulation}))
					.on("end", () => dragended({simulation})));
		});

	window.addEventListener("resize", function() {
		if (canvas && canvas.parentNode) {
			canvas.width = canvas.parentNode.offsetWidth;
			canvas.height = canvas.parentNode.offsetHeight;
			width = canvas.width;
			height = canvas.height;
		}
	});
};

module.exports = {
	hook
};
