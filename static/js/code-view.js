class CodeView {
    constructor (rawJSON) {
        Object.assign(this, mixins);
        this.rawJSON = rawJSON;
        this.jsonViewer = new JSONViewer();
        this.render();
    }

    render () {
        document.querySelector('header h1').innerHTML = this.rawJSON.name;
        document.querySelector('main').className = '';
        document.querySelector('main').innerHTML = '';
        // document.querySelector('main').innerHTML = '<pre></pre>'; 
        document.querySelector('body').style.overflowY = 'scroll'; 
        
        document.querySelector("main").appendChild(this.jsonViewer.getContainer());
        // jsonViewer.showJSON(json, maxLvl, colAt);
        this.jsonViewer.showJSON(this.rawJSON, -1, 2);
    }

    destroy () {
        // pass
    }
}