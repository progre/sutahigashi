/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
/* tslint:disable: no-unused-variable */
import * as React from "react";
/* tslint:enable: no-unused-variable */
import * as ReactDOM from "react-dom";
import Lobby from "./component/lobby";
// import Interval from "./component/interval";
import Result from "./component/result";

async function main() {
    let lobby = ReactDOM.render(
        <Lobby onJoin={null} onLeave={null}/>,
        document.getElementById("lobby"));
    ReactDOM.render(
        <Result number="0" winner="test-player"/>,
        document.getElementById("result"));
    lobby.setState({
        users: ["さたちゅー", "したちゅー", "すたちゅー", "せたちゅー"]
    });
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
