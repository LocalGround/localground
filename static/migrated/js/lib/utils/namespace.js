String.prototype.namespace = function(separator) {
    var ns = this.split(separator || '.'), p = window, i;
    for (i = 0; i < ns.length; i++) {
		p = p[ns[i]] = p[ns[i]] || {};
    }
};

//define legal namespaces here:
'localground'.namespace();
'localground.map'.namespace();