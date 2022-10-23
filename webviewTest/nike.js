var CrowlStage = {}

CrowlStage.Start = "Start";
CrowlStage.Search = "Search";
CrowlStage.Detail = "Detail";
CrowlStage.Stop = "Stop";

function Crowl()
{
    console.log("Crowl: creating Crowl");
    this.waiter = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    this.maxSearchResultCount = 10;
}

Crowl.prototype.Run = function(searchString)
{
    console.log("Crowl: Run");
    this.searchString = searchString;

    //stage
    let stage = this.GetStage();
    switch (stage) {
        case CrowlStage.Start:
            console.log("Crowl: Run. Start");
            this.SetStage(CrowlStage.Search);
            this.SearchRequest();
            break;
        case CrowlStage.Search:
            console.log("Crowl: Run. Search");
            this.SetStage(CrowlStage.Detail);
            this.SaveSearchResults();
            window.location.reload();
            
            break;
        case CrowlStage.Detail:
            console.log("Crowl: Run. Detail");
            this.ReadDetail();            
            this.IncreaseCurrentId();

            if (!this.NavigateToCurrentResult()) {
                this.SetStage(CrowlStage.Stop);
                window.location.reload();
            }
            break;
        case CrowlStage.Stop:
            console.log("Crowl: Run. Stop");
            invokeCSharpAction("handle searched");
            break;
    }

    //let mainPgUri = new RegExp('nike\.com\/*$');
    ////search if main page
    //if (mainPgUri.test(window.location.href)) {
    //    this.SearchRequest();
    //}
    ////collect search results if search result page and searchResultArray is empty
    //searchPgUri = new RegExp('https:\/\/www.nike.com\/w\?q=');
    //if (searchPgUri.test(window.location.href) &&
    //    window.sessionStorage.getItem("searchResultArray") == null) {
    //    this.SaveSearchResults();
    //    this.NavigateToCurrentResult();
    //}
    ////handle searched
    //let href = this.GetCurrentHref();
    //if (href == window.location.href) {
    //    invokeCSharpAction("handle searched");
    //}
    
}

Crowl.prototype.ReadDetail = function () {
    //название, код, цена, ссылка, доступные размеры
}

Crowl.prototype.SearchRequest = function ()
{
    console.log("Crowl: SearchRequest");
    let su = encodeURIComponent(this.searchString);
    let href = "https://www.nike.com/w?q=" + su;
    window.location.assign(href);

    //let t = this;

    //Promise.resolve().
    //    then(() => document.querySelector("button[data-search-open-label='Open Search Modal']").click()).
    //    then(() => t.waiter(3000)).
    //    then(() => {
    //        //поиск
    //        //document.querySelector("#VisualSearchInput").value = t.searchString
    //        const keV = new KeyboardEvent('keypress', {
    //            bubbles: true, cancelable: true, keyCode: "p".charCodeAt(0)
    //        });
    //        const keD = new KeyboardEvent('keydown', {
    //            bubbles: true, cancelable: true, keyCode: 13
    //        });
    //        const keU = new KeyboardEvent('keyup', {
    //            bubbles: true, cancelable: true, keyCode: 13
    //        });
    //        document.querySelector("#VisualSearchInput").dispatchEvent(keV)
    //        document.querySelector("#VisualSearchInput").dispatchEvent(keD)
    //        document.querySelector("#VisualSearchInput").dispatchEvent(keU)
    //        //navigate to find result
    //    }
    //    );
}

Crowl.prototype.SaveSearchResults = function () {
    console.log("Crowl: SaveSearchResults");
    console.log("Crowl: SaveSearchResults. HREF = " + window.location.href);
    let results = document.querySelectorAll("a.product-card__img-link-overlay");
    
    let ary = [];
    if (results.length <= this.maxSearchResultCount)
        for (let i = 0; i < results.length; i++) {
            ary.push(results[i].href)
        }
    console.log("Crowl: SaveSearchResults. Found results: " + results.length);
    console.log("Crowl: SaveSearchResults. ary: " + ary.length);
    window.sessionStorage.setItem("searchResultArray", JSON.stringify(ary))
    window.sessionStorage.setItem("searchResultCurrent", JSON.stringify(0));
}

Crowl.prototype.NavigateToCurrentResult = function ()
{
    console.log("Crowl: NavigateToCurrentResult");
    let href = this.GetCurrentHref();
    if (href != null) {
        window.location.assign(href)
        return true;
    }
    else {
        //all results are navigated
        //TODO
        console.log("Crowl: Current Href is null");
        return false;
    }
     
}

Crowl.prototype.IncreaseCurrentId = function()
{
    console.log("Crowl: IncreaseCurrentId");
    let curId = window.sessionStorage.getItem("searchResultCurrent");
    if (curId == null)
        curId = 0;
    else
        curId = JSON.parse(curId) + 1;
    window.sessionStorage.setItem("searchResultCurrent", JSON.stringify(curId));
}

Crowl.prototype.GetCurrentHref = function()
{
    console.log("Crowl: GetCurrentHref");
    let curId = window.sessionStorage.getItem("searchResultCurrent");
    if (curId == null)
        curId = 0;
    else
        curId = JSON.parse(curId);
    let ary = window.sessionStorage.getItem("searchResultArray");
    if (ary == null) {
        ary = [];
        console.log("Crowl: GetCurrentHref. searchResultArray is undefined");
    }
    else {
        ary = JSON.parse(ary);
        console.log("Crowl: GetCurrentHref. searchResultArray len is " + ary.length);
    }
    if (ary.length > curId) {
        //iterate next
        let href = ary[curId];
        return href;
    }
    else {
        return null;
    }    
}

Crowl.prototype.GetStage = function () {
    console.log("Crowl: GetStage");
    let crowlStage = window.sessionStorage.getItem("crowlStage")
    if (crowlStage == null) {
        crowlStage = CrowlStage.Start;
    }
    return crowlStage;
}

Crowl.prototype.SetStage = function (value) {
    console.log("Crowl: SetStage");
    window.sessionStorage.setItem("crowlStage", value)
}


function CrowlFabric(searchString) {
    console.log("Crowl: CrowlFabric");

    console.log("Crowl: typeof invokeCSharpAction is: " + typeof(invokeCSharpAction))

    if (typeof window.myCrowl === "undefined") {
        window.myCrowl = new Crowl(searchString)
        
        //Promise.resolve().
        //    then(() => window.myCrowl.waiter(5000)).
        //    then(() => window.myCrowl.Run(searchString))

        //wait for loading footer for 10sec
        CrowlCommon.ElemWaiter(() => document.querySelector("#gen-nav-footer") != null, 10000)
            .then(() => console.log("Crowl: CrowlFabric. Can't load footer"))
            .catch(() => window.myCrowl.Run(searchString))
    }
    else {
        //multiple calls on navigation
        console.log("Crowl: CrowlFabric. Multiple calls. Escape");
        return
    }
    
}

