import * as React from "react";
import PreloadImage from "./preloadimage";
import {RESOURCES} from "../component/game/player";

interface Props {
    loader: createjs.AbstractLoader;
    onJoin: Function;
    onLeave: (e: any) => void;
}
interface State {
    users: string[];
}
export default class Lobby extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = { users: [] };
    }

    render() {
        let images = RESOURCES.map(x =>
            this.props.loader.getResult(x.id) as HTMLImageElement);
        return <div style={{
            position: "relative",
            width: 960,
            height: 540,
            backgroundColor: "white"
        }}>
            <User image={images[0]} name={this.state.users[0]} style={{
                position: "absolute", top: 100, left: 200
            }}/>
            <User image={images[1]} name={this.state.users[1]} style={{
                position: "absolute", top: 250, left: 550
            }}/>
            <User image={images[2]} name={this.state.users[2]} style={{
                position: "absolute", top: 100, left: 550
            }}/>
            <User image={images[3]} name={this.state.users[3]} style={{
                position: "absolute", top: 250, left: 200
            }}/>
            <div style={{
                position: "absolute",
                textAlign: "center",
                width: "100%",
                top: 400
            }}>
                <div style={{ marginRight: "0.25em" }} className="ui input">
                    <input ref="name" type="text" placeholder="Enter your name"/>
                </div>
                <button className="ui button" onClick={() => {
                    this.props.onJoin((this.refs["name"] as HTMLInputElement).value);
                } }>Join</button>
                <button className="ui button" onClick={this.props.onLeave}>Leave</button>
            </div>
        </div>;
    }
}

interface UserProps {
    image: HTMLImageElement;
    name: string;
    style?: React.CSSProperties;
}
class User extends React.Component<UserProps, void> {
    render() {
        return <div style={this.props.style}>
            <div style={{
                backgroundColor: "white",
                width: 240,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }}>
                <PreloadImage image={this.props.image} style={{
                    width: 64,
                    height: 64,
                    verticalAlign: "middle"
                }}/>
                <span style={{
                    margin: "0.5em",
                    fontSize: 32,
                    verticalAlign: "middle"
                }}>{this.props.name}</span>
            </div>
        </div>;
    }
}
