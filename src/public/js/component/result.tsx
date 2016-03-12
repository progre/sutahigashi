import * as React from "react";
import {RESOURCES as playerResources} from "./game/player";
import PreloadImage from "./preloadimage";

export const RESOURCES = [{
    id: "result", src: "res/result.png"
}];

interface Props {
    loader: createjs.AbstractLoader;
    number: number;
    winner: string;
    clone?: boolean;
}
export default class Result extends React.Component<Props, any> {
    render() {
        let charaId = playerResources[this.props.number].id;
        let chara = this.props.loader.getResult(charaId) as HTMLImageElement;
        if (this.props.clone) {
            chara = chara.cloneNode() as typeof chara;
        }
        let cup = this.props.loader.getResult(RESOURCES[0].id) as HTMLImageElement;
        return <div style={{
            width: 960,
            height: 540,
            backgroundColor: "white"
        }}>
            <PreloadImage image={cup} style={{
                width: 320,
                height: 320,
                float: "left",
                marginTop: 110
            }}/>
            <div style={{ paddingTop: 200 }}>
                <span style={{ fontSize: 32 }}>Winner is</span><br/>
                <div style={{ paddingTop: "1em" }}>
                    <PreloadImage image={chara} style={{
                        width: 120,
                        height: 120,
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
