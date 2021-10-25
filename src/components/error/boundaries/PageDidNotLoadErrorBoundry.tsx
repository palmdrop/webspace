import React, { ErrorInfo } from 'react';

type Props = {
  fallback : React.ReactNode
}

type State = {
  hasError : boolean,
}

export class PageDidNotLoadErrorBoundry extends React.Component<Props, State> {
  constructor( props : Props ) {
    super( props );
    this.state = { hasError : false };
  }

  componentDidCatch( error : Error, errorInfo : ErrorInfo ) {
    this.setState( {
      hasError : true 
    });
  }

  render() {
    return this.state.hasError 
      ? this.props.fallback 
      : this.props.children
  }
}