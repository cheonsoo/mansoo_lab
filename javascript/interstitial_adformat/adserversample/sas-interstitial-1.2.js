var sas = sas || {};
sas.SmartInterstitial = sas.SmartInterstitial || {};
sas.SmartInterstitial = {
    c: SmartInterstitialConf,
    d: window.document,
    w: window,
    isBackground: (0 == SmartInterstitialConf.opacity) ? false : true,
    closed: false,
    listenersAdded: false,
    addElement: function(e, d, a) {
        var b = this.d.createElement(e);
        for (var c in a) {
            b.setAttribute(c, a[c])
        }
        d.appendChild(b);
        return b
    },
    close: function() {
        this.closed = true;
        sas.SmartInterstitial.container.parentNode.removeChild(sas.SmartInterstitial.container);
        sas.SmartInterstitial.enableScroll();
        try {
            sas.SmartInterstitial.closeButton.parentNode.removeChild(sas.SmartInterstitial.closeButton)
        } catch (a) {}
    },
    hasFlash: function() {
        try {
            if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                return true
            }
        } catch (a) {
            if (undefined != navigator.mimeTypes["application/x-shockwave-flash"] && (navigator.mimeTypes["application/x-shockwave-flash"]).enabledPlugin) {
                return true
            }
        }
        return false
    },
    setHeight: function() {
        var a = sas.SmartInterstitial.d;
        sas.SmartInterstitial.bg.style.height = Math.max(a.body.scrollHeight, a.body.offsetHeight, a.documentElement.clientHeight, a.documentElement.scrollHeight, a.documentElement.offsetHeight) + "px"
    },
    flash: function(d, c, f, a) {
        var e = "";
        for (var b in d) {
            e += '<param name="' + b + '" value="' + d[b] + '" />'
        }
        return '<object type="application/x-shockwave-flash" name="' + c + '" id="' + c + '" width="' + f + '" height="' + a + '" data="' + d.movie + '">' + e + "</object>"
    },
    addImage: function(b) {
        var a = "";
        if (b.url != "") {
            if (b.oryginalClickUrl != "") {
                a += '<a href="' + b.clickUrl + '" target="' + ((b.clickTarget == "_blank") ? "_blank" : "_self") + '" >'
            }
            a += '<img id="img_' + b.id + '" src="' + b.url + '" width="' + b.width + '" height="' + b.height + '" alt="" />';
            if (b.oryginalClickUrl != "") {
                a += "</a>"
            }
        }
        return a
    },
    createMultiBrowserCss: function(a) {
        return "-moz-" + a + ";-webkit-" + a + ";-ms-" + a + ";-o-" + a + ";" + a + ";"
    },
    calculateCloseButtonSize: function() {
        var c;
        var b = 0.03;
        var a = 30;
        c = Math.floor(screen.width * b) < a ? a : Math.floor(screen.width * b);
        return c
    },
    addCss: function() {
        var c = this.d.createElement("style");
        c.type = "text/css";
        if (!this.isFlash && (this.c.creative.type == 0 || this.c.creative.type == 2) && !this.c.fullscreen) {
            this.c.creative.width = this.c.creative.backup.width;
            this.c.creative.height = this.c.creative.backup.height
        }
        var a = "";
        if ("center" == this.c.xPosition) {
            a += "margin-left:auto; margin-right:auto;"
        }
        var e = this.c.yOffset;
        if ("bottom" == this.c.yPosition) {
            a += "margin-top:-" + (this.c.creative.height - this.c.yOffset) + "px;"
        } else {
            if ("middle" == this.c.yPosition) {
                a += "margin-top:" + (e - this.c.creative.height / 2) + "px;"
            }
        }
        switch (this.c.animation) {
            case "slide from top":
                a += "top:-" + screen.height + "px;";
                break;
            case "slide from bottom":
                a += "top:200%;";
                break;
            case "slide from left":
                if ("center" == this.c.xPosition || "left" == this.c.xPosition) {
                    a += "left:-" + screen.width + "px;"
                } else {
                    a += "right:" + screen.width + "px;"
                }
                break;
            case "slide from right":
                if ("center" == this.c.xPosition || "right" == this.c.xPosition) {
                    a += "right:-" + screen.width + "px;"
                } else {
                    a += "left:" + screen.width + "px;"
                }
                break;
            case "fade":
                a += "opacity:0;";
                break
        }
        if (this.c.animation == "horizontal flip") {
            var g = this.createMultiBrowserCss("transform:rotateX(90deg)") + this.createMultiBrowserCss("transform-style:preserve-3d")
        } else {
            if (this.c.animation == "vertical flip") {
                var g = this.createMultiBrowserCss("transform:rotateY(90deg)") + this.createMultiBrowserCss("transform-style:preserve-3d")
            } else {
                var g = ""
            }
        }
        var h = this.c.animation != "none" ? this.createMultiBrowserCss("transition:all " + this.c.animationSpeed + "s ease") : "";
        var d = this.c.floating ? "fixed" : "absolute";
        var b = this.calculateCloseButtonSize();
        var f = ["#sas_" + this.c.id + "{width:100%; z-index:" + this.c.zindex + ";display:block;}", "#sas-interstitial{display:none;position:" + d + "; " + a + (this.c.fullscreen ? "width:" + this.c.creative.width + ";height:" + this.c.creative.height : "width:" + this.c.creative.width + "px") + ";" + h + g + " z-index:" + this.c.zindex + ";}", "#sas-interstitial-bg{visibility:hidden; position:absolute; top:" + this.c.maskOffset + "px; left:0; width:100%; height:200%; background:#" + this.c.background + "; opacity:" + (this.c.opacity / 100) + ";filter:alpha(opacity=" + this.c.opacity + ");" + h + g + " z-index:" + (this.c.zindex - 2) + ";}", "#sas-interstitial-logo{position:absolute;" + (this.c.fullscreen ? "top:0" : "bottom:" + (this.c.creative.height + 5) + "px") + "; left:5px;z-index:" + (this.c.zindex - 1) + "}", ".lurcc_ads{display:none}", "#sas-interstitial img, #sas-interstitial a{border:0}", "#img_" + this.c.creative.id + "{" + (this.c.fullscreen ? "width:" + this.c.creative.width + ";height:" + this.c.creative.height : "width:" + this.c.creative.width + "px;height:" + this.c.creative.height + "px") + ";}", "#sas_counter_" + this.c.insertionId + "{z-index:" + (this.c.zindex + 1) + ";width:" + b + "px;height:" + b + "px;background:#000;filter:alpha(opacity=80);-moz-opacity:.8;opacity:.8;color:#ffffff;font:25px Verdana,sans-serif;display:inline-block;text-align:center;position:relative;line-height:" + b + "px;vertical-align:middle;" + (this.c.cText != "" ? "margin-left:10px;" : "") + "}", "#sas_closeButton_" + this.c.insertionId + "{position:" + (this.c.cPositionProperty == "on-the-mask" ? "fixed" : "absolute") + ";z-index:" + (this.c.zindex + 1) + ";color:#" + this.c.cColor + ";font-family:Arial,sans-serif;font-size:" + this.c.cSize + "px;cursor:pointer;display:block;}", "#sas_defaultCloseButton_" + this.c.insertionId + "{z-index:" + (this.c.zindex + 1) + ";width:" + b + "px;height:" + b + "px;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-user-select:none;cursor:pointer;" + (this.c.cText != "" ? "margin-left:10px;" : "") + "}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-left.sas_closeButton_inner-creative{top:5px;left:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-right.sas_closeButton_inner-creative{top:5px;right:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-center.sas_closeButton_inner-creative{top:5px;width:100%;text-align:center;}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-left.sas_closeButton_on-the-mask{top:" + (this.c.maskOffset + 5) + "px;left:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-right.sas_closeButton_on-the-mask{top:" + (this.c.maskOffset + 5) + "px;right:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-center.sas_closeButton_on-the-mask{top:" + (this.c.maskOffset + 5) + "px;width:100%;text-align:center;}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-left.sas_closeButton_inner-creative, #sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-left.sas_closeButton_on-the-mask{bottom:5px;left:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-right.sas_closeButton_inner-creative, #sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-right.sas_closeButton_on-the-mask{bottom:5px;right:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-center.sas_closeButton_inner-creative, #sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-center.sas_closeButton_on-the-mask{bottom:5px;width:100%;text-align:center;}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-left.sas_closeButton_outer-creative{bottom:" + (this.c.creative.height + 5) + "px;left:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-right.sas_closeButton_outer-creative{bottom:" + (this.c.creative.height + 5) + "px;right:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_top-center.sas_closeButton_outer-creative{bottom:" + (this.c.creative.height + 5) + "px;width:100%;text-align:center;}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-left.sas_closeButton_outer-creative{top:" + (this.c.creative.height + 5) + "px;left:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-right.sas_closeButton_outer-creative{top:" + (this.c.creative.height + 5) + "px;right:5px}", "#sas_closeButton_" + this.c.insertionId + ".sas_closeButton_bottom-center.sas_closeButton_outer-creative{top:" + (this.c.creative.height + 5) + "px;width:100%;text-align:center;}", "@media screen and (max-width:600px) { .tmpFoo {} }"].join("\r\n");
        if (c.styleSheet) {
            c.styleSheet.cssText = f
        } else {
            c.appendChild(this.d.createTextNode(f))
        }
        this.d.getElementsByTagName("head")[0].appendChild(c)
    },
    addMask: function() {
        if (this.isBackground) {
            this.bg = this.addElement("div", sas.SmartInterstitial.container, {
                id: "sas-interstitial-bg"
            });
            this.w.setTimeout(function() {
                sas.SmartInterstitial.bg.style.visibility = "visible"
            }, this.c.delay * 1000);
            if (("undefined" != typeof this.w.sas_ajax && this.w.sas_ajax) || this.listenersAdded == true) {
                this.setHeight()
            } else {
                if (this.d.addEventListener) {
                    this.d.addEventListener("DOMContentLoaded", this.setHeight, false)
                } else {
                    if (this.d.attachEvent) {
                        this.w.attachEvent("onload", this.setHeight)
                    }
                }
            }
        }
    },
    renderAd: function() {
        var a = this.ad = this.addElement("div", this.container, {
            id: "sas-interstitial"
        });
        if (0 == this.c.creative.type) {
            var c = this.addElement("iframe", a, {
                src: "about:blank",
                width: this.c.creative.width,
                height: this.c.creative.height,
                frameBorder: "0",
                scrolling: "no",
                marginheight: "0",
                marginwidth: "0"
            });
            var b = c.contentWindow.document;
            b.open("text/html", "replace");
            b.write('<!DOCTYPE html><head></head><body style="padding:0;margin:0">' + this.c.creative.agencyCode + "</body></html>");
            b.close()
        } else {
            if (3 == this.c.creative.type) {
                a.innerHTML = this.isFlash ? ('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="' + this.c.creative.width + '" height="' + this.c.creative.height + '"><param name="allowScriptAccess" value="always"><param name="movie" value="http://www.smartadserver.com/a/video/smart_v1_nobar.swf?file=' + this.c.creative.url + "&asize=true&aplay=true&arew=false&mute=true&controlBtn=true&replayV=true&boutonColor=gris&boutonAlpha=100&soundonrollover=false&color=n&poistion=h&videostop=0&tpspause=0&target=_blank&clicktag=" + this.c.creative.clickUrl + "&clickTag=" + this.c.creative.clickUrl + "&clickTAG=" + this.c.creative.clickUrl + '"><param name="quality" value="high"><param name="wmode" value="opaque"><embed src="http://www.smartadserver.com/a/video/smart_v1_nobar.swf?file=' + this.c.creative.url + "&asize=true&aplay=true&arew=false&mute=true&controlBtn=true&replayV=true&boutonColor=gris&boutonAlpha=100&soundonrollover=false&color=n&poistion=h&videostop=0&tpspause=0&target=_blank&clicktag=" + this.c.creative.clickUrl + "&clickTag=" + this.c.creative.clickUrl + "&clickTAG=" + this.c.creative.clickUrl + '" quality="high" wmode="opaque" width="' + this.c.creative.width + '" height="' + this.c.creative.height + '" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></object>') : this.addImage(this.c.creative.backup)
            } else {
                if (2 == this.c.creative.type) {
                    if (!this.isFlash) {
                        a.innerHTML = this.addImage(this.c.creative.backup)
                    } else {
                        a.innerHTML = this.flash({
                            movie: this.c.creative.url,
                            wMode: this.c.creative.wMode,
                            quality: "high",
                            allowScriptAccess: "always",
                            allowFullScreen: "true",
                            flashVars: this.c.creative.flashVars
                        }, "sas_flash_" + this.c.id, this.c.creative.width, this.c.creative.height)
                    }
                } else {
                    if (4 == this.c.creative.type) {
                        var c = this.addElement("iframe", a, {
                            src: this.c.creative.url,
                            width: this.c.creative.width,
                            height: this.c.creative.height,
                            frameBorder: "0",
                            scrolling: "no",
                            marginheight: "0",
                            marginwidth: "0"
                        })
                    } else {
                        a.innerHTML = this.addImage(this.c.creative)
                    }
                }
            }
        }
        this.w.setTimeout(function() {
            sas.SmartInterstitial.ad.style.display = "block";
            sas.SmartInterstitial.showAd();
            sas.SmartInterstitial.addCloseButton();
            if (sas.SmartInterstitial.c.scroll) {
                sas.SmartInterstitial.disableScroll()
            }
        }, this.c.delay * 1000)
    },
    disableScroll: function() {
        this.body.style.overflow = "hidden";
        this.body.parentNode.style.overflow = "hidden";
        this.d.ontouchmove = function(a) {
            a.preventDefault()
        }
    },
    enableScroll: function() {
        this.body.style.overflow = "";
        this.body.parentNode.style.overflow = "";
        this.d.ontouchmove = function(a) {
            return true
        }
    },
    addCounter: function() {
        var a = setInterval(function() {
            sas.SmartInterstitial.countDown()
        }, 800);
        this.counter.innerHTML = this.c.cCounterTime;
        sas.SmartInterstitial.counter.style.display = "inline-block";
        sas.SmartInterstitial.intervalId = a
    },
    countDown: function() {
        if (sas.SmartInterstitial.c.cCounterTime > -1) {
            this.counter.innerHTML = sas.SmartInterstitial.c.cCounterTime--
        } else {
            clearInterval(sas.SmartInterstitial.intervalId);
            sas.SmartInterstitial.counter.style.display = "none";
            this.closeButtonWrapper.style.display = "inline-block";
            this.closeButton.onclick = function() {
                sas.SmartInterstitial.close()
            }
        }
    },
    addCloseButton: function() {
        var a = this.c.cPositionProperty == "on-the-mask" ? this.d.body : this.ad;
        this.closeButton = this.addElement("div", a, {
            id: "sas_closeButton_" + this.c.insertionId,
            "class": "sas_closeButton_" + this.c.cPosition + " sas_closeButton_" + this.c.cPositionProperty
        });
        this.closeButtonWrapper = this.addElement("span", this.closeButton, {
            id: "sas_closeButonWrapper"
        });
        if (this.c.cText != "") {
            this.labelClose = this.addElement("span", this.closeButtonWrapper, {
                id: "sas_labelClose_" + this.c.insertionId
            });
            this.labelClose.innerHTML = this.c.cText
        }
        if (this.c.cDefaultButton) {
            this.closeImg = this.addElement("img", this.closeButtonWrapper, {
                id: "sas_defaultCloseButton_" + this.c.insertionId,
                src: this.c.imgPathDirectory + "close_54x54.png"
            })
        }
        if (sas.SmartInterstitial.c.cCounterTime != 0 && (this.c.cDefaultButton || this.c.cText != "")) {
            this.counter = this.addElement("div", this.closeButton, {
                id: "sas_counter_" + this.c.insertionId
            });
            sas.SmartInterstitial.addCounter();
            this.closeButtonWrapper.style.display = "none"
        } else {
            this.closeButton.onclick = function() {
                sas.SmartInterstitial.close()
            }
        }
    },
    showAd: function() {
        try {
            this.w.getComputedStyle(this.ad).top;
            this.w.getComputedStyle(this.ad).right;
            this.w.getComputedStyle(this.ad).left;
            this.w.getComputedStyle(this.ad).opacity
        } catch (a) {}
        if ("top" == this.c.yPosition) {
            this.ad.style.top = this.c.yOffset + "px"
        } else {
            if ("bottom" == this.c.yPosition) {
                this.ad.style.top = "100%"
            } else {
                this.ad.style.top = "50%"
            }
        }
        if ("right" == this.c.xPosition) {
            if (this.c.xOffset < 0) {
                this.ad.style.right = Math.abs(this.c.xOffset) + "px"
            } else {
                this.ad.style.right = "-" + this.c.xOffset + "px"
            }
        } else {
            if ("left" == this.c.xPosition) {
                this.ad.style.left = this.c.xOffset + "px"
            } else {
                this.ad.style.left = this.c.xOffset * 2 + "px";
                this.ad.style.right = 0
            }
        }
        if (this.c.animation == "fade") {
            this.ad.style.opacity = 1
        }
        if (this.c.animation == "horizontal flip") {
            this.ad.style.transform = "rotateX(0deg)";
            this.bg.style.transform = "rotateX(0deg)"
        } else {
            if (this.c.animation == "vertical flip") {
                this.ad.style.transform = "rotateY(0deg)";
                this.bg.style.transform = "rotateY(0deg)"
            }
        }
    },
    addLogo: function() {
        if (this.c.logoUrl) {
            var b = '<img src="' + this.c.logoUrl + '" border="0">';
            if (this.c.logoClick) {
                b = '<a href="' + this.c.logoClick + '">' + b + "</a>"
            }
            var a = this.addElement("div", this.ad, {
                id: "sas-interstitial-logo"
            });
            a.innerHTML = b
        }
    },
    disableZoomFunc: function() {
        try {
            var b = this.d.createElement("meta");
            b.setAttribute("name", "viewport");
            b.setAttribute("content", "width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no");
            this.d.head.appendChild(b)
        } catch (a) {}
    },
    prepareParams: function() {
        if (this.c.creative2.width == 0) {
            this.c.creative = this.c.creative1
        } else {
            if ("undefined" != typeof this.w.matchMedia) {
                this.mql = this.w.matchMedia("(orientation: portrait)");
                if (this.mql.matches) {
                    this.c.creative = this.c.creative1
                } else {
                    this.c.creative = this.c.creative2
                }
            } else {
                if ("onorientationchange" in this.w) {
                    if (this.w.orientation === 90 || this.w.orientation === -90) {
                        this.c.creative = this.c.creative2
                    } else {
                        this.c.creative = this.c.creative1
                    }
                } else {
                    this.c.creative = this.c.creative2
                }
            }
        }
    },
    addListeners: function() {
        this.listenersAdded = true;
        if (this.c.creative2.width != 0) {
            if ("undefined" != typeof this.w.matchMedia) {
                if (this.mql) {
                    this.mql.addListener(function(a) {
                        if (sas.SmartInterstitial.closed == false) {
                            sas.SmartInterstitial.startAgain()
                        }
                    })
                }
            } else {
                if ("onorientationchange" in this.w) {
                    this.w.addEventListener("orientationchange", function() {
                        if (sas.SmartInterstitial.closed == false) {
                            var a = setTimeout(function() {
                                sas.SmartInterstitial.startAgain()
                            }, 100)
                        }
                    }, false)
                }
            }
        }
    },
    startAgain: function() {
        this.close();
        this.closed = false;
        this.c.cCounterTime = 0;
        this.init()
    },
    init: function() {
        if (typeof(inDapIF) != "undefined" && inDapIF) {
            this.d = window.parent.document;
            this.w = window.parent
        } else {
            if ("undefined" != typeof sas_in_iframe_popout && sas_in_iframe_popout) {
                this.d = sas_topmost_iframe().ownerDocument;
                this.w = top.window
            }
        }
        this.prepareParams();
        this.isFlash = this.hasFlash();
        if (this.c.fullscreen) {
            this.c.creative.width = this.c.creative.backup.width = "100%";
            this.c.creative.height = this.c.creative.backup.height = "100%";
            this.c.yOffset = 0;
            this.c.xPosition = "left";
            this.c.yPosition = "top"
        }
        this.container = this.d.getElementById("sas_" + this.c.id);
        this.body = this.d.getElementsByTagName("body")[0];
        this.addCss();
        if (!this.container) {
            this.container = this.addElement("div", this.body, {
                id: "sas_" + this.c.id
            })
        }
        this.body.insertBefore(this.container, this.body.firstChild);
        this.addMask();
        this.renderAd();
        this.addLogo();
        if (this.c.bgUrl) {
            this.body.style.backgroundImage = "url(" + this.c.bgUrl + ")";
            this.body.style.backgroundPosition = "center center"
        }
        if (this.c.time && this.listenersAdded == false) {
            setTimeout(function() {
                if (sas.SmartInterstitial.closed == false) {
                    sas.SmartInterstitial.close()
                }
            }, (this.c.time * 1000 + this.c.delay * 1000))
        }
        if (this.c.disableZoom) {
            this.disableZoomFunc()
        }
        this.w.pub_ist_hd = this.close;
        if (this.listenersAdded == false) {
            this.addListeners()
        }
    }
};
sas.SmartInterstitial.init();
