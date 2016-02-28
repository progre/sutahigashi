export default class MultiItemArray<T> extends Array<T[]> {
    constructor(private limit: number) {
        super();
    }

    pushOffset(offset: number, item: T) {
        let idx = lastInputIndex(this, offset) + 1;
        let inputs = this.getOrCreate(idx);
        {
            let count = 0;
            inputs.forEach(x=> count++);
            if (inputs.length !== count) {
                throw new Error("Broken list.p");
            }
        }
        inputs[offset] = item;
    }

    filled(index: number) {
        let multi = this[index];
        {
            let count = 0;
            multi.forEach(x=> count++);
            if (multi.length !== count) {
                throw new Error("Broken list.");
            }
        }
        return multi != null
            && multi.length === this.limit
            && multi.every(x => x != null);
    }

    private getOrCreate(index: number) {
        let item = this[index];
        if (item != null) {
            {
                let count = 0;
                item.forEach(x=> count++);
                if (item.length !== count) {
                    throw new Error("Broken list.hoge");
                }
            }
            return item;
        }
        let array = <T[]>[];
        for (let i = 0; i < this.limit; i++) {
            array.push();
        }
        {
            let count = 0;
            array.forEach(x=> count++);
            if (array.length !== count) {
                throw new Error("Broken list. hetakuso");
            }
        }
        return this[index] = array;
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

