import * as React from "react";
import * as moment from "moment";
import { debounce } from "underscore";

import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { DefaultButton, CommandButton, PrimaryButton, IButtonProps } from "office-ui-fabric-react/lib/Button";
import { ChoiceGroup } from "office-ui-fabric-react/lib/ChoiceGroup";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Label, ILabelProps } from "office-ui-fabric-react/lib/Label";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DatePicker, DayOfWeek } from "office-ui-fabric-react/lib/DatePicker"
import { SpinButton } from "office-ui-fabric-react/lib/SpinButton";

import Spacer from "./Spacer"
import {  Aspect } from "./App"

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
	aspect: Aspect;
	setAspect: (aspect: Aspect) => void;
	panelOpen: boolean;
}

interface HeaderComponentState {
	selectedCalendar: string;
}

export default class HeaderComponent extends React.Component<HeaderComponentProps, HeaderComponentState> {

	constructor(props: HeaderComponentProps) {
		super();
		this.dateChanged = this.dateChanged.bind(this);
		this.numWeeksChanged = this.numWeeksChanged.bind(this);
		this.handleAspectChange = this.handleAspectChange.bind(this);
		this.handleAspectChange = debounce(this.handleAspectChange, 1000);
		this.handleRef = this.handleRef.bind(this);
		this.state = {
			selectedCalendar: ""
		}
	}

	dateChanged(e: React.ChangeEvent<HTMLInputElement>) { }

	numWeeksChanged(e) {
		let numWeeks = Number(e.currentTarget.value);
		this.props.setNumWeeks(numWeeks);
	}

	handleAspectChange(param: { [key: string]: number }) {
		const newAspect = Object.assign({}, this.props.aspect, param);
		this.props.setAspect(newAspect);
	}

	handleRef(e: HTMLDivElement) {
		console.log(e.parentElement.parentElement);
		this.handleAspectChange({panelWidth: e.parentElement.parentElement.offsetWidth})
	}

	render() {
		return <Panel
			isOpen={this.props.panelOpen}
			isBlocking={false}
			onDismiss={() => this.handleAspectChange({panelWidth: 0})}
			>
			
			<div ref={this.handleRef}></div>

			<div className="ms-font-su ms-fontColor-themePrimary">Calendar</div>

			<TextField
				label="Number of weeks"
				onChanged={value => this.props.setNumWeeks(value as number)}
				value={this.props.numWeeks.toString()} />

			<DatePicker
				label={`Starting week number ${this.props.firstWeek.format("w")}`}
				onSelectDate={d => this.props.setFirstWeek(moment(d))}
				firstDayOfWeek={DayOfWeek.Monday}
				value={this.props.firstWeek.toDate()} />

			<PrimaryButton
				text="Print"
				onClick={e => window.print()}
				iconProps={{ iconName: "Print" }}></PrimaryButton>

			<hr />

			<Label>
				<span className="ms-fontWeight-semibold ms-fontColor-themePrimary">{
					this.props.signedIn ? this.props.user + " calendars" : "Sign in with your Google account"
				}</span>
			</Label>

			{this.props.signedIn ? <span>

				<ChoiceGroup
					selectedKey={this.state.selectedCalendar}
					onChange={(e, option) => {
						console.log(option)
						this.setState({ selectedCalendar: option.key })
						this.props.selectCalendar(option.key)
					}}
					value={this.state.selectedCalendar}
					options={this.props.calendars.map(calendar => ({
						key: calendar.id,
						text: calendar.summary
					}))}
				/>
				<DefaultButton
					text="Sign out"
					onClick={this.props.signOut} />
			</span> :
				<DefaultButton
					text="Sign in"
					onClick={this.props.signIn} />
			}

			<hr />

			<Label><span className="ms-fontWeight-semibold ms-fontColor-themePrimary">Settings</span></Label>

			<Fabric style={({ width: "100px" })}>
				<TextField
					label="Width"
					value={this.props.aspect.width.toString()}
					onChanged={v => this.handleAspectChange({ width: v })} />

				<TextField
					label="Height"
					value={this.props.aspect.height.toString()}
					onChanged={v => this.handleAspectChange({ height: v })} />

				<TextField
					label="Margin"
					value={this.props.aspect.margin.toString()}
					onChanged={v => this.handleAspectChange({ margin: v })} />
			</Fabric>


		</Panel>
	}

}
