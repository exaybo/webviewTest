class CrowlSearchStorage extends CrowlResident {
    //хранилище результатов поиска в sessionstorage
    SearchResults = [];
    NextIndex = 0;
    static serializingClasses = [CrowlResident]

    //constructor() {
    //    //загрузка состояния из сессионного хранилища
    //    this.SearchResults = window.sessionStorage.getItem("CrowlSearchStorage_SearchResults");
    //    if (this.SearchResults == null)
    //        this.SearchResults = [];
    //    this.NextIndex = window.sessionStorage.getItem("CrowlSearchStorage_NextIndex");
    //    if (this.NextIndex == null)
    //        this.NextIndex = 0;
    //}

    get current() {
        //вернет текущий элемент или Null
        if (this.SearchResults.length > this.NextIndex) {
            return this.SearchResults[this.NextIndex];
        }
        return null;
    }

    next() {
        //вернет текущий элемент и перейдет к следующему или done=true
        if (this.SearchResults.length > this.NextIndex) {
            let result = {
                value: this.SearchResults[this.NextIndex],
                done: false
            }
            this.NextIndex++;
            //window.sessionStorage.setItem("CrowlSearchStorage_NextIndex", this.NextIndex);
            this.saveSelf();
            return result;
        }
        return { value: this.SearchResults.length, done: true };
    }

    append(url) {
        //добавит в конец массива
        if (!this.SearchResults.includes(url)) {
            this.SearchResults.push(url);
            //window.sessionStorage.setItem("CrowlSearchStorage_SearchResults", this.SearchResults);
            this.saveSelf();
        }
    }
}