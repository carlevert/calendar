import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { State } from '../reducer';


interface MainProps {
    title: string;
}

@connect(mapStateToProps, mapDispatchToProps)
export class Main extends React.Component<MainProps, any> {

  render() {
    const { title } = this.props;
    return (
      <div>Title: {title}</div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
     
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(TodoActions as any, dispatch)
  };
}