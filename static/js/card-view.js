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
            cardMatrix[i % this.numColumns].push(new Card(rec));
            i++;
        }
        // console.log(cardMatrix);
        document.querySelector(".grid").innerHTML = "";
        for (const cardList of cardMatrix) {
            const parentEl = this.createElementFromHTML(`<section class="cards"></section>`);
            document.querySelector(".grid").appendChild(parentEl);
            for (const card of cardList) {
                card.addCardToDOM(parentEl, false, false);
            }
        }
    };

    tabletListener () {
        this.numColumns = 3;
        if (this.tablet.matches) {
            this.numColumns = 2;
        }
        this.renderData()
    }

    mobileListener () {
        this.numColumns = 2;
        if (this.mobile.matches) {
            this.numColumns = 1;
        }
        this.renderData();
    }

    initMobileListeners () {
        this.tablet = window.matchMedia("(max-width: 1000px)");
        this.mobile = window.matchMedia("(max-width: 700px)");

        this.tablet.addListener(this.tabletListener);
        this.mobile.addListener(this.mobileListener);
    }

    destroy () {
        // make sure you remove event handlers or there will be chaos:
        this.tablet.removeListener(this.tabletListener);
        this.mobile.removeListener(this.mobileListener);
    }
}

