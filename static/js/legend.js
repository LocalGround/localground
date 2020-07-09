class LegendView {
    collection;
    el;
    constructor (map, mapModel) {
        // add mixins:
        Object.assign(this, mixins);
        
        this.model = mapModel;
        mapModel.registerObserver(this);
        this.collection = this.model.layers;

        // init legend control container:
        const legend = L.control({position: 'topright'});
        legend.onAdd = this.addLegendContainer.bind(this);
        legend.addTo(map);
        
        // render legend body:
        this.renderLegendBody();
        this.addEventHandlers();
    }

    update () {
        // console.log('Legend: update called...');
        this.el.querySelector('.toggle-legend').className = this.getToggleClass();
        this.el.className = this.getLegendClass();
    }

    getLegendClass () {
        const className = this.model.legendIsMinimized ? 'minimized' : '';
        return 'legend leaflet-control ' + className;
    }

    getToggleClass () {
        const className = this.model.legendIsMinimized ? 'fa-chevron-down' : 'fa-chevron-up';
        return 'fas toggle-legend ' + className;
    }

    addLegendContainer () {;
        this.el = L.DomUtil.create('div', this.getLegendClass());
        L.DomEvent.on(this.el, 'mousewheel', L.DomEvent.stopPropagation);
        
        this.el.innerHTML = `
            <h2>Legend <i class="${this.getToggleClass()}"></i></h2>
            <section class="layer-list"></section>
        `;
        return this.el;
    }

    renderLegendBody () {
        const parentEl = this.el.querySelector('.layer-list');
        this.collection.forEach( layerModel => {
            const layerItemView = new LayerItemView(layerModel, parentEl);
            layerItemView.addToDOM();
        });
    }

    toggleLegendVisibility (ev) {
        this.model.legendIsMinimized = !this.model.legendIsMinimized;
        this.model.notifyAll();
    }

    addEventHandlers () {
        this.attachListener('.legend h2', 'click', this.toggleLegendVisibility.bind(this));
        this.attachListener('.legend', 'dblclick', ev => ev.stopPropagation());
    } 
}

class LayerItemView {
    model;
    layerModel;
    el;
    parentEl;
    constructor (layerModel, parentElement) {
        // add mixins:
        Object.assign(this, mixins);

        this.model = layerModel;
        this.model.registerObserver(this);
        
        this.el = this.renderElement();
        this.parentEl = parentElement;

    }

    renderElement () {
        const layer = this.model;
        const checked = layer.isShowing ? 'checked' : '';
        return this.createElementFromHTML(`
            <div>
                <div class="layer-header">
                    <input type="checkbox" data-layer-id="${layer.id}" ${checked} />
                    <i class="fa collapse fa-angle-right"></i>
                    <span class="layer-title">${layer.title}</span>
                </div>
                <div class="symbol-container"></div>
            </div>
        `);
    }

    addToDOM () {
        this.parentEl.appendChild(this.el);

        // add marker listings:
        const layer = this.model;
        const symbols = layer.symbols;
        const parentEl = this.el.querySelector('.symbol-container');
        symbols.forEach(symbolModel => {
            const symbolItem = new SymbolItemView(symbolModel, parentEl);
            symbolItem.addToDOM();
        });
        this.addEventHandlers();
    }

    update () {
        this.el.querySelector('.collapse').className = this.getToggleClass();
    }

    getToggleClass () {
        const className = this.model.isExpanded ? 'fa-angle-down' : 'fa-angle-right';
        return 'fa collapse ' + className;
    }

    toggleSymbolDetail (ev) {
        this.model.setIsExpanded(!this.model.isExpanded);
    }

    toggleLayerVisibility (ev) {
        this.model.setIsShowing(!this.model.isShowing);
    }

    addEventHandlers () {
        this.attachListener('.legend .collapse, .legend .layer-title', 'click', this.toggleSymbolDetail.bind(this));
        this.attachListener('.legend .layer-header input', 'change', this.toggleLayerVisibility.bind(this));
    }
}

class SymbolItemView {
    model
    el;
    parentEl;
    constructor (symbolObj, parentElement) {
        // add mixins:
        Object.assign(this, mixins);
        this.model = symbolObj;
        this.model.registerObserver(this);
        this.el = this.renderElement();
        this.parentEl = parentElement;
    }

    renderElement () {
        const layerID = this.model.layerID;
        const symbol = this.model;
        
        return this.createElementFromHTML(`
            <div class="${this.getClass()}">
                <div class="symbol-header">
                    <span>
                        ${symbol.svg}
                        ${symbol.title} (${Object.keys(symbol.records).length})
                    </span>
                    <span>
                        <i class="${this.getEyeballClass()}"
                            data-symbol-id="${symbol.id}" 
                            data-layer-id="${layerID}"></i>
                    </span>
                </div>
                <div class="symbol-items"></div>
            </div>`);
    }

    addToDOM () {
        this.parentEl.appendChild(this.el);
        this.addEventHandlers();

        // add individual marker listings:
        this.addMarkerListingsToDOM();
        
    }

    addMarkerListingsToDOM () {
        const records = Object.values(this.model.records);
        const symbolID = this.model.id;
        const layerID = this.model.layerID;
        const container = this.el.querySelector('.symbol-items');
        records.forEach( recordModel => {
            const item = new ItemView(recordModel, container, symbolID, layerID);
            item.addToDOM();
        });
    }

    toggleSymbolVisibility (ev) {
        this.model.setIsShowing(!this.model.isShowing);
    }

    update () {
        // console.log('Symbol update called: ', this.model.id);
        this.el.className = this.getClass();
        const i = this.el.querySelector('.show-symbol');
        i.className = this.getEyeballClass();
    }

    getClass () {
        const fadeClass = this.model.isShowing ? '' : 'hidden';
        const hiddenClass = this.model.isExpanded ? '' : 'minimized';
        return `symbol-entry ${fadeClass} ${hiddenClass}`;
    }

    getEyeballClass () {
        const iconClass = this.model.isShowing ? 'fa-eye' : 'fa-eye-slash';
        return `fa show-symbol ${iconClass}`;
    }

    addEventHandlers () {
        const elem = this.el.querySelector('.show-symbol');
        elem.addEventListener('click', this.toggleSymbolVisibility.bind(this), false);
    }
}


class ItemView {
    model
    el;
    parentEl;
    symbolID;
    layerID;
    constructor (recordObj, parentElement, symbolID, layerID) {
        // add mixins:
        Object.assign(this, mixins);

        this.model = recordObj;
        this.model.registerObserver(this);
        this.parentEl = parentElement;
        this.symbolID = symbolID;
        this.layerID = layerID;

        this.el = this.renderElement();
    }

    getClass () {
        if (this.model.isActive) {
            return 'symbol-item selected';
        }
        return 'symbol-item';
    }

    renderElement () {
        return this.createElementFromHTML(`
            <div class="${this.getClass()}">${this.model.display_value}</div>`);
    }

    update () {
        this.el.className = this.getClass();
    }

    addToDOM () {
        // const container = document.querySelector(selector);
        this.parentEl.appendChild(this.el);
        this.addEventHandlers();
    }

    showItem (ev) {
        // ignore if disabled:
        if (!this.model.isShowing()) { return; }
        
        // let the entire application know:
        this.broadcastEvent('set-active-record', ev.currentTarget, {
            recordModel: this.model,
            triggerPopup: true
        });
    }

    addEventHandlers () {
        this.el.addEventListener('click', this.showItem.bind(this));
    }
}
