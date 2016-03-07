import * as React from "react";

export default class Lobby extends React.Component<any, any> {
    render() {
        return <div>
            <div style={{ marginRight: "0.25em" }} className="ui input">
                <input id="name" type="text"/>
            </div>
            <button id="join" className="ui button" onClick={() => this.props.onJoin()}>Join</button>
            <button id="leave" className="ui button" onClick={this.props.onLeave}>Leave</button>
            <br/>
            <textarea id="users" cols={20} rows={10} readOnly></textarea>
        </div>;
    }
}
