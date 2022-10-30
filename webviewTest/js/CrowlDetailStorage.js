class CrowlSneackersSize {
    Sex;
    Country;
    Value;
    constructor(sex, country, value) {
        this.Sex = sex;
        this.Country = country;
        this.Value = value;
    }
}

class CrowlSneackersDetail {
    Brand;
    ModelName;
    ModelCode;
    Price;
    DiscountPrice;
    PageUrl;
    ImgUrl;
    SizesArray;
}

class CrowlDetailStorage extends CrowlResident{
    static serializingClasses = [CrowlDetailStorage, CrowlSneackersDetail, CrowlSneackersSize]
    constructor() { super() }
    Details = [];

    clear() {
        this.Details = [];
        CrowlDetailStorage.saveSelf(this);
    }

    append(detail) {
        if (typeof (detail) != "object" || detail.constructor.name != "CrowlSneackersDetail")
            throw new Error("detail is not CrowlSneackersDetail")
        //добавит в конец массива
        if (this.Details.findIndex(d => d.PageUrl == detail.PageUrl) == -1) {
            this.Details.push(detail);            
        }
        CrowlDetailStorage.saveSelf(this);
        //this.saveSelf(this);
    }
}