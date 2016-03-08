import * as React from "react";
import {RESOURCES} from "./game/player";

interface Props {
    users: string[];
}
export default class GameSub extends React.Component<Props, void> {
    constructor() {
        super();
        this.props = { users: [] };
    }

    render() {
        return <div style={{
            position: "relative",
            width: 960,
            height: 540
        }}>
            <User index={0} name={this.props.users[0]} style={{
                position: "absolute", top: 0, left: 0
            }}/>
            <User index={1} name={this.props.users[1]} style={{
                position: "absolute", bottom: 0, right: 0
            }}/>
            <User index={2} name={this.props.users[2]} style={{
                position: "absolute", top: 0, right: 0
            }}/>
            <User index={3} name={this.props.users[3]} style={{
                position: "absolute", bottom: 0, left: 0
            }}/>
        </div>;
    }
}

interface UserProps {
    style?: React.CSSProperties;
    index: number;
    name: string;
}
class User extends React.Component<UserProps, void> {
    render() {
        return <div style={this.props.style}>
            <div style={{
                padding: 8,
                backgroundColor: "white"
            }}>
                <img src={RESOURCES[this.props.index].src} style={{
                    width: 64,
                    height: 64
                }}/>
                <br/>
                <div style={{
                    marginTop: 8,
                    width: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}>
                    <span style={{
                        fontSize: 32
                    }}>{this.props.name}</span>
                </div>
            </div>
        </div>;
    }
}
