/*
    This is ported and rewritten from a nodefile to JS
*/

(function($) {
let maskChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+{}[]:;|\"'<>,.?/".split("");

maskChars = '';
for ( var i = 32; i <= 999; i++ ) {
    maskChars += String.fromCharCode( i );
}

class ModChar {
    constructor(initial, animationInterval){
        this.initial = initial;
        this.decrypted = false;
        this.animationInterval = animationInterval;
        this.crypted = this.generateCrypted();
    }
    generateCrypted(){
        return ModChar.doNotModifyChars.includes(this.initial) ? this.initial : maskChars[Math.floor(Math.random()*maskChars.length)]
    }
    initDecrypt(){
        const gen = this.decrypt();
        return new Promise((resolve)=>{
            let speed = 100;

            let werk = () => {
                const {done} = gen.next();

                if(done) {
                    resolve();
                }

                myFunction();
            };

             var myFunction = function() {
                speed += 7.5;
                setTimeout(werk, speed);
            }

            myFunction();
        });
    }
    getValue(){
        return this.decrypted ? this.initial : this.crypted;
    }
    * decrypt(){
        for(let i=0;i<this.animationInterval;i++){
            yield this.crypted = this.generateCrypted();
        }
        this.decrypted = true;
        yield this.initial;
    }
}
ModChar.doNotModifyChars = ["\n"," "];

class DataProcessor {
    constructor(){
        this.chars = null;//It supposed to contain all chars
        this.rows = [];//It has all rows with text
        this.decrypted = false;
        this.speed = 0;
    }
    getTextFromCryptedChars(chars){
        return [].concat.apply([], chars).reduce((res, char)=>{
            return res.push(char.getValue()), res;
        },[]).join("");
    }
    getCryptedCharsFromText(text){
        this.rows = text.split("\n");
        this.chars = this.rows.reduce((res, row)=>{//[new Char, new Char, new Char,new Char, new Char, new Char...]
            row = row.split("").map((char)=>{
                return new ModChar(char, (Math.random()*20|0));
            });
            row.unshift(new ModChar("\n"));
            return [...res, ...row];
        }, []);
        return this.chars;
    }
    getCryptedText(text){
        return this.getTextFromCryptedChars(this.getCryptedCharsFromText(text))
    }
    initDecrypt(){
        var pr = this.chars.map((char)=>{
            return char.initDecrypt();
        });
        Promise.all(pr).then(()=>{
            this.decrypted = true;
        })
    }
    getSnapshot(){
        let value = this.getTextFromCryptedChars(this.chars);
        return {
            done: this.decrypted,
            value
        }
    }
}


let processInput = (data, selector) => {
    const dataProcessor = new DataProcessor();
    console.log(dataProcessor.getCryptedText(data));

    let interval = setInterval(()=>{
        const l = dataProcessor.rows.length;
        let {done, value} = dataProcessor.getSnapshot();


        $(selector).text(value);

        if(done){
            clearInterval(interval);
            console.log('fin')
        }

    }, 5);

    dataProcessor.initDecrypt();
};

let temp = $('.crypto').each(function(){ processInput($(this).text(), this); });

})(jQuery);