import * as React from "react";
import {RESOURCES} from "./game/player";
import PreloadImage from "./preloadimage";

interface Props {
    loader: createjs.AbstractLoader;
    users: string[];
    clone?: boolean;
}
export default class GameSub extends React.Component<Props, void> {
    constructor() {
        super();
    }

    render() {
        let {loader, users} = this.props;
        let images = RESOURCES.map(x => loader.getResult(x.id) as HTMLImageElement);
        if (this.props.clone) {
            images = images.map(x => x.cloneNode() as typeof x);
        }
        return <div style={{
            position: "relative",
            width: 960,
            height: 540
        }}>
            <User image={images[0]} name={users[0]} style={{
                position: "absolute", top: 0, left: 0
            }}/>
            <User image={images[1]} name={users[1]} style={{
                position: "absolute", bottom: 0, right: 0
            }}/>
            <User image={images[2]} name={users[2]} style={{
                position: "absolute", top: 0, right: 0
            }}/>
            <User image={images[3]} name={users[3]} style={{
                position: "absolute", bottom: 0, left: 0
            }}/>
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
                padding: 8,
                backgroundColor: "white"
            }}>
                <PreloadImage image={this.props.image} style={{
                    width: 64,
                    height: 64
                }}/>
                <br/>
                <div style={{
                    paddingTop: 8,
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
