import * as React from "react";

interface UserProps {
    image: HTMLImageElement;
    style?: React.CSSProperties;
}
export default class PreloadImage extends React.Component<UserProps, void> {
    render() {
        let src = this.props.style;
        let dest = this.props.image.style as any;
        if (src != null) {
            for (let key in src) {
                if (src[key] == null) {
                    continue;
                }
                let value = src[key];
                if ((key === "width" || key === "height")
                    && !Number.isNaN(parseInt(value, 10))) {
                    value = value + "px";
                }
                dest[key] = value;
            }
        }
        return <span ref="image"/>;
    }

    componentDidMount() {
        (this.refs["image"] as HTMLElement).appendChild(this.props.image);
    }
}
