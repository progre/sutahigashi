import * as React from "react";
import PreloadImage from "./preloadimage";
import {RESOURCES} from "../component/game/player";

interface Props {
    loader: createjs.AbstractLoader;
    users: {
        name: string;
        wins: number;
    }[];
    winner: number;
}
export default class Interval extends React.Component<Props, any> {
    render() {
        let images = RESOURCES.map(x =>
            this.props.loader.getResult(x.id) as HTMLImageElement);
        let iconStyle = { width: 64, height: 64 };
        let list = this.props.users.map((x, i) =>
            <li key={x.name}>
                <PreloadImage image={images[i]} style={iconStyle}/>
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
