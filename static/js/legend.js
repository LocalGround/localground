class Legend {
    layerData;

    constructor (map, layerObj) {
        // add mixins:
        Object.assign(this, mixins);
        console.log(this);

        this.layerData = Object.values(layerObj);

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
        const symbols = Object.values(layer.symbols).map(
            symbol => this.renderSymbol(layer, symbol)
        ).join('');
        const checked = layer.isShowing ? 'checked' : '';
        return `
            <div class="layer-header">
                <input type="checkbox" data-layer-id="${layer.id}" ${checked} />
                <i class="fa collapse fa-angle-right"></i>
                <span class="layer-title">${layer.title}</span>
            </div>
            <div class="symbol-container">${symbols}</div>
        `;
    }

    renderSymbol (layer, symbol) {
        const symbolItems = this.renderSymbolItems(layer.id, symbol.id, Object.values(symbol.records));
        const headerClass = symbol.isShowing ? '' : 'hidden';
        const iconClass = symbol.isShowing ? 'fa-eye' : 'fa-eye-slash';

        return `
            <div class="symbol-entry minimized ${headerClass}">
                <div class="symbol-header">
                    <span>
                        ${symbol.svg}
                        ${symbol.title} (${Object.keys(symbol.records).length})
                    </span>
                    <span>
                        <i class="fa show-symbol ${iconClass}"
                            data-symbol-id="${symbol.id}" 
                            data-layer-id="${layer.id}"></i>
                    </span>
                </div>
                ${symbolItems}
            </div>`;
    }

    renderSymbolItems (layerID, symbolID, records) {
        return records.map(
            rec => `<div class="symbol-item" 
                data-layer-id="${layerID}"
                data-symbol-id="${symbolID}"
                data-record-id="${rec.id}">${rec.name}</div>`
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

    addCustomEvents () {
        this.showMarkerEvent = new CustomEvent("toggle-layer-visibility", {
            bubbles: true
        });
    }

    toggleLayerVisibility (ev) {
        const isChecked = ev.currentTarget.checked;
        this.broadcastEvent('toggle-layer-visibility', ev, {
            layerID: parseInt(ev.currentTarget.getAttribute('data-layer-id')),
            show: isChecked
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
        this.attachListener('.legend h2', 'click', this.toggleLegendVisibility);
        this.attachListener('.legend', 'dblclick', ev => ev.stopPropagation());
        this.attachListener('.legend .collapse, .legend .layer-title', 'click', this.toggleSymbolDetail.bind(this));
        this.attachListener('.legend .layer-header input', 'change', this.toggleLayerVisibility.bind(this));
        this.attachListener('.legend .show-symbol', 'click', this.toggleSymbolVisibility.bind(this));
        this.attachListener('.legend .symbol-item', 'click', this.showItem.bind(this));
    }
    
}


