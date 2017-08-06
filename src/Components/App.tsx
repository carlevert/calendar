import * as react from 'React';
import * as React from 'react';
import * as moment from 'moment';

import { Map, List } from "immutable";

import WeekComponent from "./Week";
import HeaderComponent from "./Header";
import Grid from "./Grid";

import { GoogleCalendarWrapper } from "../Google"


interface AppComponentProps {
	startDate: moment.Moment;
	numWeeks: number;
}

interface AppComponentState {
	numWeeks: number;
	firstWeek: moment.Moment;
	paperWidth: number;
	paperHeight: number;
	user: string;
	signedIn: boolean;
	events: Map<string, List<{ date: moment.Moment, text: string }>>
	selectedCalendar: gapi.client.calendar.CalendarListEntry;
	calendars: gapi.client.calendar.CalendarListEntry[];
	showSelectCalendar: boolean;
	aspect: {
		width: number,
		height: number,
		margin: number
	},
}

export default class App extends React.Component<AppComponentProps, AppComponentState> {

	private google = new GoogleCalendarWrapper(this.signInOutCallback.bind(this));
	private rightCol: HTMLDivElement;

	constructor(props: AppComponentProps) {
		super(props);
		this.google.start();
		window.addEventListener("resize", this.resize.bind(this));
		this.state = {
			numWeeks: props.numWeeks,
			firstWeek: moment(this.props.startDate).startOf("isoWeek"),
			paperHeight: 0,
			paperWidth: 0,
			user: undefined,
			signedIn: false,
			events: Map(),
			calendars: [],
			selectedCalendar: null,
			showSelectCalendar: false,
			aspect: {
				width: 210,
				height: 297,
				margin: 5
			}
		}
	}

	public resize() {

		const rect = this.rightCol.getBoundingClientRect();

		const aspect = (this.state.aspect.height - this.state.aspect.margin) / (this.state.aspect.width - this.state.aspect.margin);

		const margin = 0.05;

		const paperSize = (rect.width - rect.width * margin) * aspect < rect.height ? {
			paperWidth: rect.width - rect.width * margin,
			paperHeight: (rect.width - rect.width * margin) * aspect
		} : {
				paperWidth: (rect.height - rect.height * margin) / aspect,
				paperHeight: rect.height - rect.height * margin
			}

		this.setState(paperSize);

	}

	public setFirstWeek(firstWeek: moment.Moment) {
		this.setState({
			firstWeek: moment(firstWeek).startOf("isoWeek")
		});
	}


	public setAspect(aspect: { width: number, height: number, margin: number }) {
		console.log(aspect);
		this.setState({ aspect }, this.resize);
	}

	public setNumWeeks(numWeeks: number) {
		this.setState({ numWeeks }, this.resize);
	}

	public componentDidMount() {
		this.resize();
	}

	public signInOutCallback(signedIn: boolean) {
		this.setState({
			signedIn,
			user: signedIn ? this.google.user.getBasicProfile().getName() : undefined
		});

		if (signedIn) {
			this.google.fetchCalendars().then(calendars => {
				console.log(calendars);
				this.setState({
					calendars,
					showSelectCalendar: true
				});
			}
			);

		} else {
			this.setState({
				showSelectCalendar: false,
				calendars: [],
				events: Map<string, List<{ date: moment.Moment, text: string }>>()
			});
		}

	}

	public fetchEvents(calendarId: string) {
		const startDate = this.state.firstWeek.toISOString();
		const endDate = this.state.firstWeek.clone().add(this.state.numWeeks, "weeks").toISOString();
		this.google.fetchEntries(calendarId, startDate, endDate).then(events => {

			events.forEach(event => {
				if (event.start.dateTime) {
					const key = moment(event.start.dateTime).format("YYMMDD");
					const list = this.state.events.get(key, List())
					const newEvent = {
						date: moment(event.start.dateTime),
						text: moment(event.start.dateTime).format("HH:mm") + " " + event.summary
					}
					const newList = list.push(newEvent);
					this.setState({
						events: this.state.events.set(key, newList)
					});
				}
				else if (event.start.date) {
					const key = moment(event.start.date).format("YYMMDD");
					const list = this.state.events.get(key, List())
					const newEvent = {
						date: moment(event.start.dateTime),
						text: event.summary
					}
					const newList = list.push(newEvent);
					this.setState({
						events: this.state.events.set(key, newList)
					});

				}
				else {
					throw Error("Unhandled event in fetchEvents")
				}
			});
		});
	}

	public selectCalendar(calendar: string) {
		this.setState({
			events: Map<string, List<{ date: moment.Moment, text: string }>>()
		})
		this.fetchEvents(calendar);

	}

	public handleRightColRef(rightCol: HTMLDivElement) {
		this.rightCol = rightCol;
	}

	public styles: { [selector: string]: React.CSSProperties } = {
		component: {
			display: "flex",
			flexDirection: "row"
		},
		rightColumn: {
			position: "relative",
			flexGrow: 1,
			overflow: "hidden"
		}
	}

	render() {

		return <div style={this.styles.component}>

			<HeaderComponent
				firstWeek={this.state.firstWeek}
				numWeeks={this.state.numWeeks}
				setFirstWeek={this.setFirstWeek.bind(this)}
				setNumWeeks={this.setNumWeeks.bind(this)}
				user={this.state.user}
				signIn={this.google.signIn}
				signOut={this.google.signOut}
				signedIn={this.state.signedIn}
				calendars={this.state.calendars}
				selectCalendar={this.selectCalendar.bind(this)}
				aspect={this.state.aspect}
				setAspect={this.setAspect.bind(this)} />

			<Grid
				width={this.state.paperWidth}
				height={this.state.paperHeight}
				numWeeks={this.state.numWeeks}
				startDate={this.state.firstWeek}
				e={this.state.events} />

			<div style={this.styles.rightColumn} ref={this.handleRightColRef.bind(this)}></div>

		</div>
	}
}