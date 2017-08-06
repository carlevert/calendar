import * as React from "react";
import * as moment from "moment";

import Login from "./Login"
import Spacer from "./Spacer"

const NumWeeks = (props: { numWeeks: number, setNumWeeks: (numWeeks: number) => void }) => <div className="group">
	<div className="group-label">Number of weeks</div>
	<div className="row">
		<input type="text"
			onChange={e => props.setNumWeeks(Number(e.currentTarget.value))}
			value={props.numWeeks} />
		<button onClick={e => props.setNumWeeks(props.numWeeks - 1)}><i className="fa fa-minus"></i></button>
		<button onClick={e => props.setNumWeeks(props.numWeeks + 1)}><i className="fa fa-plus"></i></button>
	</div>
</div>


const FirstWeek = (props: { firstWeek: moment.Moment, setFirstWeek: (weekNumber: moment.Moment) => void }) =>
	<div className="group">
		<div className="group-label">First week</div>
		<div className="row">

			<div>Week {props.firstWeek.format("w")}
				<button onClick={e => props.setFirstWeek(props.firstWeek.clone().subtract(1, "week"))}>
					<i className="fa fa-minus"></i>
				</button>
				<button onClick={e => props.setFirstWeek(props.firstWeek.clone().add(1, "week"))}><i className="fa fa-plus"></i></button>
			</div>
		</div>

		<div>Starting {props.firstWeek.format("dddd YYYY-MM-DD")}</div>

	</div>

// -----------------------------------------

interface HeaderComponentProps {
	numWeeks: number;
	firstWeek: moment.Moment;
	setFirstWeek: (firstWeek: moment.Moment) => void;
	setNumWeeks: (numWeeks: number) => void;
	signIn: () => void;
	signOut: () => void;
	signedIn: boolean;
	user: string;
	calendars: gapi.client.calendar.CalendarListEntry[],
	selectCalendar: (calendar: string) => void,
	aspect: {
		width: number,
		height: number,
		margin: number
	}
	setAspect: (aspect: { width: number, height: number, margin: number }) => void;
}

interface HeaderComponentState {
	formattedStartDate: string;
	startDate: moment.Moment;
}

export default class HeaderComponent extends React.Component<HeaderComponentProps, HeaderComponentState> {

	constructor(props: HeaderComponentProps) {
		super();
		this.dateChanged = this.dateChanged.bind(this);
		this.numWeeksChanged = this.numWeeksChanged.bind(this);
		this.handleAspectChange = this.handleAspectChange.bind(this);
	}

	public dateChanged(e: React.ChangeEvent<HTMLInputElement>) {
	}

	public numWeeksChanged(e) {
		let numWeeks = Number(e.currentTarget.value);
		this.props.setNumWeeks(numWeeks);
	}

	public handleAspectChange(e: React.SyntheticEvent<HTMLInputElement>) {
		const change = { [e.currentTarget.name]: Number(e.currentTarget.value) }
		const newAspect = Object.assign({}, this.props.aspect, change);
		console.log(change)
		this.props.setAspect(newAspect);
	}


	render() {
		return <div className="header">
			<div className="title">Calendar</div>

			<NumWeeks
				numWeeks={this.props.numWeeks}
				setNumWeeks={this.props.setNumWeeks} />
			<FirstWeek
				firstWeek={this.props.firstWeek}
				setFirstWeek={this.props.setFirstWeek} />


			<Login signedIn={this.props.signedIn}
				signIn={this.props.signIn}
				signOut={this.props.signOut}
				user={this.props.user}
				calendars={this.props.calendars}
				selectCalendar={this.props.selectCalendar} />

			<div className="group">
				<div className="group-label">Aspect ratio</div>
				<div className="row">
					<label htmlFor="aspect-width">Width</label>
					<input type="number"
						name="width"
						value={this.props.aspect.width}
						onChange={this.handleAspectChange}
						id="aspect-width" />
				</div>
				<div className="row">

					<label htmlFor="aspect-height">Height</label>
					<input type="number"
						name="height"
						value={this.props.aspect.height}
						onChange={this.handleAspectChange}
						id="aspect-width" />
				</div>
				<div className="row">
					<label htmlFor="aspect-margin">Margin</label>
					<input type="number"
						name="margin"
						value={this.props.aspect.margin}
						onChange={this.handleAspectChange}
						id="aspect-margin" />
				</div>
			</div>

			<div className="group">
				<button className="main" onClick={e => window.print()}>Print</button>
			</div>


		</div>
	}

}
