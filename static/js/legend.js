class Legend {
    layerData;

    constructor (map, layerData) {
        this.map = map;
        this.layerData = layerData;
        this.legend = L.control({position: 'topright'});
        this.legend.onAdd = this.renderLegend.bind(this);
        this.legend.addTo(map);
        this.addEventHandlers();
    }

    renderLegend (map) {
        this.el = L.DomUtil.create('div', 'legend minimized');
        let html = '<h2>Legend <i class="fas fa-chevron-down toggle-legend"></i></h2>';
        for (const layer of this.layerData) {
            html += `
                <ul>
                    <li>
                        <input type="checkbox" checked />
                        <i class="fa fa-lg collapse fa-angle-right"></i>
                        <span class="layer_title">${layer.title}</span>`;
            
            html += '<ul class="symbol-container">'
            for (const symbol of layer.symbols) {
                html += this.renderSymbol(symbol);
            }
            html += '</ul></li></ul>';
        }
        this.el.innerHTML = html;
        return this.el;
    }

    renderSymbol (symbol) {
        return `
            <li class="symbol-entry minimized">
                <div class="symbol-header">
                    <span>
                        ${symbol.svg}
                        ${symbol.title} (${symbol.records.length})
                    </span>
                    <i class="fa legend-show_symbol fa-eye"></i>
                </div>
                ${this.renderMarkers(symbol.records)}
            </li>
        `;
    }

    renderMarkers (records) {
        const items = [];
        for (const rec of records) {
            items.push(`<div class="symbol-item">${rec.name}</div>`)
        }
        return items.join('');
    }

    addEventHandlers() {
        document.querySelector('.legend h2').addEventListener('click', ev => {
            const legend = document.querySelector('.legend');
            const arrow = legend.querySelector('.toggle-legend');
            legend.classList.toggle('minimized');
            arrow.classList.toggle('fa-chevron-down');
            arrow.classList.toggle('fa-chevron-up');
            ev.preventDefault();
            ev.stopPropagation();
        });
    
        document.querySelector('.legend').addEventListener('dblclick', ev => {
            ev.stopPropagation();
        });
    }
}



/*
<!-- svg viewBox="{{ icon.viewBox }}" width="{{ width }}" height="{{ height }}">
    <path fill="{{ icon.fillColor }}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"
          stroke-width="{{ strokeWeight }}" stroke="{{ icon.strokeColor }}" d="{{ icon.path }}"></path>
</svg -->
{{#if layerIsIndividual}}
    <a href="{{records.0.url}}">
        <div class="symbol-entry-header legend-symbol_collapsed legend-symbol_ind {{#ifequal records.0.itemId activeItemId}} selectedRecord {{/ifequal}} ">

            <span class="legend-symbol_svg">{{{records.0.recordSvg}}}</span>
            <span>{{ title }}</span>
            <i class="fa fa-eye legend-show_symbol"></i>
        </div>
    </a>

{{else}}
    <div class="symbol-entry-header {{#if collapsed}}legend-symbol_collapsed {{else}} legend-symbol_expanded{{/if}}">

        <span class="legend-symbol_svg">{{{symbolSvg}}}</span>
        <div>
            <span>{{ title }}</span>
            <span class="count">({{count}})</span>
        </div>
        <i class="fa fa-eye legend-show_symbol"></i>
    </div>

    <ul class="presentation-records_wrapper" {{#if collapsed}}style="display: none" {{else}} style="display: block"{{/if}}>
        {{#each records}}
        <a href="{{this.url}}">
            <li class="presentation-record_item {{#ifequal this.itemId ../activeItemId}} selectedRecord {{/ifequal}}">
                <span class="legend-record_icon">
                    {{#if this.recordSvg}} 
                        {{{this.recordSvg}}} 
                    {{else}}
                        <i class="fa fa-question-circle"></i>
                    {{/if}}
                </span>
                <span>{{this.displayText}}</span>
            </li>
        </a>
        {{/each}}
    </ul>
{{/if}}
*/