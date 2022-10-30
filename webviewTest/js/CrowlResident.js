class CrowlResident {
    static obj = null;
    static serializingClasses = [CrowlResident]

    constructor() { }

    static get sessionName() {
        return "crowler_" + this.name;
    }

    static _serializer;
    static get serializer() {
        if (this._serializer == null)
            this._serializer = new CrowlSerializer(this.serializingClasses);
        return this._serializer;
    }
    

    static fab() {
        //if (this.obj == null)
            this.obj = this.loadSelf();
        return this.obj;
    }

    static saveSelf(obj) {
        let jstr = this.serializer.serialize(obj);
        window.sessionStorage.setItem(this.sessionName, jstr);
    }

    static loadSelf() {
        let jstr = window.sessionStorage.getItem(this.sessionName);
        if (jstr != null)
            return this.serializer.deserialize(jstr);
        return eval("new " + this.name + "()");
    }
}