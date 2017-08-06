import * as React from "react";
import * as moment from "moment";


import { geometry } from "./Grid"

import DayComponent from "./Day";

export interface WeekComponentProps {
	startDate: moment.Moment;
	events: { date: string, text: string}[]
}

export interface WeekComponentState {
	weekNum: number;
	days: moment.Moment[];
}

export default class WeekComponent extends React.Component<WeekComponentProps, WeekComponentState> {

	private lastWeek = false;

	public styles: { [selector: string]: React.CSSProperties } = {
		week: {
			display: "flex",
			flexDirection: "row",
		},
		weekNum: {
			lineHeight: "40px",
			flexBasis: geometry.weekNumWidth + "px",
			textAlign: "center",
			paddingLeft: geometry.line1Style.strokeWidth + "px",
			paddingRight: geometry.line2Style.strokeWidth + "px",
			fontSize: "18px",
			fontWeight: "bold",
		},
		days: {
			flexGrow: 1,
			display: "flex",
			paddingRight: geometry.line1Style.strokeWidth + "px"
		}
	}

	constructor(props: WeekComponentProps) {
		super(props);

		this.lastWeek = !props.startDate.isSame(props.startDate.clone().add(7, "days"), "month");

		// if (this.lastWeek)
		// 	this.styles.weekNum.borderBottom = "3px solid black";

		this.state = {
			weekNum: Number(this.props.startDate.format("w")),
			days: []
		}

		for (let i = 0; i < 7; i++)
			this.state.days.push(this.props.startDate.clone().add(i, "days"));

	}

	public weekRef(e: HTMLDivElement) {

	}

	render() {
		// return <div style={this.styles.week}>
		// 	<div style={this.styles.weekNum}>{}</div>
		// 	<div style={this.styles.days} ref={e => this.weekRef(e)}>
		// 		{ this.state.days.map(day => <DayComponent date={day} key={day.format("YYMMDD")} events={this.props.events} />) }
		// 	</div>
		// </div>
	
		return null;
	}

}