import {Land} from "../status";

const FIELD = `
###############
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
# # # # # # # #
#             #
###############
`.split("\n")
    .splice(1)
    .map(x => x.split("").map(x => {
        switch (x) {
            case " ": return Land.NONE;
            case "#": return Land.HARDBLOCK;
            default: throw new Error();
        }
    }));

export function createField() {
    return FIELD;
}
