import * as React from "react";
import {RESOURCES} from "./player";

export default class Interval extends React.Component<any, any> {
    render() {
        return <Users users={
            this.props.users.map((x: any, i: number) => ({
                iconURL: RESOURCES[i].src,
                name: x.name,
                wins: x.wins
            }))
        }/>;
    }
}

class Users extends React.Component<any, any> {
    render() {
        let iconStyle = { width: 64, height: 64 };
        let list = this.props.users.map((x: any) =>
            <li key={x.id}>
                <img src={x.iconURL} style={iconStyle}/>
                <span style={{ width: 64, margin: "1em" }}>{x.name}</span>
                {"🌟".repeat(x.wins) }
            </li>);
        return <div>
            <ul style={{ listStyleType: "none" }}>
                {list}
            </ul>
        </div>;
    }
}
