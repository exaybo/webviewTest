class CrowsStage {
    static Start = 0;
    static Search = 1;
    static Detailing = 2;
    static Stop = 3;
}

class CrowlStageStorage extends CrowlResident {
    static serializingClasses = [CrowlStageStorage, CrowsStage]

    _stage = CrowlStage.Start;

    get Stage() {
        return this._stage;
    }

    set Stage(value) {
        _stage = value;
        CrowlStageStorage.saveSelf(this);
    }

    reset() {
        Stage = 0;        
    }
}