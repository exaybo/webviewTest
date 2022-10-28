class CrowlResident {
    static obj = null;
    static serializingClasses = [CrowlResident]

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
        debugger;
        //if (this.obj == null)
            this.obj = this.loadSelf();
        return this.obj;
    }

    static saveSelf() {
        let jstr = this.serializer.serialize(this);
        window.sessionStorage.setItem(this.sessionName, jstr);
    }

    static loadSelf() {
        let jstr = window.sessionStorage.getItem(this.sessionName);
        if (jstr != null)
            return this.serializer.deserialize(jstr);
        return eval("new " + this.name + "()");
    }
}