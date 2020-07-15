class CardView {
    constructor (model) {
        Object.assign(this, mixins);
        this.model = model;
        this.records = this.model.getRecords();
        this.numColumns = 3;

        this.renderData();
        this.initMobileListeners();
    }

    renderData () {
        document.querySelector('header h1').innerHTML = this.model.name;
        document.querySelector('main').className = 'grid'; 
        document.querySelector('body').style.overflowY = 'scroll'; 
        let i = 0;
        let cardMatrix = [[]];
        if (this.numColumns == 2) {
            cardMatrix = [[], []]
        } else if (this.numColumns == 3) {
            cardMatrix = [[], [], []]
        } else if (this.numColumns == 4) {
            cardMatrix = [[], [], [], []]
        };
        if (this.records.length === 0) {
            document.querySelector('main').innerHTML = `
                <p class="no-matches">No matches for 
                    "${document.querySelector("#search-bar").value}</strong>"
                </p>
            `;
            // document.querySelector('.grid').innerHTML = "";
            return;
        } else {
            document.querySelector('main').innerHTML = "";
        }
        for (const rec of this.records) {
            // const card = new Card(this.selectedRecord, '#card-holder');
            // document.querySelector('main').classList.add('with-card');
            // card.addCardToDOM();
            cardMatrix[i % this.numColumns].push(new Card(rec));
            i++;
        }
        // console.log(cardMatrix);
        document.querySelector(".grid").innerHTML = "";
        for (const cardList of cardMatrix) {
            console.log(cardList);
            const parentEl = this.createElementFromHTML(`<section class="cards"></section>`);
            document.querySelector(".grid").appendChild(parentEl);
            for (const card of cardList) {
                card.addCardToDOM(parentEl, false, false);
            }
            // const htmlColumn = `<section class="cards">${column.join('\n')}</section>`;
            // document.querySelector(".grid").innerHTML += htmlColumn;
        }
        this.addEventHandlers();
    };
    

    initMobileListeners () {
       
        const tablet = window.matchMedia("(max-width: 1000px)");
        tablet.addListener(() => {
            this.numColumns = 3;
            if (tablet.matches) {
                this.numColumns = 2;
            }
            this.renderData()
        });
       
        const mobile = window.matchMedia("(max-width: 700px)");
        mobile.addListener(() => {
            this.numColumns = 2;
            if (mobile.matches) {
                this.numColumns = 1;
            }
            this.renderData();
        });
    }
    
    addEventHandlers () {
        const buttons = document.querySelectorAll('.add-button');
        for (const btn of buttons) {
            btn.onclick = (ev) => { 
                const cardElement = ev.srcElement.parentElement.parentElement; 
                cardElement.querySelector('.metadata').style.display = 'block';
                ev.preventDefault();
            };
        }
    }
}

