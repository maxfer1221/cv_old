class Circle{
    constructor(x, y, r, coeff, a){
        this.x = x;
        this.y = y;
        this.r = r/coeff;
        if(this.a === undefined){
            this.a = 0;
        } else{
            this.a = a;
        }
        this.coeff = coeff;
    }

    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }

    setCenter(x, y){
        this.x = x;
        this.y = y;
    }
}
