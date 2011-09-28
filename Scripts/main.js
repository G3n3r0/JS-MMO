window.onload = function() {
    window.wid = 32;
    window.hei = 32;
    document.onselectstart = function() {return false;}; // ie
    document.onmousedown = function() {return false;}; // mozilla
    window.bulletTime = 0;
    var spd = [2,2];
    function E(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    function findIndex(arr,val) {
        for(var i in arr) {
            if(arr[i] == val) {
                return i;
            }
        }
        return false;
    }
    function touchHandler(event) {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        switch(event.type) {
            case "touchstart": type = "mousedown"; break;
            case "touchmove":  type="mousemove"; break;        
            case "touchend":   type="mouseup"; break;
            default: return;
        }
        //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //           screenX, screenY, clientX, clientY, ctrlKey, 
        //           altKey, shiftKey, metaKey, button, relatedTarget);
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, 
            first.screenX, first.screenY, 
            first.clientX, first.clientY, false, 
            false, false, false, 0/*left*/, null);
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }
    //addEventListener('touchmove', function(e) { e.preventDefault(); }, true);
    document.ontouchmove = function(e) {
        //e.preventDefault();
        //document.onmousemove(e);
        touchHandler(e);
        //return false;
    };
    //document.addEventListener("touchstart", touchHandler, true);
    //document.addEventListener("touchmove", touchHandler, true);
    //document.addEventListener("touchend", touchHandler, true);
    //document.addEventListener("touchcancel", touchHandler, true);
    document.ontouchstart = touchHandler;
    document.ontouchend = touchHandler;
    document.ontouchcancel = touchHandler;
    //if (Touch.isSupported()) { Touch.enable(window.stage); }
    window.objs = [];
    var dropbox = document.getElementById("c");
    // init event handlers
    dropbox.addEventListener("dragenter", noop, false);
    dropbox.addEventListener("dragexit", noop, false);
	dropbox.addEventListener("dragover", noop, false);
	dropbox.addEventListener("drop", drop, false);
	function noop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	function drop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var files = evt.dataTransfer.files;
		var count = files.length;
		// Only call the handler if 1 or more files was dropped.
		if (count > 0) {
			handleFiles(files);
		}
	}
	function handleFiles(files) {
		var file = files[0];
		console.log(file,file.type);
		//document.getElementById("droplabel").innerHTML = "Processing " + file.name;
        var stg = /(image.*|audio.*)/gi;
        if(file.type.match(stg)) {
		    var reader = new FileReader();
		    console.log(reader);
            reader.file = file;
		    //get error handling set up
		    reader.onerror = readError;
		    // init the reader event handlers
		    reader.onloadend = handleReaderLoadEnd;
		    // begin the read operation
		    reader.readAsDataURL(file);
        } else {
            alert("Diabeetus: Y u no let me eat "+file.type.split("\/")[0]+"?");
        }
	}
	function readError(evt) {
		alert("Teh brows3r herpd teh derp.");
		console.log(evt);
	}
	function handleReaderLoadEnd(evt) {
        evt.stopPropagation();
		//console.log(evt.target, window.tama,window.bit);
        //var oldWidth = window.bit.image.width*window.bit.scaleX;
        //var oldHeigh = window.bit.image.height*window.bit.scaleY;
        //window.bit.visible = false;
		//var img = document.getElementById("preview");
		//img.src = evt.target.result;
		//$("#droplabel").html("Drop file here...")
		//document.getElementById("droplabel").innerHTML = "Drop file here...";
        //window.bit.image.src = evt.target.result;
        //window.bit.scaleX = (119/2)/window.bit.width;
        //window.bit.scaleX = oldWidth/window.bit.image.width;
        //window.bit.scaleY = oldHeigh/window.bit.image.height;
        //console.log(window.bit)
        console.log(1,evt);
        var url = evt.target.result;
        var file = evt.target.file;
        if(file.type.match(/image.*/gi)) {
            var img = new Image();
            img.src = url;
            new Pic(64,64,img);
        } else if(file.type.match(/audio.*/gi)) {
            var aud = new Audio(url);
            //aud.src = url;
            aud.play();
            console.log("Duuuuuuuuuur!");
            /*aud.loop = "loop";
            aud.autoplay = "autoplay";
            console.log(aud);*/
            /*aud.onload = function(e) {
                console.log("Derp");
                aud.play();
            };*/
        }
	}
    function Obj(x,y,color) {
        this.x = x;
        this.y = y;
        this.g = new Graphics();
        this.g.beginFill(color||"rgba(255,0,0,0.5)");
        this.g.drawRoundRect(0,0,wid,hei,wid/2,hei/2);
        this.width = wid;
        this.height = hei;
        this.s = new Shape(this.g);
        this.s.x = this.x;
        this.s.y = this.y;
        this.s.mouseEnabled = true;
        var q = this;
        this.s.onPress = function(e) {
            console.log("Press!",e);
            var s = this;
            e.onMouseMove = function(e2) {
                //console.log(e2);
                s.x = e2.stageX-wid/2;
                s.y = e2.stageY-hei/2;
                if(s.x>canvas.width-wid) {
                    s.x = canvas.width-wid;
                } else if(s.x<0) {
                    s.x = 0;
                }
                if(s.y>canvas.height-hei) {
                    s.y = canvas.height-hei;
                } else if(s.y<0) {
                    s.y = 0;
                }
                q.x = s.x;
                q.y = s.y;
            };
        };
        var m = this;
        /*this.s.onDoubleClick = function(e) {
            //e.preventDefault();
            console.log(e,this);
            stage.removeChild(this);
            var ind = findIndex(m);
            if(ind) {
                objs.splice(ind, 1);
            }
            stage.update();
        };*/
        stage.addChild(this.s);
        window.objs.push(this);
    }
    function Pic(x,y,img) {
        console.log("Yay!");
        this.x = x;
        this.y = y;
        this.img = img;
        //console.log(this.img.src);
        var t = this;
        var q = this;
        img.onload = function(e) {
            t.bit = new Bitmap(img);
            var scx = wid*3/this.width;
            var scy = scx;
            console.log(scx,scy,this.width,this.height);
            t.bit.scaleX = scx;
            t.bit.scaleY = scy;
            t.bit.x = x;
            t.bit.y = y;
            t.width = wid*3;
            t.height = scy*t.img.height;
            t.bit.mouseEnabled = true;
            t.bit.onDoubleClick = function(e2) {
                window.open(t.img.src);
            };
            t.bit.onPress = function(e2) {
                console.log("Pressed!",e2);
                var s = this;
                e2.onMouseMove = function(e3) {
                    //console.log(e2);
                    s.x = e3.stageX-t.width/2;
                    s.y = e3.stageY-t.height/2;
                    if(s.x>canvas.width-t.width) {
                        s.x = canvas.width-t.width;
                    } else if(s.x<0) {
                        s.x = 0;
                    }
                    if(s.y>canvas.height-t.height) {
                        s.y = canvas.height-t.height;
                    } else if(s.y<0) {
                        s.y = 0;
                    }
                    q.x = s.x;
                    q.y = s.y;
                };
            };
            stage.addChild(t.bit);
            stage.addChild(player.bs);
            t.s = t.bit;
            //objs.push(t);
            console.log(t.bit);
        };
    }
    function Link(x,y,col,link) {
        this.x = x;
        this.y = y;
        this.col = col||"blue";
        if(!link.match(/^(http|gopher|mailto)/gi)) {
            link = "http://"+link;
        }
        this.link = link;
        //console.log(x,y,col,link,this.link);
        this.obj = new Obj(x,y,col||"blue");
        this.obj.link = link;
        this.obj.s.link = link;
        this.obj.s.onDoubleClick = function(e) {
            //alert("Boom.");
            //console.log(e,this.link);
            //window.open(this.link,"_BLANK","width=640, height=480");
            window.open(this.link);
        };
        this.obj.s.onMouseOver = function(e) {
            canvas.title = this.link;
        };
        this.obj.s.onMouseOut = function(e) {
            canvas.title = null;
        };
        /*this.obj.img = new Image();
        var obj = this.obj;
        this.obj.img.onload = function(e) {
            obj.i = new Bitmap(this);
            obj.i.x = obj.x;
            obj.i.y = obj.y;
            //obj.i.mouseEnabled = true;
            //obj.i.onClick = alert;
            //obj.i.onDoubleClick = obj.s.onDoubleClick;
            stage.addChild(obj.i);
            stage.addChild(obj.s);
        };
        this.obj.img.src = "http://g.etfv.co/"+link+"?defaulticon=http://www.w3.org/html/logo/downloads/HTML5_Badge_24.png";
        //this.obj.img.src = "./Graphics/water_tiles.svg";*/
    }
    function collide(a,arr) {
        for(var i=0;i<arr.length;i++) {
            if(E(arr[i], player)) {
                return true;
            }
        }
        return false;
    }
    function Player(x,y,img) {
        this.spd = spd;
        this.img = img;
        this.x = x;
        this.y = y;
        /*this.fdata = {
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4
        };*/
        this.fdata = {
            f1: 0,
            f2: 1,
            f3: 2,
            f4: 3,
            b1: 4,
            b2: 5,
            b3: 6,
            b4: 7,
            w1: 8,
            w2: 9,
            w3: 10,
            w4: 11,
            e1: 12,
            e2: 13,
            e3: 14,
            e4: 15
        };
        this.sSheet = new SpriteSheet(this.img, 22, 26,this.fdata);
        this.width = 22;
        this.height = 26;
        this.bs = new BitmapSequence(this.sSheet);
        this.bs.y = this.y;
        this.bs.x = this.x;
        this.bs.gotoAndStop("f1");
        stage.addChildAt(this.bs,2);
        stage.update();
        this.step = 1;
        this.update = function(up,down,left,right,space,dir) {
            //var a = JSON.parse(JSON.stringify(this));
            if(up && this.y>0) {
                //a.y -= this.spd[1];
                //console.log(co/llide(a,objs));
                this.y -= this.spd[1];
            }
            if(down && this.y<canvas.height-26) {
                this.y += this.spd[1];
            }
            if(left && this.x>0) {
                this.x -= this.spd[0];
            }
            if(right && this.x<canvas.width-22) {
                this.x += this.spd[0];
            }
            if(!left && !right && !up && !down) {
                this.step = 2;
            }
            /*
                new Bullet(this.x+34,this.y+18);*/
            /*if(space && bulletTime<=0) {
                bulletTime = 12;
            }
            if(bulletTime>0) {
                bulletTime -= 1;
            }*/
            //this.bs.gotoAndStop("2");
            //this.step += 0.25;
            //console.log(this.step);
            this.bs.gotoAndStop(dir+Math.floor(this.step));
            if(dir=="f" || dir=="b") {
                if(this.step>=4) {
                    //console.log("Bam");
                    this.step = 1;
                }
            } else {
                if(this.step>=3) {
                    //console.log("Bam");
                    this.step = 1;
                }
            }
            
            if(collide(null,objs)) {
                for(var i=0;i<objs.length;i++) {
                    if(E(objs[i], this)) {
                        console.log(i,objs[i]);
                        if(objs[i].x>this.x) {
                            this.x -= this.spd[0];
                        } else if(objs[i].x<this.x) {
                            this.x += this.spd[0];
                        }
                        if(objs[i].y>this.y) {
                            this.y -= this.spd[1];
                        } else if(objs[i].y<this.y) {
                            this.y += this.spd[1];
                        }
                        //this.x += this.x-objs[i].x;
                        //this.x -= 3;
                    }
                }
            }
            
            this.bs.x = this.x;
            this.bs.y = this.y;
        };
    }
    window.tick = function() {
        player.update(u,d,l,r,s,sd);
        for(var i in objs) {
            //console.log(trash,objs[i],E(trash,objs[i]));
            if(E(trash,objs[i])) {
                //var w = confirm("Rlly? U srs?");
                //if(w) {
                console.log("Derp, a durr, a feeemale durr. Rrrrr a spot of goldurrn sun!");
                stage.removeChild(objs[i].s);
                objs.splice(i,1);
                //} else {
                //    objs[i].x = canvas.width-25;
                //    objs[i].s.x = objs[i].x;
                //}
            }
        }
        stage.update();
    };
    canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    stage.enableMouseOver(10);
    var u,d,l,r,s = false;
    var sd = "f";
    /*document.ondblclick = function(e) {
        //alert("Durr!");
        e.preventDefault();
    };*/
    //$("*").on("keydown", function(e) {
    document.onkeydown = function(e) {
        //e.preventDefault();
        //e.stopPropagation();
        //console.log(e.which);
        if(e.which===38 || e.which===87 || e.which===40 || e.which===83 || e.which===37 || e.which===65 || e.which===39 || e.which===68) {
            player.step += 0.125;
        }
        if(e.which===38 || e.which===87) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            u = true;
            sd = "b";
            //player.step += 0.25;
        } else if(e.which===40 || e.which===83) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            d = true;
            sd = "f";
            //player.step += 0.25;
        } else if(e.which===37 || e.which===65) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            l = true;
            sd = "w";
            //player.step += 0.25;
        } else if(e.which===39 || e.which===68) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            r = true;
            sd = "e";
            //player.step += 0.25;
        } else if(e.which===32 || e.which===90) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            s = true;
            //player.step += 0.25;
        }
    //});
    };
    //$("*").on("keyup", function(e) {
    document.onkeyup = function(e) {
        //console.log(e);
        if(e.which===38 || e.which===87) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            u = false;
            
        } else if(e.which===40 || e.which===83) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            d = false;
        } else if(e.which===37 || e.which===65) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            l = false;
        } else if(e.which===39 || e.which===68) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            r = false;
        } else if(e.which===32 || e.which===90) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            s = false;
        }
    //});
    };
    function imgLoaded(e) {
        //console.log("So I herd u like Mudkips.");
        //console.log(window.player);
        //player.bit.scaleX = player.bit.scaleY = 0.5;
        //stage.addChild(player.image);
        player.bit = new Bitmap(player.image);
        player.bit.x = player.x;
        player.bit.y = player.y;
        stage.addChild(player.bit);
        stage.update();
        Ticker.setFPS(24);
        Ticker.addListener(window);
    }
    function getXY(e,gCanvasElement) {
        var x;
        var y;
        if (e.pageX || e.pageY) { 
            x = e.pageX;
            y = e.pageY;
        } else { 
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        }
        x -= gCanvasElement.offsetLeft;
        y -= gCanvasElement.offsetTop;
        return [x,y];
    }
    var neededKills = 10;
    var killCount = 0;
    function init(g) {
        pImg = new Image();
        pImg.onload = imgLoaded;
        pImg.onerror = function(e,a) {
            console.log(e,a);
        };
        /*if(g) {
            pImg.src = "./Graphics/mudkipSprites3.png";
        } else {
            pImg.src = "./Graphics/nyan_cat4.png";
        }*/
        //pImg.src = "Graphics/mudkipSprites3.png";
        pImg.src = "Graphics/charSprites1.png";
        window.player = new Player(32,32,pImg);
        //console.log(player);
        /*window.eImg = new Image();
        eImg.onload = enemLoaded;
        eImg.src = "./Graphics/enemSprite1.png";*/
        
        /*window.sco = new Text(neededKills-killCount, "18px Arial", "#FFF");
        sco.x = canvas.width-sco.getMeasuredWidth()-10;
        sco.y = sco.getMeasuredLineHeight();
        stage.addChild(sco);*/
        var h = new Graphics();
        h.beginFill("green");
        h.drawRoundRect(0,0,wid,hei,wid/2,hei/2);
        var block = new Shape(h);
        block.x = canvas.width-wid;
        block.y = 0;
        block.mouseEnabled = true;
        block.onPress = function(e) {
            /*e.onMouseUp = function(e2) {
                canvas.onclick = addObj;
            };*/
            //addLink("http://www.google.com/");
            addObj("purple");
        };
        
        var f = new Graphics();
        f.beginFill("blue");
        f.drawRoundRect(0,0,wid,hei,wid/2,hei/2);
        var link = new Shape(f);
        link.x = canvas.width-wid*2-2;
        link.y = 0;
        link.mouseEnabled = true;
        link.onPress = function(e) {
            /*e.onMouseUp = function(e2) {
                canvas.onclick = addObj;
            };*/
            addLink(prompt("Enter a URL!","http://"),"pink");
            //addObj("purple");
        };
        
        var m = new Graphics();
        m.beginFill("red");
        m.drawRoundRect(0,0,wid,hei,wid/2,hei/2);
        window.trash = new Shape(m);
        trash.x = canvas.width-wid;
        trash.y = canvas.height-hei;
        trash.width = wid;
        trash.height = hei;
        trash.mouseEnabled = true;
        
        stage.addChild(block);
        stage.addChild(link);
        stage.addChild(trash);
        stage.update();
    }
    init();
    function addObj(col) {
    //stage.onClick = function(e) {
        //var s = getXY(e,this);
        //var s = [e.stageX,e.stageY];
        var s = [canvas.width/2,canvas.height/2];
        new Obj(s[0]-12,s[1]-12,col);
        stage.addChild(player.bs);
        canvas.onclick = null;
    }
    function addLink(link,col) {
        var s = [canvas.width/2,canvas.height/2];
        new Link(s[0]-12,s[1]-12,col,link);
        stage.addChild(player.bs);
        canvas.onclick = null;
    }
};