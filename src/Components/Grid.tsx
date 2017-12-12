import * as React from 'react';
import * as moment from "moment";

import { Map, List } from "immutable";

import Day from "./Day"

export const geometry = {
	line1Style: {
		strokeWidth: 6,
		stroke: "black",
	},
	line2Style: {
		strokeWidth: 3,
		fill: "transparent",
		stroke: "black",
	},
	line3Style: {
		strokeWidth: 0.7,
		fill: "transparent",
		stroke: "black",
	},

	weekNumWidth: 40,
}

export interface GridComponentProps {
	width: number;
	height: number;
	numWeeks: number;
	startDate: moment.Moment;
	events: Map<string, List<{ date: moment.Moment, text: string }>>
	offset: {
		left: number,
		top: number
	};
}

export interface GridComponentState { }

export default class GridComponent extends React.Component<GridComponentProps, GridComponentState> {

	static counter = 0;


	constructor(props: GridComponentProps) {
		super(props);
	}

	componentWillReceiveProps(props: GridComponentProps) {

		const size = Math.sqrt(props.width * props.width + props.height * props.height);
		const lineScale = 1000;
		
		geometry.weekNumWidth = size / 25;
		geometry.line1Style.strokeWidth = 6 * size / lineScale;
		geometry.line2Style.strokeWidth = 3 * size / lineScale;
		geometry.line3Style.strokeWidth = 1 * size / lineScale;
	}

	render() {
		const transform = `translate(${this.props.offset.left},${this.props.offset.top})`
		
		const weekHeight = this.props.height / this.props.numWeeks;
		const weekColWidth = geometry.weekNumWidth + geometry.line1Style.strokeWidth + geometry.line2Style.strokeWidth;

		const monthDividers = [];
		const weekDividers = [];
		const weekNums = [];
		const days = [];

		const containers = [];

		const dayX = (d: number) => geometry.weekNumWidth + geometry.line1Style.strokeWidth + geometry.line2Style.strokeWidth +
			((this.props.width - (geometry.weekNumWidth + 2 * geometry.line1Style.strokeWidth + geometry.line2Style.strokeWidth)) / 7) * d;

		const dayDividers = [];
		for (let i = 1; i < 7; i++) {
			const line = <line
				key={GridComponent.counter++}
				x1={dayX(i)}
				y1={0}
				x2={dayX(i)}
				y2={this.props.height}
				style={{ ...geometry.line3Style, stroke: "#ccc" }} />;

			dayDividers.push(line)
		}


		for (let i = 0; i < this.props.numWeeks; i++) {
			const week = this.props.startDate.clone().add(i, "weeks");

			for (let j = 0; j < 7; j++) {
				const date = week.clone().add(j, "days");
				const day = <Day
					key={date.format("YYMMDD")}
					x={dayX(j)}
					y={i * weekHeight}
					width={dayX(j + 1) - dayX(j)}
					height={this.props.height / this.props.numWeeks}
					date={date}
					events={this.props.events}
				/>
				days.push(day)
			}

			/* Horizontal lines separating weeks */
			const weekDivider = <line
				key={GridComponent.counter++}
				x1={0}
				y1={geometry.line3Style.strokeWidth / 2 + i * weekHeight}
				x2={this.props.width}
				y2={geometry.line3Style.strokeWidth / 2 + i * weekHeight}
				style={geometry.line3Style} />;
			weekDividers.push(weekDivider)

			if (i == 0) {
				weekDividers.push(<line
					key={GridComponent.counter++}
					x1={0}
					y1={-geometry.line3Style.strokeWidth / 2 + this.props.numWeeks * weekHeight}
					x2={this.props.width}
					y2={-geometry.line3Style.strokeWidth / 2 + this.props.numWeeks * weekHeight}
					style={geometry.line3Style} />);
			}

			/* Weeknums */
			// const weekNumFontSize = Math.min(geometry.weekNumWidth, weekHeight) * 0.6;
			const weekNumFontSize = weekHeight * 0.45;
			const weekNum = <text
				key={GridComponent.counter++}

				x={geometry.weekNumWidth / 2 + geometry.line1Style.strokeWidth}
				y={(i + 1) * weekHeight - 0.75 * weekNumFontSize}
				fontSize={weekNumFontSize}
				fontWeight={600}
				textAnchor={"middle"}
				style={({
					fill: "black"
				})}>{week.format("w")}</text>
			weekNums.push(weekNum);

			/* Line separating months */
			const lastWeek = week.daysInMonth() - week.date() < 7;
			if (lastWeek) {
				const daysLeft = week.daysInMonth() - week.date();
				const points = daysLeft == 6 ?
					[
						[0, (i + 1) * weekHeight],
						[this.props.width, (i + 1) * weekHeight]
					] : [
						[0, (i + 1) * weekHeight],
						[dayX(daysLeft + 1), (i + 1) * weekHeight],
						[dayX(daysLeft + 1), i * weekHeight],
						[this.props.width, i * weekHeight],
					];

				const pointsStr = points.map(point => point[0] + "," + point[1]).join(" ");
				const polyline = <polyline
					key={GridComponent.counter++}
					points={pointsStr}
					style={geometry.line2Style} />
				monthDividers.push(polyline)
			}

		}

		const viewBox = `0 0 ${this.props.width} ${this.props.height}`

		const backgroundAttrs = {
			fill: "white",
			x: 0,
			y: 0,
			width: this.props.width,
			height: this.props.height
		}

		return <svg className="calendar"
			width={this.props.width}
			height={this.props.height}
			viewBox={viewBox}
			transform={transform}
			>

			<rect { ...backgroundAttrs} />

			{dayDividers}
			{weekDividers}
			{monthDividers}

			<line
				x1={geometry.line1Style.strokeWidth / 2}
				y1={0}
				x2={geometry.line1Style.strokeWidth / 2}
				y2={this.props.height}
				style={geometry.line1Style} />

			<line
				x1={geometry.line1Style.strokeWidth + geometry.weekNumWidth + geometry.line2Style.strokeWidth / 2}
				y1={0}
				x2={geometry.line1Style.strokeWidth + geometry.weekNumWidth + geometry.line2Style.strokeWidth / 2}
				y2={this.props.height}
				style={geometry.line2Style} />

			<line
				x1={this.props.width - geometry.line1Style.strokeWidth / 2}
				y1={0}
				x2={this.props.width - geometry.line1Style.strokeWidth / 2}
				y2={this.props.height}
				style={geometry.line1Style} />

			{weekNums}
			{days}

		</svg >;

	}

}
