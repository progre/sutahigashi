import * as React from "react";
import * as ReactDOM from "react-dom";
import {Interval as Status} from "../../../domain/status";
import View from "../component/interval";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export default class Interval {
    name: "interval" = "interval";

    private container = createContainer();

    constructor(
        private loader: createjs.AbstractLoader,
        private se: SE
    ) {
        console.log("Interval starting.");
    }

    close() {
        document.getElementsByTagName("main")[0].removeChild(this.container);
        console.log("Interval finished.");
    }

    update(status: Status) {
        if (status.winner != null) {
            this.se.play("interval/crown");
        } else {
            this.se.play("interval/draw");
        }
        document.getElementsByTagName("main")[0].appendChild(this.container);
        let props = {
            loader: this.loader,
            users: status.users.map((x, i) => ({
                name: x.name,
                wins: x.wins
            })),
            winner: status.winner
        };
        ReactDOM.render(
            React.createElement(View, props),
            this.container
        );
    }
}
