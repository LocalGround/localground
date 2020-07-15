class CodeView {
    constructor (rawJSON) {
        Object.assign(this, mixins);
        this.rawJSON = rawJSON;
        this.render();
    }

    render () {
        document.querySelector('header h1').innerHTML = this.rawJSON.name;
        document.querySelector('main').className = '';
        document.querySelector('main').innerHTML = '<pre></pre>'; 
        document.querySelector('body').style.overflowY = 'scroll'; 
        document.querySelector('pre').innerHTML = `${JSON.stringify(this.rawJSON, null, 3)}`;
    }

    destroy () {
        // pass
    }
}