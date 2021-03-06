import gulp from "gulp";
import gutil from "gulp-util";
import del from "del";
import {mkdir} from "fs";

import "./gulp/copy";
import "./gulp/jade";
import "./gulp/selflint";
import "./gulp/serve";
import "./gulp/stylus";
import "./gulp/test";
import {browser} from "./gulp/ts";

browser.files.push({
    src: "src/public/js/test.tsx",
    dest: "lib/public/js/"
});
browser.config.externals = {
    "react": "React",
    "react-dom": "ReactDOM"
};

gulp.task("clean", async (done) => {
    await del("lib/");
    mkdir("lib", done);
});

gulp.task("clean", async (done) => {
    await del("lib/");
    mkdir("lib", done);
});

gulp.task("build",
    gulp.series(
        "clean",
        gulp.parallel(
            "copy:copy",
            "jade:debug",
            "stylus:stylus",
            gulp.series(
                "ts:debug",
                "test:test"
            )
        )
    )
);

gulp.task("release-build",
    gulp.series(
        "clean",
        gulp.parallel(
            "copy:copy",
            "jade:release",
            "stylus:stylus",
            gulp.series(
                "ts:release",
                "test:test"
            )
        )
    )
);

gulp.task("watch", () => {
    let signal = false;

    gulp.watch("src/**/*.js", gulp.series(begin, "copy:copy", "serve:reload", end));
    gulp.watch(
        ["src/**/*.ts*", "!src/public/**/*.ts*", "!src/test/**"],
        gulp.series(begin, "ts:debug", "test:test", "serve:serve", "serve:reload", end));
    gulp.watch(
        ["src/public/**/*.ts*"],
        gulp.series(begin, "ts:browser", "serve:reload", end));
    gulp.watch("src/**/*.jade", gulp.series(begin, "jade:debug", "serve:reload", end));
    gulp.watch("src/**/*.stylus", gulp.series(begin, "stylus:stylus", "serve:reload", end));
    gulp.watch("src/test/**/*.ts", gulp.series(begin, "test:test", end));

    function begin(callback) {
        if (signal) {
            callback(new gutil.PluginError("begin", "Already started."));
            return;
        }
        signal = true;
        setTimeout(() => {
            signal = false;
        }, 5 * 1000);
        console.log("✂─────────────────────────────────────────────────…………");
        callback();
    }

    function end(callback) {
        console.log("   __       __");
        console.log("   ) \\     / (      .-.    .---.  .---. .-.   .-.");
        console.log("  )_  \\_V_/  _(     | |   /   __}{_   _}|  `.'  |");
        console.log("    )__   __(       | `--.\\  {_ }  | |  | |\\ /| |");
        console.log("       `-'          `----' `---'   `-'  `-' ` `-'");
        callback();
    }
});

gulp.task("default",
    gulp.series(
        "serve:serve",
        "serve:browser",
        "watch"
    )
);
