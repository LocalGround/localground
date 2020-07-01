class Legend {
    layerData;

    constructor (map, layerData) {
        this.layerData = layerData;

        // init legend:
        const legend = L.control({position: 'topright'});
        legend.onAdd = this.renderLegend.bind(this);
        legend.addTo(map);

        // create customEvents:
        this.addCustomEvents();

        // add event listeners to the the legend
        this.addEventHandlers();

    }

    renderLegend () {
        const legendEl = L.DomUtil.create('div', 'legend minimized');
        L.DomEvent.on(legendEl, 'mousewheel', L.DomEvent.stopPropagation);
        
        const legendBody = this.layerData.map(
                layer => this.renderLayer(layer)
            ).join('');
        
            legendEl.innerHTML = `
            <h2> Legend <i class="fas fa-chevron-down toggle-legend"></i></h2>
            <section>${legendBody}</section>
        `;
        return legendEl;
    }

    renderLayer (layer) {
        const symbols = layer.symbols.map(
            symbol => this.renderSymbol(layer, symbol)
        ).join('');

        return `
            <div class="layer-header">
                <input type="checkbox" data-layer-id="${layer.id}" checked />
                <i class="fa collapse fa-angle-right"></i>
                <span class="layer-title">${layer.title}</span>
            </div>
            <div class="symbol-container">${symbols}</div>
        `;
    }

    renderSymbol (layer, symbol) {
        const symbolItems = this.renderSymbolItems(symbol.records);
        return `
            <div class="symbol-entry minimized">
                <div class="symbol-header">
                    <span>
                        ${symbol.svg}
                        ${symbol.title} (${symbol.records.length})
                    </span>
                    <span>
                        <i class="fa show-symbol fa-eye"
                            data-symbol-id="${symbol.id}" 
                            data-layer-id="${layer.id}"></i>
                    </span>
                </div>
                ${symbolItems}
            </div>`;
    }

    renderSymbolItems (records) {
        return records.map(
            rec => `<div data-record-id="${rec.id}" class="symbol-item">${rec.name}</div>`
        ).join('');
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

    toggleSymbolDetail (ev) {
        const toggler = ev.currentTarget;
        toggler.classList.toggle('fa-angle-right')
        toggler.classList.toggle('fa-angle-down');
        const symbolEntries = toggler.parentElement.nextElementSibling.querySelectorAll('.symbol-entry');
        for (const entry of symbolEntries) {
            entry.classList.toggle('minimized');
        }
        ev.stopPropagation();
    }

    addCustomEvents () {
        this.showMarkerEvent = new CustomEvent("toggle-layer-visibility", {
            bubbles: true
        });
    }

    broadcastEvent(name, ev, data) {
        const customEvent = new CustomEvent(name, {
            bubbles: true,
            detail: data
        });
        ev.currentTarget.dispatchEvent(customEvent);
    }

    toggleLayerVisibility (ev) {
        this.broadcastEvent('toggle-layer-visibility', ev, {
            layerID: parseInt(ev.currentTarget.getAttribute('data-layer-id')),
            show: ev.currentTarget.checked
        })
    }

    toggleSymbolVisibility (ev) {
        const i = ev.currentTarget;
        const container = i.parentElement.parentElement.parentElement;
        i.classList.toggle('fa-eye');
        i.classList.toggle('fa-eye-slash');
        container.classList.toggle('hidden');
        this.broadcastEvent('toggle-symbol-visibility', ev, {
            layerID: parseInt(i.getAttribute('data-layer-id')),
            symbolID: parseInt(i.getAttribute('data-symbol-id')),
            show: i.classList.contains('fa-eye')
        });
    }

    showItem (ev) {
        this.broadcastEvent('show-item', ev, {
            recordID: parseInt(ev.currentTarget.getAttribute('data-record-id'))
        });
    }

    attachListener (selector, eventName, listener) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            el.addEventListener(eventName, listener.bind(this));
        }
    }

    addEventHandlers () {
        this.attachListener('.legend h2', 'click', this.toggleLegendVisibility);
        this.attachListener('.legend', 'dblclick', ev => ev.stopPropagation());
        this.attachListener('.legend .collapse', 'click', this.toggleSymbolDetail);
        this.attachListener('.legend .layer-header input', 'change', this.toggleLayerVisibility);
        this.attachListener('.legend .show-symbol', 'click', this.toggleSymbolVisibility);
        this.attachListener('.legend .symbol-item', 'click', this.showItem);
    }
    
}


