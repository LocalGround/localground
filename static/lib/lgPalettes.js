define(["palette"
    ],
    function () {
        'use strict';

       
        var lgPalettes = function () {

            this.getAllPalettes = function(itemCount = 8, symbolType) {
                let count = itemCount;
                if (count > 8) { count = 8; }

                let seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8;
                const catPalettes = ['cb-Accent', 'cb-Dark2', 'cb-Paired', 'cb-Pastel1', 'cb-Set1', 'cb-Set2', 'cb-Set3', 'tol-rainbow'];
                const contPalettes = ['cb-Blues', 'cb-Oranges', 'cb-Greys', 'cb-YlGn', 'cb-RdYlBu', 'tol-dv', 'cb-Purples', 'cb-RdPu'];

                let paletteList, buckets;

                
                if (symbolType === 'uniform') {
                    buckets = count;
                    paletteList = catPalettes;
                } else {
                    if (symbolType === 'continuous') {
                        paletteList = contPalettes;
                        buckets = count + 1;
                        seq1 = palette(paletteList[0], buckets);
                        seq2 = palette(paletteList[1], buckets);
                        seq3 = palette(paletteList[2], buckets);
                        seq4 = palette(paletteList[3], buckets);
                        seq5 = palette(paletteList[4], buckets);
                        seq6 = palette(paletteList[5], buckets);
                        seq7 = palette(paletteList[6], buckets);
                        seq8 = palette(paletteList[7], buckets);
                    } else {
                        paletteList = catPalettes;
                        buckets = count;
                        seq1 = palette('mpn65', 8);
                        seq2 = palette('tol', 8);
                        seq3 = palette('cb-Paired', 8);
                        seq4 = palette('cb-Pastel1', 8);
                        seq5 = palette('cb-Set1', 8);
                        seq6 = palette('cb-Set3', 8);
                        seq7 = palette('tol-rainbow', 8);
                        seq8 = palette('rainbow', 8);
                    }
                }

                console.log('mpn65', seq1);

                // seq1 = palette(paletteList[0], buckets);
                // seq2 = palette(paletteList[1], buckets);
                // seq3 = palette(paletteList[2], buckets);
                // seq4 = palette(paletteList[3], buckets);
                // seq5 = palette(paletteList[4], buckets);
                // seq6 = palette(paletteList[5], buckets);
                // seq7 = palette(paletteList[6], buckets);
                // seq8 = palette(paletteList[7], buckets);

                let allPalettes = [seq1, seq2, seq3, seq4, seq5, seq6, seq7, seq8];

                // remove the first color from continuous palette
                if (symbolType === 'continuous') {
                    allPalettes.forEach((seq, index) => {
                        seq.shift();
                    });
                }
                return allPalettes
            }

            this.getPalette = function(paletteId, itemCount, symbolType) {
                const palettes = this.getAllPalettes(itemCount, symbolType);
                return palettes[paletteId]
            }
        };
        return lgPalettes;
    });
