import gulp from "gulp";
import del from "del";

import "./gulp/copy";
import "./gulp/jade";
import "./gulp/selflint";
import "./gulp/serve";
import "./gulp/stylus";
import "./gulp/test";
import "./gulp/ts";

gulp.task("build",
    gulp.series(
        clean,
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
        clean,
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
    function begin(callback) {
        if (signal) {
            callback(new Error("Alread started."));
            return;
        }
        signal = true;
        setTimeout(() => {
            signal = false;
        }, 10 * 1000);
        console.log("✂─────────────────────────────────────────────────…………");
        callback();
    }

    function end() {
        console.log(".:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._");
    }
    gulp.watch("src/**/*.js", gulp.series(begin, "copy:copy", "serve:serve", end));
    gulp.watch(["src/**/*.ts*", "!src/test/**"], gulp.series(begin, "ts:debug", "test:test", "serve:serve", end));
    gulp.watch("src/**/*.jade", gulp.series(begin, "jade:debug", "serve:serve", end));
    gulp.watch("src/**/*.stylus", gulp.series(begin, "stylus:stylus", "serve:serve", end));
    gulp.watch("src/test/**/*.ts", gulp.series(begin, "test:test", "serve:serve", end));
});

gulp.task("default",
    gulp.series(
        gulp.parallel(
            "selflint:selflint",
            "build"
        ),
        "serve:serve",
        "watch"
    )
);

function clean() {
    return del("lib/");
}
