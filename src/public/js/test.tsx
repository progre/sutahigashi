/// <reference path="../../../typings/browser.d.ts" />
/* tslint:disable: no-unused-variable */
import * as React from "react";
/* tslint:enable: no-unused-variable */
import * as ReactDOM from "react-dom";
import loadResource from "./infrastructure/loader";
import Lobby from "./component/lobby";
import GameSub from "./component/gamesub";
import Interval from "./component/interval";
import Result from "./component/result";

async function main() {
    let loader = await loadResource();

    ReactDOM.render(
        <Lobby loader={loader} onJoin={null} onLeave={null} clone={true}/>,
        document.getElementById("lobby"))
        .setState({
            users: ["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]
        });
    ReactDOM.render(
        <GameSub loader={loader} users={["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]} clone={true}/>,
        document.getElementById("gamesub"));
    let users = [
        { name: "さたちゅー", wins: 0 },
        { name: "したちゅー", wins: 1 },
        { name: "すたちゅー", wins: 2 },
        { name: "せたちゅー", wins: 3 }
    ];
    ReactDOM.render(
        <Interval loader={loader} users={users} winner={3} clone={true}/>,
        document.getElementById("interval"));
    ReactDOM.render(
        <Result loader={loader} number={2} winner="test-player" clone={true}/>,
        document.getElementById("result"));
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
