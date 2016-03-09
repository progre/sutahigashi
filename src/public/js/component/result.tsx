import * as React from "react";
import {RESOURCES} from "./game/player";

interface Props {
    loader: createjs.AbstractLoader;
    number: number;
    winner: string;
}
export default class Result extends React.Component<Props, any> {
    render() {
        let id = RESOURCES[this.props.number].id;
        let image = this.props.loader.getResult(id) as HTMLImageElement;
        return <div style={{
            width: 960,
            height: 540,
            backgroundColor: "white"
        }}>
            <img src="res/result.png" height="320" style={{
                float: "left",
                marginTop: 110
            }}/>
            <div style={{ paddingTop: 200 }}>
                <span style={{ fontSize: 32 }}>Winner is</span><br/>
                <div style={{ paddingTop: "1em" }}>
                    <img src={image.src} width="120" height="120" style={{
                        verticalAlign: "middle"
                    }}/>
                    <span style={{
                        fontSize: 64, verticalAlign: "middle"
                    }}>{this.props.winner}</span>
                </div>
            </div>
        </div>;
    }
}
