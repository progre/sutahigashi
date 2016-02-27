import * as React from "react";

export default class Lobby extends React.Component<any, any> {
    render() {
        return (<div>
<div style={{ marginRight: "0.25em" }} className="ui input">
    <input id="name" type="text"/></div>
<button id="join" className="ui button">Join</button>
<button id="leave" className="ui button">Leave</button>
<br/>
<textarea id="users" cols={20} rows={10} readOnly></textarea>
            </div>);
    }
}
