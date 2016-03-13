export const RESOURCES = [
    { id: "se/lobby/bell", src: "res/se/lobby/bell02.ogg" },
    // { id: "se/lobby/selection", src: "res/se/lobby/pi08.ogg" },
    // { id: "se/lobby/decision", src: "res/se/lobby/" },
    // { id: "se/lobby/cancel", src: "res/se/lobby/" },
    { id: "se/game/basic/death", src: "res/se/game/basic/puu46.ogg" },
    // { id: "se/game/basic/hurryup", src: "res/se/game/basic/" },
    { id: "se/game/basic/gong", src: "res/se/game/basic/bell08.ogg" },
    { id: "se/game/basic/put", src: "res/se/game/basic/bosu16.ogg" },
    { id: "se/game/basic/explosion", src: "res/se/game/basic/bom27_b.ogg" },
    { id: "se/game/basic/pickup", src: "res/se/game/basic/cursor05.ogg" },
    // { id: "se/game/basic/bound", src: "res/se/game/basic/swing06_r.ogg" },
    // { id: "se/game/other/shot", src: "res/se/game/other/power27.ogg" },
    // { id: "se/game/other/punch", src: "res/se/game/other/puu76.ogg" }, // and overthrow
    // { id: "se/game/other/kick", src: "res/se/game/other/hit34.ogg" },
    // { id: "se/game/other/swing", src: "res/se/game/other/swing06_h.ogg" },
    // { id: "se/game/other/swinghit", src: "res/se/game/other/shoot09.ogg" },
    // { id: "se/game/other/landmine", src: "res/se/game/other/pyoro40_b.ogg" },
    // { id: "se/game/other/jump", src: "res/se/game/other/power21.ogg" },
    // { id: "se/game/other/battery", src: "res/se/game/other/" },
    // { id: "se/game/other/batteryshot", src: "res/se/game/other/shoot20.ogg" },
    // { id: "se/game/other/warp", src: "res/se/game/other/pyoro33.ogg" },
    { id: "se/interval/crown", src: "res/se/interval/power37.ogg" },
    { id: "se/interval/draw", src: "res/se/interval/puu13.ogg" },
    { id: "se/result/winner", src: "res/se/result/power36.ogg" }
    // ["cursor09.wav", "tm2_death000.wav"]
];

export default class SE {
    volume = 0.5;
    game = new GameSE(this);

    play(id: string) {
        if (id.split("/")[0] === "game") {
            throw new Error();
        }
        createjs.Sound.play(`se/${id}`, null, 0, 0, 0, this.volume);
    }
}

class GameSE {
    private basic = <{ [id: string]: createjs.AbstractSoundInstance }>{
        death: createjs.Sound.createInstance("se/game/basic/death"),
        gong: createjs.Sound.createInstance("se/game/basic/gong"),
        put: createjs.Sound.createInstance("se/game/basic/put"),
        explosion: createjs.Sound.createInstance("se/game/basic/explosion"),
        pickup: createjs.Sound.createInstance("se/game/basic/pickup")
    };

    constructor(private config: { volume: number }) {
    }

    play(id: string) {
        let ids = id.split("/");
        switch (ids[0]) {
            case "basic":
                this.basic[ids[1]].play(null, 0, 0, 0, this.config.volume);
                break;
            default:
                throw new Error();
        }
    }

    playGameSet() {
        const INTERVAL = 270;
        return new Promise(resolve => {
            this.basic["gong"].play(null, 0, 0, 0, this.config.volume);
            setTimeout(() => {
                this.basic["gong"].play(null, 0, 0, 0, this.config.volume);
                setTimeout(() => {
                    this.basic["gong"].play(null, 0, 0, 0, this.config.volume);
                    resolve();
                }, INTERVAL);
            }, INTERVAL);
        });
    }
}
