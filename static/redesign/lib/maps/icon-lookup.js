define([], function () {
    "use strict";

    var Icon = function (key) {
        var baseWidth = 15,
            baseHeight = 15,
            lookup = {
                circle: {
                    path: 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                },
                circleHollow: {
                    path: 'M7.5,0C11.6422,0,15,3.3578,15,7.5S11.6422,15,7.5,15 S0,11.6422,0,7.5S3.3578,0,7.5,0z M7.5,1.6666c-3.2217,0-5.8333,2.6117-5.8333,5.8334S4.2783,13.3334,7.5,13.3334 s5.8333-2.6117,5.8333-5.8334S10.7217,1.6666,7.5,1.6666z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                },
                pin: {
                    path: 'M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                },
                cross: {
                    path: 'M2.64,1.27L7.5,6.13l4.84-4.84C12.5114,1.1076,12.7497,1.0029,13,1c0.5523,0,1,0.4477,1,1 c0.0047,0.2478-0.093,0.4866-0.27,0.66L8.84,7.5l4.89,4.89c0.1648,0.1612,0.2615,0.3796,0.27,0.61c0,0.5523-0.4477,1-1,1 c-0.2577,0.0107-0.508-0.0873-0.69-0.27L7.5,8.87l-4.85,4.85C2.4793,13.8963,2.2453,13.9971,2,14c-0.5523,0-1-0.4477-1-1 c-0.0047-0.2478,0.093-0.4866,0.27-0.66L6.16,7.5L1.27,2.61C1.1052,2.4488,1.0085,2.2304,1,2c0-0.5523,0.4477-1,1-1 C2.2404,1.0029,2.4701,1.0998,2.64,1.27z'
                },
                square: {
                    path: 'M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z'
                },
                squareHollow: {
                    path: 'M12.7,2.3v10.4H2.3V2.3H12.7 M13,1H2C1.4477,1,1,1.4477,1,2v11c0,0.5523,0.4477,1,1,1h11c0.5523,0,1-0.4477,1-1V2 C14,1.4477,13.5523,1,13,1L13,1z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                },
                triangle: {
                    path: 'M7.5385,2 C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154 C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                },
                triangleHollow: {
                    path: 'M7.5243,1.5004 C7.2429,1.4913,6.9787,1.6423,6.8336,1.8952l-5.5,9.8692C1.0218,12.3078,1.395,12.9999,2,13h11 c0.605-0.0001,0.9782-0.6922,0.6664-1.2355l-5.5-9.8692C8.0302,1.6579,7.7884,1.5092,7.5243,1.5004z M7.5,3.8993l4.1267,7.4704 H3.3733L7.5,3.8993z'
                },
                camera: {
                    path: 'M6,2C5.446,2,5.2478,2.5045,5,3L4.5,4h-2C1.669,4,1,4.669,1,5.5v5C1,11.331,1.669,12,2.5,12h10 c0.831,0,1.5-0.669,1.5-1.5v-5C14,4.669,13.331,4,12.5,4h-2L10,3C9.75,2.5,9.554,2,9,2H6z M2.5,5C2.7761,5,3,5.2239,3,5.5 S2.7761,6,2.5,6S2,5.7761,2,5.5S2.2239,5,2.5,5z M7.5,5c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3s-3-1.3431-3-3S5.8431,5,7.5,5z M7.5,6.5C6.6716,6.5,6,7.1716,6,8l0,0c0,0.8284,0.6716,1.5,1.5,1.5l0,0C8.3284,9.5,9,8.8284,9,8l0,0C9,7.1716,8.3284,6.5,7.5,6.5 L7.5,6.5z'
                },
                plus: {
                    path: 'M7,1C6.4,1,6,1.4,6,2v4H2C1.4,6,1,6.4,1,7v1 c0,0.6,0.4,1,1,1h4v4c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V9h4c0.6,0,1-0.4,1-1V7c0-0.6-0.4-1-1-1H9V2c0-0.6-0.4-1-1-1H7z',
                    width: baseWidth * 2,
                    height: baseHeight * 2
                }
            };

        this.getViewBox = function () {
            return '-1 -1 ' + (this.baseWidth + 1) + ' ' + (this.baseHeight + 2);
        };

        this.setIcon = function (key) {
            var icon;
            switch (key) {
            case 'audio':
                icon = lookup.circle;
                icon.width = 12;
                icon.height = 12;
                icon.fillColor = '#62929E';
                break;
            case 'photo':
                console.log('photo');
                icon = lookup.circle;
                icon.width = 12;
                icon.height = 12;
                icon.fillColor = '#7084c2';
                break;
            case 'marker':
            case 'record':
                icon = lookup.circle;
                icon.width = 23;
                icon.height = 23;
                icon.fillColor = '#ed867d';
                break;
            default:
                icon = lookup[key];
                break;
            }
            icon.baseWidth = icon.baseWidth || baseWidth;
            icon.baseHeight = icon.baseHeight || baseHeight;
            icon.scale = icon.width / icon.baseWidth;
            console.log(icon);
            _.extend(this, icon);
            this.viewBox = this.getViewBox();
        };
        this.initialize = function (key) {
            this.setIcon(key);
        };
        this.initialize(key);
    };
    return Icon;
});