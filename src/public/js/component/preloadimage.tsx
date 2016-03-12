import * as React from "react";

interface UserProps {
    image: HTMLImageElement;
    style?: React.CSSProperties;
}
export default class PreloadImage extends React.Component<UserProps, void> {
    render() {
        let style = this.props.style || {};
        style.display = "inline-flex";
        return <span ref="image" style={style}/>;
    }

    componentDidMount() {
        (this.refs["image"] as HTMLElement).appendChild(this.props.image);
    }
}
