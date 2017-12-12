import * as react from 'React';
import * as React from 'react';
import * as moment from 'moment';

import { Map, List } from "immutable";

import WeekComponent from "./Week";
import HeaderComponent from "./Header";
import Grid from "./Grid";

import { GoogleCalendarWrapper } from "../Google"

export interface Aspect {
	width: number,
	height: number,
	margin: number,
	panelWidth: number;
}

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
	aspect: Aspect,
	offset: number;
	panelOpen: boolean;
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
				margin: 5,
				panelWidth: 0
			},
			offset: 0,
			panelOpen: true
		}
	}

	resize() {

		const rect = {
			width: window.innerWidth - this.state.aspect.panelWidth,
			height: window.innerHeight
		}

		const aspect = (this.state.aspect.height - this.state.aspect.margin) / (this.state.aspect.width - this.state.aspect.margin);

		const paperMargin = 0.05;

		const paperSize = (rect.width - rect.width * paperMargin) * aspect < rect.height ? {
			paperWidth: rect.width - rect.width * paperMargin,
			paperHeight: (rect.width - rect.width * paperMargin) * aspect
		} : {
				paperWidth: (rect.height - rect.height * paperMargin) / aspect,
				paperHeight: rect.height - rect.height * paperMargin
			}
		this.setState({ offset: (window.innerWidth - this.state.aspect.panelWidth - paperSize.paperWidth) / 2 })
		this.setState(paperSize);


	}

	setFirstWeek(firstWeek: moment.Moment) {
		this.setState({
			firstWeek: moment(firstWeek).startOf("isoWeek")
		});
	}


	setAspect(aspect: Aspect) {
		this.setState({ aspect }, this.resize);
	}

	setNumWeeks(numWeeks: number) {
		this.setState({ numWeeks }, this.resize);
	}

	componentDidMount() {
		this.resize();
	}

	async signInOutCallback(signedIn: boolean) {
		this.setState({
			signedIn,
			user: signedIn ? this.google.user.getBasicProfile().getName() : undefined
		});

		if (signedIn) {
			const calendars = await this.google.fetchCalendars();
			this.setState({
				calendars,
				showSelectCalendar: true
			});
		}
		else {
			this.setState({
				showSelectCalendar: false,
				calendars: [],
				events: Map<string, List<{ date: moment.Moment, text: string }>>()
			});
		}

	}

	fetchEvents(calendarId: string) {
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

	selectCalendar(calendar: string) {
		this.setState({
			events: Map<string, List<{ date: moment.Moment, text: string }>>()
		})
		this.fetchEvents(calendar);

	}

	togglePanel() {
		this.setState({ panelOpen: !this.state.panelOpen });
	}

	render() {

		return <div>
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
				setAspect={this.setAspect.bind(this)}
				panelOpen={this.state.panelOpen}
			/>

			<Grid
				width={this.state.paperWidth}
				height={this.state.paperHeight}
				numWeeks={this.state.numWeeks}
				startDate={this.state.firstWeek}
				events={this.state.events}
				offset={({
					left: this.state.offset,
					top: 10
				})}
			/>

		</div>
	}
}