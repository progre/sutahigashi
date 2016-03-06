import * as React from "react";
import {RESOURCES} from "./game/player";

export default class Result extends React.Component<any, any> {
    render() {
        return <div>
            <img src="res/result.png"/>
            <img src={RESOURCES[this.props.number].src}/>
        </div>;
    }
}
