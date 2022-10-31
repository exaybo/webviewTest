class CrowlError {
    static TooMuchFound = { code: 1, msg: "too much results in search"}
    static ZeroFound = { code: 2, msg: "no results in search" }

}

class CrowsStage {
    static Enter = 0;
    static Search = 1;
    static Detailing = 2;
    static Fin = 3;
    static Error = 4;
}

class CrowlStageStorage extends CrowlResident {
    static serializingClasses = [CrowlStageStorage, CrowsStage]

    _stage = CrowlStage.Start;

    errorObj = null
    

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