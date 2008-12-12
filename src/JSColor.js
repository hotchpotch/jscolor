
JSColor = function() {};

JSColor.Util = {
    getHSB: function(uint) {
        var rgb = this.getRGB(uint);
        return this.RGB2HSB(rgb.r, rgb.g, rgb.b);
    },
    getHLS: function(uint) {
        var rgb = this.getRGB(uint);
        return this.RGB2HLS(rgb.r, rgb.g, rgb.b);
    },
    getRGB: function(uint) {
        return {
            r: uint >> 16 & 0xFF,
            g: uint >> 8  & 0xFF,
            b: uint       & 0xFF
        }
    },
    setHSB: function(rgb, h, s, b) {
        var t = this.HSB2RGB(h, s, b);
        this.setRGB(rgb, t.r, t.g, t.b);
        return rgb;
    },
    setHLS:  function(rgb, h, l, s) {
        var t = this.HLS2RGB(h, l, s);
        this.setRGB(rgb, t.r, t.g, t.b);
        return rgb;
    },
    setRGB: function(rgb, r, g, b) {
        r = (r < 0) ? 0 : (r > 255) ? 255 : Math.round(r);
        g = (g < 0) ? 0 : (g > 255) ? 255 : Math.round(g);
        b = (b < 0) ? 0 : (b > 255) ? 255 : Math.round(b);
        rgb.r = r << 16;
        rgb.g = g << 8;
        rgb.b = b;
        return rgb;
    },
    HLS2HSB: function(h, l, s) {
        var rgb = this.HLS2RGB(h, l, s);
        return 
    },
    HLS2RGB: function(h, l, s) {
        var max, min;
        h = (h < 0) ? (h % 360 + 360) : (h >= 360 ? h % 360 : h);
        l = (l < 0) ? 0 : (l > 100) ? 100 : l;
        s = (s < 0) ? 0 : (s > 100) ? 100 : s;

        l *= 0.01;
        s *= 0.01;

        if (s == 0) {
            var val = l * 255;
            return {
                r: val,
                g: val,
                b: val
            }
        }

        if (l < 0.5) {
            max = l * (1 + s) * 255
        } else {
            max = (l * (1 - s) + s) * 255
        }
        min = (2 * l) * 255 - max;

        return this._hMinMax2RGB(h, min, max);
    },
    HSB2HLS: function(h, s, b) {
        var rgb = this.HSB2RGB(h, s, b);
        return this.RGB2HLS(rgb.r, rgb.g, rgb.b);
    },
    HSB2RGB: function(hue, sat, bri) {
        hue = (hue<0)? hue % 360+360 : (hue>=360)? hue%360: hue;
        sat = (sat<0)? 0 : (sat>100)? 100: sat;
        bri = (bri<0)? 0 : (bri>100)? 100: bri;     

        sat *= 0.01;
        bri *= 0.01;

        if(sat == 0){
            var val = bri*255;
            return {r:val, g:val, b:val};
        }

        var max = bri*255;
        var min = max*(1-sat);

        return this._hMinMax2RGB(hue, min, max);
    },
    RGB2HSB: function(r, g, b) {
        r = (r < 0)? 0 : (r>255)? 255: Math.round(r);
        g = (g < 0)? 0 : (g>255)? 255: Math.round(g);
        b = (b < 0)? 0 : (b>255)? 255: Math.round(b);

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var sat;

        //saturation
        if (max==0) {
            return {h:0, s: 0, b: 0}
        } else {
            sat = (max - min)/max * 100;
        }

        var bri = max / 255 * 100;

        var hue = this._getHue(r, b, g, max, min);
        return {h:hue, s:sat, b:bri}
    },
    RGB2HLS: function(r, g, b) {
        r = (r < 0)? 0 : (r>255)? 255: Math.round(r);
        g = (g < 0)? 0 : (g>255)? 255: Math.round(g);
        b = (b < 0)? 0 : (b>255)? 255: Math.round(b);

        var min = Math.min(r,g,b);
        var max = Math.max(r,g,b);
        var l = (max + min)*0.5 / 255 * 100;

        var dist = (max - min);
        var h;
        var s;
        if(dist==0){
            h = 0;
            s = 0;
        }else{
            if( l < 127.5){
                s = dist/(max+min)*100;
            }else{
                s = dist/(510-max-min)*100;
            }

            h = 360 - this._getHue(r,g,b,max, min);
        }

        return {h:h, l:l, s:s}
    },
    getLuminous: function(color) {
        var r = color >> 16 & 0xff;
        var g = color >> 8 & 0xff;
        var b = color & 0xff;

        var min = Math.min(r,g,b);
        var max = Math.max(r,g,b);
        var l = (max + min)*0.5 / 255 * 100;


        return l;
    },
    _hMinMax2RGB: function(h, min, max) {
        var r,g,b;
        var area = Math.floor(h / 60);
        switch (area) {
            case 0:
                r = max;
                //0 - 0, 60-255
                g = min+h * (max-min)/ 60;
                b = min;
                break;
            case 1:
                r = max-(h-60) * (max-min)/60;
                g = max;
                b = min;
                break;
            case 2:
                r = min ;
                g = max;
                b = min+(h-120) * (max-min)/60;
                break;
            case 3:
                r = min;
                g = max-(h-180) * (max-min)/60;
                b = max;
                break;
            case 4:
                r = min+(h-240) * (max-min)/60;
                g = min;
                b = max;
                break;
            case 5:
                r = max;
                g = min;
                b = max-(h-300) * (max-min)/60;
                break;
            case 6:
                r = max;
                //0 - 0, 60-255
                g = min+h  * (max-min)/ 60;
                b = min;
                break;
        }

        r = Math.min(255, Math.max(0, Math.round(r)));
        g = Math.min(255, Math.max(0, Math.round(g)));
        b = Math.min(255, Math.max(0, Math.round(b)));

        return {
            r: r, 
            g: g, 
            b: b
        };
    },
    _getHue: function(r, g, b, max, min) {
        var range = max - min;
        if (range==0){
            return 0;
        }

        var rr = (max - r);
        var gg = (max - g);
        var bb = (max - b);

        var h;
        switch(max){
            case r:
                h = bb - gg;
                break;
            case g:
                h = 2 *range+ rr - bb;
                break;
            case b:
                h = 4 *range+ gg - rr;
                break;
        }

        h*=-60;
        h/=range;
        h = (h<0)? h+360: h;

        return h;
    }
}


