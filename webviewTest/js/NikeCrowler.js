
class NikeCrowler {
    maxSearchResultCount = 7
    searchString = ""
    constructor(aSearchString) {
        this.searchString = aSearchString;
        this.detailStorage = CrowlDetailStorage.fab()
        this.searchStorage = CrowlSearchStorage.fab()
        this.stageStorage = CrowlStageStorage.fab()
    }

    run() {
        switch (this.stageStorage.Stage) {
            case CrowsStage.Enter:
                this.stageStorage.Stage = CrowlStage.Search;
                this.doSearchRequest();
                break;
            case CrowsStage.Search:
                this.collectSearchResults();
                this.stageStorage.Stage = CrowlStage.Detailing;
                if (this.searchStorage.current != null) {
                    window.location.assign(this.searchStorage.current);
                }
                else {
                    this.stageStorage.Stage = CrowlStage.Error;
                    this.stageStorage.errorObj = CrowlError.ZeroFound;
                    this.outResult();
                }
                break;
            case CrowsStage.Detailing:                
                this.readDetail();
                let r = this.searchStorage.next();
                if (r.done == true) {
                    this.stageStorage.Stage = CrowlStage.Fin;
                    this.outResult();
                }
                else {
                    window.location.assign(this.searchStorage.current);
                }
                break;
            case CrowsStage.Fin:
                this.outResult();
                break;
        }
    }

    doSearchRequest() {
        console.log("Crowl: doSearchRequest");
        let su = encodeURIComponent(this.searchString);
        let href = "https://www.nike.com/w?q=" + su;
        window.location.assign(href);
    }

    collectSearchResults = function () {
        console.log("Crowl: collectSearchResults");
        let results = document.querySelectorAll("a.product-card__img-link-overlay");

        if (results.length <= this.maxSearchResultCount) {
            for (let i = 0; i < results.length; i++) {
                this.searchStorage.append(results[i].href)
            }
        }
        else {
            this.stageStorage.Stage = CrowlStage.Error;
            this.stageStorage.errorObj = CrowlError.TooMuchFound;
            this.outResult();
        }
    }

    readDetail() {
        //handle color siblings from <input radio>
        //add them to searchStorage
        let radios = document.querySelectorAll("input[type=radio][name=pdp-colorpicker]");
        let urlTpl = this.searchStorage.current.replace(/[^\/]+$/i, "");
        for (let i = 0; i < radios.length; i++) {
            let url = urlTpl + radios[i].value;
            this.searchStorage.append(url);
        }
        //get details
        let detail = new CrowlSneackersDetail();
        detail.Brand = "Nike";
        detail.ModelName = document.querySelector("#pdp_product_title")?.innerHTML;
        let mc = this.searchStorage.current.match(/([^\/]+)$/)
        if (mc.length > 2)
            detail.ModelCode = mc[1];
        detail.Price = document.querySelector("div.is--current-price")?.innerHTML;
        detail.DiscountFromPrice = document.querySelector("div.is--striked-out")?.innerHTML;
        detail.PageUrl = this.searchStorage.current;
        detail.ImgUrl = document.querySelector("button[data-sub-type=image] img[data-fade-in]")?.src
        //sizes
        let sizesEn = document.querySelectorAll("input[type=radio][name=skuAndSize]:not([disabled])");
        for (let i = 0; i < sizesEn.length; i++) {
            let szStr = sizesEn.value.replace(/^\d+:/, "") //27625851:7.5
            let size = new Size(null, null, szStr);
            detail.SizesArray.push(size);
        }
        //
        this.detailStorage.append(detail);
    }

    outResult() {
        let outResult = {
            Error: {},
            Result: []
        };
        if (this.stageStorage.Stage == CrowlStage.Error) {
            outResult.Error = this.stageStorage.errorObj;
        }
        else {
            outResult.Result = this.detailStorage.Details;
        }
        let data = JSON.stringify(outResult)
        invokeCSharpAction(data);
    }
}

function NikeRunner(searchString) {
    let o = new NikeCrowler(searchString);
    o.run();
}

document.body.onload += () => NikeRunner("Air Max")