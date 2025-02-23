// Interface
interface LoraLoaderInterface {
    loadLora: (loraName: string) => void;
    unloadLora: (loraName: string) => void;
    getLoraList: () => string[];
}

export class LoraLoader implements LoraLoaderInterface {

    loadLora(loraName: string): void {
        throw new Error("Method not implemented.");
    }
    unloadLora(loraName: string): void {
        throw new Error("Method not implemented.");
    }
    getLoraList(): string[] {
        throw new Error("Method not implemented.");
    }
}