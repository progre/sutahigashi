/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Lobby from "./component/lobby";
import Interval from "./component/interval";
import Result from "./component/result";

// <Lobby/>
// <hr/>
// <Interval/>
// <hr/>
async function main() {
    ReactDOM.render(
        <div>
            <Result number="0" winner="test-player"/>
            <div style={{
                position: "absolute",
                top: 0,
                width: 960,
                height: 540,
                backgroundColor: "dimgray",
                zIndex: -1
            }}/>
        </div>,
        document.getElementsByTagName("main")[0]
    );
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    main().catch(e => {
        console.error(e);
        throw e;
    });
});
