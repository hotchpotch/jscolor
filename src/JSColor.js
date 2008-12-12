
JSColor = function() {
    return function() {
      this.initialize.apply(this, arguments);
    };
}

JSColor.createRGB = function(red, green, blue) {
    var col = new JSColor();
    col.setRGB(red, green, blue);
    return col;
}
    
JSColor.createHSB = function(hue, saturation, brightness) {
   var col = new JSColor();
   col.setHSB(hue, saturation, brightness);
   return col;
}
    
JSColor.createGray = function(gray) {
    var col = new JSColor();
    col.setRGB(gray, gray, gray);
    return col;
}
    
JSColor.prototype = function() {
    initialize: function(color) {
        this._value = Math.max(0, parseInt(color || 0));
        
        this._red = this._green = this._blue = this._hue = this._saturation = this._brightness = 0;
        this._hsbUpdate = this._rgbUpdate = true;
        this._holdHue = this._holdSaturation = false;
    },
        
    /**
     * Set color with red, gree, bule.
     * 
     * @param red 0-255;
     * @param green 0-255;
     * @param blue 0-255;
     */
    setRGB: function(r, g, b) {
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        
        this.setValue((r << 16) | (g << 8 ) | b);
    },
    
    
    /**
     * 色相(hue), 彩度(saturation), 明度(brightnessChanges)から色を定義します。
     * 
     * @param hue 0-360;
     * @param saturation 0-100;
     * @param brightness 0-100;
     */
    setHSB: function(hue, saturation, brightness) {
        var rgbInfo = JSColor.Util.HSB2RGB(hue,saturation,brightness);
        this.setRGB(rgbInfo.r, rgbInfo.g, rgbInfo.b);
    },
    
    
    /**
     * Returns copy of instance.
     * 
     * @return The copy of the Color instance;
     */
    clone: function() {
        return new JSColor(this.getValue());
    },
    
    
    /**
     * Hex color value 0xRRGGBB;
     */
    getValue: function() {
        return this._value;
    },
    
    setValue: function(color) {
        if(_value == color) return;
        this._value = color;
        this._hsbUpdate = true;
        this._rgbUpdate = true;
        if (typeof this.callbackChangeValue == 'function')
            this.callbackChangeValue();
    },
    
    
    /**
     * Returns 32bit color, 0xAARRGGBB;
     * @returns int;
     */
    getValue32: function(alpha) {
        alpha = parseInt(alpha*255);
        var val = (alpha<<24) | value;
        return val;
    },
    
    
    
    /*
    ---------------------------------------------
    RGB getter / setter;
    ---------------------------------------------
    */
    
    getRed: function() { 
        this.updateRGB();
        return this._red;
    },
    
    getGreen: function() {
        this.updateRGB();
        return this._green;
    },
    
    getBlue: function() {
        this.updateRGB();
        return this._blue;
    },
    
    setRed: function(val) {
        if (val!=this._red)
            this.setRGB(this._val,this.getGreen(),this.getBlue());
    },
    
    setGreen: function(val) {
        if (val!=this._green)
            this.setRGB(this.getRed(),val,this.getBlue());
    },
    
    setBlue: function(val) {
        if (val!=this.blue)
            this.setRGB(this.getRed(),this.getGreen(),val);
    },
    
    
    /**
     * Returns Sring expression of this color. "RRGGBB"
     * @returns String;
     */
    toStringRGB: function():String {
        var hexTable = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
        return [
          hexTable[Math.floor(this.getRed() / 16)],
          hexTable[this._red%16],
          hexTable[Math.floor(this.getGreen() / 16)],
          hexTable[this._green%16],
          hexTable[Math.floor(this.getBlue() / 16)],
          hexTable[this._blue%16]
        ].join('');
    },
    
    toString: function() {
        return "0x" + this.toStringRGB();
    }
    
    
    /*
    ------------------------------------------------
    HSB getter / setter;
    ------------------------------------------------
    */
    
    getHue: function() {
        this.updateHSB();
        return this._hue;
    },
    
    getSaturation: function() {
        this.updateHSB();
        return this._saturation;
    },
    
    getBrightness: function() {
        this.updateHSB();
        return this._brightness;
    },
    
    setHue: function(val) {
        var rgbInfo = JSColor.Util.HSB2RGB(val,saturation,brightness);
        this.setRGB(rgbInfo.r, rgbInfo.g, rgbInfo.b);
        this._hue = val;
    },
    
    setSaturation: function(val) {
        var rgbInfo = JSColor.Util.HSB2RGB(hue,val,brightness);
        this.setRGB(rgbInfo.r, rgbInfo.g, rgbInfo.b);
        this._saturation = val;
    },
    
    setBrightness: function(val) {
        //明度が０の場合は、hue,saturationの値を保持する
        var rgbInfo = JSColor.Util.HSB2RGB(hue,saturation,val);
        this.setRGB(rgbInfo.r, rgbInfo.g, rgbInfo.b);
        this._brightness = val;
    },
    
    /*
    ----------------------------------------------------------------
    gray scale controll;
    ----------------------------------------------------------------
    */
    
    /**
     * 0-255の値でグレーの色を定義します。
     * 
     * @param value 0-255 gray scale.
     */
    setGray: function(value) {
        this.setRGB(value,value,value);
    },
    
    
    /**
     * 現在の色をグレースケールに変換します。
     */
    toGray: function() {
        //var rw = 0.3086;
        //var gw = 0.6094;
        //var bw = 0.0820;
        //var mat:ColorMatrixFilter = new ColorMatrixFilter([rw,gw,bw,0,0, rw,gw,bw,0,0, rw,gw,bw,0,0, 0,0,0,1,0]);
        //applyColorMatrix(mat);
    },
    
    
    
    
    /*
    ------------------------------------------------
    Internal Use Only;
    ------------------------------------------------
    */
    
    updateRGB: function() {
        if(!this._rgbUpdate) return;
        this._red= this._value>>16 & 0xff;
        this._green= this._value>> 8 & 0xff;
        this._blue= this._value& 0xff;
        this._rgbUpdate = false;
    },
    
    updateHSB: function() {
        if(!this._hsbUpdate) return;
        
        var hsb = JSColor.Util.RGB2HSB(this.getRed,this.getGreen(),this.getBlue());
        
        //彩度０、明度が０の場合は昔の情報を保持
        if(hsb.b != 0 && hsb.s != 0 )
            this._hue = hsb.h;
        
        //明度が０の場合は昔の値を保持
        if(hsb.b != 0)
            this._saturation = hsb.s;
        
        this._brightness = hsb.b;
        this._hsbUpdate = false;
    }
}

