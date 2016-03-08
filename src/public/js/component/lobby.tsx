import * as React from "react";

export default class Lobby extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            users: [] as string[]
        };
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ users: nextProps.users });
    }

    private users() {
        return (this.state.users as string[]).join("\n");
    }

    render() {
        return <div>
            <div style={{ marginRight: "0.25em" }} className="ui input">
                <input ref="name" type="text"/>
            </div>
            <button className="ui button" onClick={() => {
                this.props.onJoin((this.refs["name"] as HTMLInputElement).value);
            } }>Join</button>
            <button className="ui button" onClick={this.props.onLeave}>Leave</button>
            <br/>
            <textarea cols={20} rows={10} readOnly>{this.users() }</textarea>
        </div>;
    }
}
