export default class MultiItemArray<T> extends Array<T[]> {
    constructor(private limit: number) {
        super();
    }

    pushOffset(offset: number, item: T) {
        let idx = lastInputIndex(this, offset) + 1;
        let multi = this.getOrCreate(idx);
        put(multi, offset, item);
    }

    filled(index: number) {
        let multi = this[index];
        return multi != null
            && multi.length === this.limit
            && multi.every(x => x != null);
    }

    private getOrCreate(index: number) {
        let mutli = this[index];
        if (mutli != null) {
            return mutli;
        }
        let multi = <T[]>[];
        for (let i = 0; i < this.limit; i++) {
            multi.push();
        }
        return put(this, index, multi);
    }
}

function lastInputIndex<T>(multiItemArray: MultiItemArray<T>, number: number) {
    for (let i = 0; i < multiItemArray.length; i++) {
        let multi = multiItemArray[i];
        if (multi == null || multi[number] == null) {
            return i - 1;
        }
    }
    return multiItemArray.length - 1;
}

function put<T>(list: T[], idx: number, item: T) {
    while (list.length < idx + 1) {
        list.push(null);
    }
    return list[idx] = item;
}
