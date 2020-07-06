class Legend {
    collection;
    el;
    constructor (map, layerObj) {
        // add mixins:
        Object.assign(this, mixins);

        this.collection = Object.values(layerObj);

        // init legend:
        const legend = L.control({position: 'topright'});
        legend.onAdd = this.addLegendContainer.bind(this);
        legend.addTo(map);
        this.renderLegend();
        this.addEventHandlers();

    }

    addLegendContainer () {
        this.el = L.DomUtil.create('div', 'legend minimized');
        L.DomEvent.on(this.el, 'mousewheel', L.DomEvent.stopPropagation);
        
        this.el.innerHTML = `
            <h2> Legend <i class="fas fa-chevron-down toggle-legend"></i></h2>
            <section class="layer-list"></section>
        `;
        return this.el;
    }

    renderLegend () {
        const parentEl = this.el.querySelector('.layer-list');
        this.collection.forEach( layerModel => {
            const layerItem = new LayerItem(layerModel, parentEl);
            layerItem.addToDOM();
        });
    }

    toggleLegendVisibility(ev) {
        const legend = document.querySelector('.legend');
        const arrow = legend.querySelector('.toggle-legend');
        legend.classList.toggle('minimized');
        arrow.classList.toggle('fa-chevron-down');
        arrow.classList.toggle('fa-chevron-up');
        ev.preventDefault();
        ev.stopPropagation();
    }

    addEventHandlers () {
        this.attachListener('.legend h2', 'click', this.toggleLegendVisibility);
        this.attachListener('.legend', 'dblclick', ev => ev.stopPropagation());
    } 
}

class LayerItem {
    model;
    layerModel;
    el;
    parentEl;
    constructor (layerObj, parentElement) {
        // add mixins:
        Object.assign(this, mixins);

        this.model = new LayerModel(layerObj);
        this.model.registerObserver(this);
        
        this.el = this.renderElement();
        this.parentEl = parentElement;

    }

    renderElement () {
        console.log('rerendering!!!');
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

    update() {
        console.log('re-rendering');
        this.parentEl.innerHTML = this.renderElement().innerHTML;
    }

    addToDOM () {
        this.parentEl.appendChild(this.el);

        // add marker listings:
        const layer = this.model;
        const symbols = Object.values(layer.symbols);
        const parentEl = this.el.querySelector('.symbol-container');
        symbols.forEach( symbolModel => {
            symbolModel.layerID = layer.id;
            const symbolItem = new SymbolItem(symbolModel, parentEl);
            symbolItem.addToDOM();
        });
        this.addEventHandlers();
    }

    toggleSymbolDetail (ev) {
        const parent = ev.currentTarget.parentElement;
        const toggler = parent.querySelector('.collapse');
        toggler.classList.toggle('fa-angle-right')
        toggler.classList.toggle('fa-angle-down');
        const symbolEntries = toggler.parentElement.nextElementSibling.querySelectorAll('.symbol-entry');
        for (const entry of symbolEntries) {
            entry.classList.toggle('minimized');
        }
        ev.stopPropagation();
    }

    toggleLayerVisibility (ev) {
        this.model.isVisible = ev.currentTarget.checked;
        this.model.notifyAll();
        // const isChecked = ev.currentTarget.checked;
        // this.broadcastEvent('toggle-layer-visibility', ev, {
        //     layerID: parseInt(ev.currentTarget.getAttribute('data-layer-id')),
        //     show: isChecked
        // })
    }

    addEventHandlers () {
        this.attachListener('.legend .collapse, .legend .layer-title', 'click', this.toggleSymbolDetail.bind(this));
        this.attachListener('.legend .layer-header input', 'change', this.toggleLayerVisibility.bind(this));
    }
}

class SymbolItem {
    model
    el;
    parentEl;
    constructor (symbolObj, parentElement) {
        // add mixins:
        Object.assign(this, mixins);
        this.model = symbolObj;
        this.el = this.renderElement();
        this.parentEl = parentElement;
    }

    renderElement () {
        const layerID = this.model.layerID;
        const symbol = this.model;
        const headerClass = symbol.isShowing ? '' : 'hidden';
        const iconClass = symbol.isShowing ? 'fa-eye' : 'fa-eye-slash';
        
        return this.createElementFromHTML(`
            <div class="symbol-entry minimized ${headerClass}">
                <div class="symbol-header">
                    <span>
                        ${symbol.svg}
                        ${symbol.title} (${Object.keys(symbol.records).length})
                    </span>
                    <span>
                        <i class="fa show-symbol ${iconClass}"
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
            const item = new Item(recordModel, container, symbolID, layerID);
            item.addToDOM();
        });
    }

    toggleSymbolVisibility (ev) {
        const container = this.el;
        const i = this.el.querySelector('.show-symbol');
        i.classList.toggle('fa-eye');
        i.classList.toggle('fa-eye-slash');
        container.classList.toggle('hidden');
        this.broadcastEvent('toggle-symbol-visibility', ev, {
            layerID: this.model.layerID,
            symbolID: this.model.id,
            show: i.classList.contains('fa-eye')
        });
    }

    addEventHandlers () {
        const elem = this.el.querySelector('.show-symbol');
        elem.addEventListener('click', this.toggleSymbolVisibility.bind(this), false);
    }
}


class Item {
    model
    el;
    parentEl;
    symbolID;
    layerID;
    constructor (recordObj, parentElement, symbolID, layerID) {
        // add mixins:
        Object.assign(this, mixins);

        this.model = recordObj;
        this.parentEl = parentElement;
        this.symbolID = symbolID;
        this.layerID = layerID;

        this.el = this.renderElement();
    }

    renderElement () {
        return this.createElementFromHTML(`
            <div class="symbol-item">${this.model.name}</div>`);
    }

    addToDOM () {
        // const container = document.querySelector(selector);
        this.parentEl.appendChild(this.el);
        this.addEventHandlers();
    }

    showItem (ev) {
        const elem = ev.currentTarget;
        const data = {
            layerID: this.layerID,
            symbolID: this.symbolID,
            recordID: this.model.id
        };
        this.broadcastEvent('show-item', ev, data);
        this.removeClass('.symbol-item', 'selected')
        elem.classList.add('selected');
    }

    addEventHandlers () {
        this.el.addEventListener('click', this.showItem.bind(this));
    }
}
