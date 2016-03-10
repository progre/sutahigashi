/// <reference path="../../../typings/browser.d.ts" />
/* tslint:disable: no-unused-variable */
import * as React from "react";
/* tslint:enable: no-unused-variable */
import * as ReactDOM from "react-dom";
import loadResource from "./infrastructure/loader";
import Lobby from "./component/lobby";
import GameSub from "./component/gamesub";
// import Interval from "./component/interval";
import Result from "./component/result";

async function main() {
    let loader = await loadResource();
    ReactDOM.render(
        <Lobby loader={loader} onJoin={null} onLeave={null}/>,
        document.getElementById("lobby"))
        .setState({
            users: ["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]
        });
    ReactDOM.render(
        <GameSub loader={loader} users={["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]}/>,
        document.getElementById("gamesub"));
    ReactDOM.render(
        <Result loader={loader} number={2} winner="test-player"/>,
        document.getElementById("result"));
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
