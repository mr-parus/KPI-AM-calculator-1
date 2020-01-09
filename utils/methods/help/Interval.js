class Interval {
    /**
     * @param {number} [n] - number oh Interval Error
     * */
    static error (n) {
        let msg;
        switch (n) {
            case 0:
                msg = 'Incorrect points for Interval.';
                break;
            case 1:
                msg = 'Incorrect Start point for Interval.';
                break;
            case 2:
                msg = 'Incorrect End point for Interval.';
                break;
            default:
                msg = 'Interval Error.';
        }
        throw new Error(msg);
    }

    /**
     * @param {number} start - start of the interval
     * @param {number} end - end of the interval
    * */
    constructor (start, end) {
        if (!isFinite(start) || !isFinite(end))
            Interval.error();

        if (start > end)
            Interval.error(0);

        this.start = start;
        this.end = end;
    }

    /**
     * @param {number} starPoint
     * */
    set startPoint (starPoint) {
        if (starPoint > this.end)
            Interval.error(1);

        this.start = starPoint;
    }

    /**
     * @return {number} startPoint of interval
     * */
    get startPoint () {
        return this.start;
    }



    /**
     * @param {number} endPoint
     * */
    set endPoint (endPoint) {
        if (endPoint < this.start)
            Interval.error(2);
        this.end = endPoint;
    }

    /**
     * @return {number} endPoint of interval
     * */
    get endPoint () {
        return this.end;
    }



    /**
     * @return {number} middlePoint of interval
     * */
    get middlePoint () {
        return (this.end + this.start) / 2;
    }


    /**
     * @return {number} size of interval
     * */
    get size () {
        return Math.abs(this.end - this.start);
    }

    /**
     * @return {Interval} return the same interval
     * */
    get copy () {
        return new Interval(this.start, this.end);
    }

    toString (){
        return `[${this.start} ; ${this.end}]`;
    }
}


module.exports = {Interval};
