import UserService from '../service/UserService';

export default class UnitConversionUtil {

    static myInstance = null;

    static getInstance() {
        if (UnitConversionUtil.myInstance == null) {
            UnitConversionUtil.myInstance = new UnitConversionUtil();
        }
        return this.myInstance;
    }

    constructor() {

    }

    strToInt(str) {
        if (str === "") {
            return 0;
        }
        str = str.replace("$", "");
        str = str.replace(",", "");
        let strArr = str.split(".");
        if (strArr.length === 1) {
            return parseInt(strArr[0]) * 100 || 0;
        }
        return parseInt(strArr[0] + strArr[1].substring(0, 2).padEnd(2, "0")) || 0;
    }

    intToStr(int) {
        let desPart = ("" + (int % 100)).padStart(2, "0");
        if (int < 0) {
            return "-" + Math.floor(int / 100) + "." + desPart;
        }
        return "" + Math.floor(int / 100) + "." + desPart;
    }
}