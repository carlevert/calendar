import * as React from "react";

export interface ComponentProps { }

export interface ComponentState { }

export default class Component extends React.Component<ComponentProps, ComponentState> {

    styles: { [selector: string]: React.CSSProperties } = {
        component: { }
    }

    constructor(props: ComponentProps) {
        super(props);
    }

    render() {
        return <div style={this.styles.component}>
        </div>;
    }

}