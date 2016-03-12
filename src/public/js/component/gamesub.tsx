import * as React from "react";
import {RESOURCES} from "./game/player";
import PreloadImage from "./preloadimage";

interface Props {
    loader: createjs.AbstractLoader;
    users: string[];
}
export default class GameSub extends React.Component<Props, void> {
    constructor() {
        super();
    }

    render() {
        let {loader, users} = this.props;
        return <div style={{
            position: "relative",
            width: 960,
            height: 540
        }}>
            <User loader={loader} index={0} name={users[0]} style={{
                position: "absolute", top: 0, left: 0
            }}/>
            <User loader={loader} index={1} name={users[1]} style={{
                position: "absolute", bottom: 0, right: 0
            }}/>
            <User loader={loader} index={2} name={users[2]} style={{
                position: "absolute", top: 0, right: 0
            }}/>
            <User loader={loader} index={3} name={users[3]} style={{
                position: "absolute", bottom: 0, left: 0
            }}/>
        </div>;
    }
}

interface UserProps {
    loader: createjs.AbstractLoader;
    style?: React.CSSProperties;
    index: number;
    name: string;
}
class User extends React.Component<UserProps, void> {
    render() {
        let imageId = RESOURCES[this.props.index].id;
        let image = this.props.loader.getResult(imageId) as HTMLImageElement;
        return <div style={this.props.style}>
            <div style={{
                padding: 8,
                backgroundColor: "white"
            }}>
                <PreloadImage image={image} style={{
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
