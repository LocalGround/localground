const applyFilter = () => {
    const searchTerm = document.querySelector("#search-bar").value;
    for (const map of mapData) {
        let text = map.paragraphs.join(' ') + map.header + map.footer + map.tags.join(' ');
        if (map.location) {
            text +=  map.location.county + ' ' + map.location.country + ' ' +
                     map.location.state + ' ' + map.location.city
        }
        map.hide = !checkMatch(text, searchTerm); 
    }
    renderData();
};
 
const checkMatch = (text, searchTerm) => {
    console.log(text);
    if (text.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1) {
       return true;
    }
    return false;
};

const appendHTMLtoDOM = (elem, htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    while (div.children.length > 0) {
        elem.appendChild(div.children[0]);
    }
    return div;
};

document.querySelector('.filter-button').onclick = () => {
    const searchBar = document.querySelector('#search-bar');
    const xPos = searchBar.offsetLeft;
    const yPos = searchBar.offsetTop + searchBar.clientHeight;
    const w = searchBar.clientWidth;

    filterPanel = document.querySelector('.filter-panel');
    if (!filterPanel) {
        appendHTMLtoDOM(
            document.querySelector('body'),
            `<div style="top: ${yPos}px; left: ${xPos}px; width: ${w}px;" class="filter-panel">
                <p>Filter Panel coming soon!</p>
            </div>`
        );
        filterPanel = document.querySelector('.filter-panel');
        return;
    }
    if (filterPanel.style.display !== 'none') {
        filterPanel.style.display = 'none';
    } else {
        filterPanel.style.display = 'block';
        filterPanel.style.top = yPos + 'px';
        filterPanel.style.left = xPos + 'px';
        filterPanel.style.width = w + 'px';
    }
}
document.querySelector('#search-bar').onkeyup = applyFilter;