import * as React from "react";
import * as moment from "moment";
import { Map, List } from "immutable";

interface Event {
   date: moment.Moment;
   text: string;
}

interface DayComponentProps {
   x: number;
   y: number;
   width: number;
   height: number;
   date: moment.Moment;
   events: Map<string, List<Event>>;
   fontSize?: number;
}

interface DayComponentState {
   dateFormatString: string;
}

export default class DayComponent extends React.Component<DayComponentProps, DayComponentState> {

   public styles: { [selector: string]: React.CSSProperties } = {
   }

   constructor(props: DayComponentProps) {
      super(props);
      this.state = {
         dateFormatString: props.date.get("date") == 1 ? "D MMMM" : "D"
      }
   }

   render() {

      const key = this.props.date.format("YYMMDD");
      const transform = `translate(${this.props.x},${this.props.y})`
      const fontSize = this.props.height * 0.21;
      const x = this.props.width / 15;
      const y = this.props.height * 0.25;
      const eventsData = this.props.events.get(key, List());
      let i = 0;
      const events = eventsData.map((event, index) =>
         <text
            key={index}
            x={x}
            y={y * 1.2 + fontSize * (index + 1)}
            fontSize={fontSize}
            fontWeight={600}
            textAnchor={"left"}
            style={({
               fill: "black"
            })}>{event.text}</text>
      );


      return <g
         width={this.props.width}
         height={this.props.height}
         transform={transform}>

          {/* <rect 
            x={0}
            y={0}
            height={this.props.height}
            width={this.props.width}
            fill={"red"}
            opacity="0.2"/>  */}

         <text onClick={e => console.log(e)}
            x={x}
            y={y}
            fontSize={fontSize}
            fontWeight={600}
            textAnchor={"left"}
            style={({
               fill: "black"
            })}>{this.props.date.format(this.state.dateFormatString)}</text>

         {events}

      </g>
   }

}
