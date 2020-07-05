class Legend {
    layerData;

    constructor (map, layerObj) {
        // add mixins:
        Object.assign(this, mixins);

        this.layerData = Object.values(layerObj);

        // init legend:
        const legend = L.control({position: 'topright'});
        legend.onAdd = this.addLegendContainer.bind(this);
        legend.addTo(map);
        this.renderLegend();
        this.addEventHandlers();

    }


    addLegendContainer () {
        const legendEl = L.DomUtil.create('div', 'legend minimized');
        L.DomEvent.on(legendEl, 'mousewheel', L.DomEvent.stopPropagation);
        
        legendEl.innerHTML = `
            <h2> Legend <i class="fas fa-chevron-down toggle-legend"></i></h2>
            <section class="layer-list"></section>
        `;
        return legendEl;
    }

    renderLegend () {
        this.layerData.forEach( layerModel => {
            const layerItem = new LayerItem(layerModel);
            layerItem.addToDOM('.layer-list');
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
    layerModel;
    constructor (layerObj) {
        // add mixins:
        Object.assign(this, mixins);
        this.layerModel = layerObj;
    }

    addToDOM (selector) {
        const layer = this.layerModel;
        const checked = layer.isShowing ? 'checked' : '';
        document.querySelector(selector).innerHTML = `
            <div class="layer-header">
                <input type="checkbox" data-layer-id="${layer.id}" ${checked} />
                <i class="fa collapse fa-angle-right"></i>
                <span class="layer-title">${layer.title}</span>
            </div>
            <div class="symbol-container"></div>
        `;
        
        const symbols = Object.values(layer.symbols);
        symbols.forEach( symbolModel => {
            symbolModel.layerID = layer.id;
            const symbolItem = new SymbolItem(symbolModel);
            symbolItem.addToDOM('.symbol-container');
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
        const isChecked = ev.currentTarget.checked;
        this.broadcastEvent('toggle-layer-visibility', ev, {
            layerID: parseInt(ev.currentTarget.getAttribute('data-layer-id')),
            show: isChecked
        })
    }

    addEventHandlers () {
        this.attachListener('.legend .collapse, .legend .layer-title', 'click', this.toggleSymbolDetail.bind(this));
        this.attachListener('.legend .layer-header input', 'change', this.toggleLayerVisibility.bind(this));
    }
}

class SymbolItem {
    symbolModel
    el;
    constructor (symbolObj) {
        // add mixins:
        Object.assign(this, mixins);
        this.symbolModel = symbolObj;
        this.el = this.renderElement();
    }

    renderElement () {
        const layerID = this.symbolModel.layerID;
        const symbol = this.symbolModel;
        const headerClass = symbol.isShowing ? '' : 'hidden';
        const iconClass = symbol.isShowing ? 'fa-eye' : 'fa-eye-slash';
        const symbolItems = this.renderSymbolItems(layerID, symbol.id, Object.values(symbol.records));
        
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
                ${symbolItems}
            </div>`);
    }

    addToDOM (selector) {
        const container = document.querySelector(selector);
        container.appendChild(this.el);
        this.addEventHandlers();
    }

    renderSymbolItems (layerID, symbolID, records) {
        return records.map(
            rec => `<div class="symbol-item" 
                data-layer-id="${layerID}"
                data-symbol-id="${symbolID}"
                data-record-id="${rec.id}">${rec.name}</div>`
        ).join('');
    }

    toggleSymbolVisibility (ev) {
        const container = this.el;
        const i = this.el.querySelector('.show-symbol');
        console.log(i, container);
        i.classList.toggle('fa-eye');
        i.classList.toggle('fa-eye-slash');
        container.classList.toggle('hidden');
        this.broadcastEvent('toggle-symbol-visibility', ev, {
            layerID: this.symbolModel.layerID,
            symbolID: this.symbolModel.id,
            show: i.classList.contains('fa-eye')
        });
    }

    showItem (ev) {
        const elem = ev.currentTarget;
        this.broadcastEvent('show-item', ev, {
            layerID: parseInt(elem.getAttribute('data-layer-id')),
            symbolID: parseInt(elem.getAttribute('data-symbol-id')),
            recordID: parseInt(elem.getAttribute('data-record-id'))
        });
        this.removeClass('.symbol-item', 'selected')
        elem.classList.add('selected');
    }

    addEventHandlers () {
        const elem = this.el.querySelector('.show-symbol');
        elem.addEventListener('click', this.toggleSymbolVisibility.bind(this));
        this.attachListener('.legend .symbol-item', 'click', this.showItem.bind(this));
    }
}
