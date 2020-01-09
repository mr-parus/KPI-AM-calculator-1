const math = require('mathjs');
const poly = require('polynomial');


class SimpleFunction {
   constructor (str) {

       if (typeof str !== 'string') {
           throw new Error('Params is not correct.')
       }
       const parser = math.parser();
       try {
           str = str.replace(/\s/, '').replace(/^\w+\(x\)/g,'f(x)');
           parser.eval(str);
           parser.get('f')(0);
       }
       catch (e) {
           throw new Error('Invalid or unsupported func definition');
       }

       let [funcDef, expression] = str.split('=');
       this.start_express = expression;
       this.expression = math.simplify(expression);
       this.exp_pattern = this.expression.toString();
       this.full_pattern =  `${funcDef} = ${this.expression.toString()}`;
       parser.clear();
       parser.eval(this.full_pattern);
       this.func = parser.get('f');

   }

   toString () {
       return this.full_pattern;
   }

   getPattern (val) {
        return (val)?
           this.exp_pattern.replace(/x/,`(${val})`) : this.exp_pattern;
   }

   getFullExpression (val) {
       return (val)?
           `f(${val}) = ` + this.exp_pattern.replace(/x/g,`(${val})`)+" = " + this.func(val):
           this.full_pattern;
   }

   get execute () {
       return (x) => {
           return this.func(x);
       }
   }

   get coefs () {
       const p = new poly(this.start_express.replace(/\s/g,''));
       let coeff = [];
       Object.entries(p.coeff).forEach(e =>{
           coeff[e[0]] = e[1]
       });

       for (let i = 0 ; i < coeff.length; i++)
           if (coeff[i] === undefined)
               coeff[i] = 0;

       return coeff;
   }

   get derivate () {
       const t = math.derivative(this.expression, 'x').toString();
       return new SimpleFunction('f(x)=' +t);
   }
}

module.exports = {SimpleFunction};
