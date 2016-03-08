/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
/* tslint:disable: no-unused-variable */
import * as React from "react";
/* tslint:enable: no-unused-variable */
import * as ReactDOM from "react-dom";
import Lobby from "./component/lobby";
import GameSub from "./component/gamesub";
// import Interval from "./component/interval";
import Result from "./component/result";

async function main() {
    ReactDOM.render(
        <Lobby onJoin={null} onLeave={null}/>,
        document.getElementById("lobby"))
        .setState({
            users: ["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]
        });
    ReactDOM.render(
        <GameSub users={["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]}/>,
        document.getElementById("gamesub"));
    ReactDOM.render(
        <Result number="0" winner="test-player"/>,
        document.getElementById("result"));
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
