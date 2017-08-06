import * as React from 'react';

export interface ComponentProps { }

export interface ComponentState { }

export default class WeekComponent extends React.Component<ComponentProps, ComponentState> {

   public styles: { [selector: string]: React.CSSProperties } = {
      component: {
         outline: "1px solid red"
      }
   }

   constructor(props: ComponentProps) {
      super(props);
   }

   render() {
      return <div style={this.styles.component}>
      </div>
   }

}