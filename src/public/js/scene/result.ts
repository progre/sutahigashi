import * as React from "react";
import * as ReactDOM from "react-dom";
import {Result as Status} from "../../../domain/status";
import View, {RESOURCES} from "../component/result";
import {createContainer} from "../component/utils";
import SE from "../infrastructure/se";

export {RESOURCES};

export default class Result {
    name: "result" = "result";

    private container = createContainer();

    constructor(
        private loader: createjs.AbstractLoader,
        private se: SE
    ) {
        console.log("Result starting.");
    }

    close() {
        document.getElementsByTagName("main")[0].removeChild(this.container);
        console.log("Result finished.");
    }

    update(status: Status) {
        this.se.play("result/winner");
        document.getElementsByTagName("main")[0].appendChild(this.container);
        ReactDOM.render(
            React.createElement(View, {
                loader: this.loader,
                number: status.number,
                winner: status.winner.name
            }),
            this.container
        );
    }
}
