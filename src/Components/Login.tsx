import * as React from 'react';
import { GoogleCalendarWrapper } from "../Google"

import { Fabric } from "office-ui-fabric-react/lib/Fabric";
// import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { ChoiceGroup } from "office-ui-fabric-react/lib/ChoiceGroup";
// import { DatePicker } from "office-ui-fabric-react/lib/DatePicker"

export interface ComponentProps {
   signedIn: boolean;
   signOut: () => void;
   signIn: () => void;
   user: string;
   calendars: gapi.client.calendar.CalendarListEntry[];
   selectCalendar: (calendar: string) => void;
}

export interface ComponentState {
}

// <select onChange={(e) => this.props.selectCalendar(e.currentTarget.value)}>

const Calendars = (props: {
   calendars: gapi.client.calendar.CalendarListEntry[];
   selectCalendar: (calendar: string) => void
}) => {
   if (props.calendars.length == 0)
      return null;
   const options = props.calendars.map(calendar => ({
      key: calendar.id,
      text: calendar.summary,
      label: "Calendars"
   }))
   const defaultSelectedKey = props.calendars[0].id;
   return <Fabric>
      <ChoiceGroup options={options} defaultSelectedKey={defaultSelectedKey} />
      </Fabric>

}
// <div className="group">
//    <div className="group-label">Calendars</div>
//    {props.calendars.map(calendar => <div className="row radio">
//       <input
//          name="calendar-radio"
//          type="radio"
//          key={calendar.id}
//          value={calendar.id}
//          onChange={e => props.selectCalendar(e.currentTarget.value)} />
//       <label htmlFor={calendar.id}>{calendar.summary}</label>
//    </div>)}
// </div>





const SignOut = (props: {
   name: string; signOut: () => void,
   calendars: gapi.client.calendar.CalendarListEntry[],
   selectCalendar: (calendar: string) => void
}) => <div>
      <div className="group-label">Signed in as {props.name}</div>
      <button className="main" onClick={props.signOut}>Sign out</button>

      <Calendars calendars={props.calendars} selectCalendar={props.selectCalendar} />
   </div >

const SignIn = (props: { signIn: () => void }) =>

   <div>
      <div className="group-label">Sign in with your Google Account</div>
      <button className="main" onClick={props.signIn}>Sign in</button>

   </div >



export default class LoginComponent extends React.Component<ComponentProps, ComponentState> {

   render() {
      return <div className="group">
         {this.props.signedIn ? <SignOut signOut={this.props.signOut} name={this.props.user}
            calendars={this.props.calendars} selectCalendar={this.props.selectCalendar} /> : <SignIn signIn={this.props.signIn} />}
      </div>
   }

}