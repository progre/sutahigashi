export const RESOURCES = [
    { id: "se/lobby/bell", src: "res/se/lobby/bell02.wav" },
    // { id: "se/lobby/selection", src: "res/se/lobby/pi08.wav" },
    // { id: "se/lobby/decision", src: "res/se/lobby/" },
    // { id: "se/lobby/cancel", src: "res/se/lobby/" },
    { id: "se/game/basic/death", src: "res/se/game/basic/puu46.wav" },
    // { id: "se/game/basic/hurryup", src: "res/se/game/basic/" },
    { id: "se/game/basic/gong", src: "res/se/game/basic/bell08.wav" },
    { id: "se/game/basic/put", src: "res/se/game/basic/bosu16.wav" },
    { id: "se/game/basic/explosion", src: "res/se/game/basic/bom27_b.wav" },
    { id: "se/game/basic/pickup", src: "res/se/game/basic/cursor05.wav" },
    { id: "se/game/basic/bound", src: "res/se/game/basic/swing06_r.wav" },
    // { id: "se/game/other/shot", src: "res/se/game/other/power27.wav" },
    // { id: "se/game/other/punch", src: "res/se/game/other/puu76.wav" }, // and overthrow
    // { id: "se/game/other/kick", src: "res/se/game/other/hit34.wav" },
    // { id: "se/game/other/swing", src: "res/se/game/other/swing06_h.wav" },
    // { id: "se/game/other/swinghit", src: "res/se/game/other/shoot09.wav" },
    // { id: "se/game/other/landmine", src: "res/se/game/other/pyoro40_b.wav" },
    // { id: "se/game/other/jump", src: "res/se/game/other/power21.wav" },
    // { id: "se/game/other/battery", src: "res/se/game/other/" },
    // { id: "se/game/other/batteryshot", src: "res/se/game/other/shoot20.wav" },
    // { id: "se/game/other/warp", src: "res/se/game/other/pyoro33.wav" },
    { id: "se/interval/crown", src: "res/se/interval/power37.wav" },
    { id: "se/interval/draw", src: "res/se/interval/puu13.wav" },
    { id: "se/result/winner", src: "res/se/result/power36.wav" }
    // ["cursor09.wav", "tm2_death000.wav"]
];

export default class SE {
    volume = 0.5;

    play(id: string) {
        createjs.Sound.play(`se/${id}`, null, 0, 0, 0, this.volume);
    }
}
