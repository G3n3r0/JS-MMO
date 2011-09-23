window.onload = function() {
    window.bulletTime = 0;
    var spd = [2,2];
    function Obj(x,y,s) {
        this.x = x;
        this.y = y;
        this.w = s;
        this.h = s;
    }
    function Player(x,y,img) {
        this.spd = spd;
        this.img = img;
        this.x = x;
        this.y = y;
        this.fdata = {
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4
        };
        this.sSheet = new SpriteSheet(this.img, 37, 36,this.fdata);
        this.bs = new BitmapSequence(this.sSheet);
        this.bs.y = this.y;
        this.bs.x = this.x;
        this.bs.gotoAndStop("1");
        stage.addChild(this.bs);
        stage.update();
        this.step = 1;
        this.update = function(up,down,left,right,space) {
            if(up && this.y>0) {
                this.y -= this.spd[1];
            }
            if(down && this.y<canvas.height-36) {
                this.y += this.spd[1];
            }
            if(left && this.x>0) {
                this.x -= this.spd[0];
            }
            if(right && this.x<canvas.width-37) {
                this.x += this.spd[0];
            }
            
            /*if(space && bulletTime<=0) {
                new Bullet(this.x+34,this.y+18);
                bulletTime = 12;
            }
            if(bulletTime>0) {
                bulletTime -= 1;
            }*/
            //this.bs.gotoAndStop("2");
            //this.step += 0.25;
            //console.log(this.step);
            this.bs.gotoAndStop(Math.floor(this.step));
            if(this.step>=5) {
                //console.log("Bam");
                this.step = 1;
            }
            
            this.bs.x = this.x;
            this.bs.y = this.y;
        };
    }
    window.tick = function() {
        player.update(u,d,l,r,s,sd);
        stage.update();
    };
    canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    stage.enableMouseOver(10);
    var u,d,l,r,s = false;
    var sd = "r";
    //$("*").on("keydown", function(e) {
    document.onkeydown = function(e) {
        //e.preventDefault();
        //e.stopPropagation();
        //console.log(e.which);
        if(e.which===38 || e.which===87) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            u = true;
            player.step += 0.25;
        } else if(e.which===40 || e.which===83) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            d = true;
            player.step += 0.25;
        } else if(e.which===37 || e.which===65) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            l = true;
            sd = "l";
            player.step += 0.25;
        } else if(e.which===39 || e.which===68) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            r = true;
            sd = "r";
            player.step += 0.25;
        } else if(e.which===32 || e.which===90) {
            if(!e.custom) {
                e.preventDefault();
                e.stopPropagation();
            }
            s = true;
            player.step += 0.25;
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
    canvas.onclick = function(e) {
    };
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
        pImg.src = "Graphics/mudkipSprites3.png";
        window.player = new Player(32,32,pImg);
        //console.log(player);
        /*window.eImg = new Image();
        eImg.onload = enemLoaded;
        eImg.src = "./Graphics/enemSprite1.png";*/
        
        /*window.sco = new Text(neededKills-killCount, "18px Arial", "#FFF");
        sco.x = canvas.width-sco.getMeasuredWidth()-10;
        sco.y = sco.getMeasuredLineHeight();
        stage.addChild(sco);*/
    }
    init();
};