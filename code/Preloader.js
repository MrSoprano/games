Base.Preloader = function(game) {
    this.preloadBar = null;
    this.ready = false;
    this.State = 0;
};


Base.Preloader.prototype = {
	
	preload: function () {

        Base.clear();
        Base.firstThings();

        this.load.onLoadComplete.add(this.loadComplete, this);

        this.State = 0;
        this.sgLoadedFlag = false;
        this.loadedSave = false;

        this.BgImg = null;
        this.AtlasLoadedFlag = false;

        this.GroupBase = this.add.group();

        this.Group0 = this.make.group();
        this.GroupBase.add(this.Group0);

        this.Group0.scale.set(Base.Scale);

        this.preloadBarBack = null;
        this.preloadBar = null;

        this.TimerFunc = function()
        {
           this.checkScreenChange();

            if( this.load.isLoading )
               sdkHandler.trigger('loading.update', { progressPercentage: this.load.progress}, this);

            if((!this.AtlasLoadedFlag) && this.game.cache.checkImageKey('loaderatlas')) {
                this.AtlasLoadedFlag = true;
                // load all when ready

                this.BgImg = this.make.image(Base.Xc, Base.Yc, 'loaderatlas','bgsmall.png');
                if(this.BgImg!=null)
                  this.BgImg.scale.set(Base.WidthGame/200,Base.HeightGame/200);
                this.BgImg.anchor.setTo(0.5);
                this.Group0.add(this.BgImg);

                this.preloadBarBack = this.make.image(Base.Xc, Base.Yc, 'loaderatlas','sliderbg.png');
                this.preloadBarBack.anchor.setTo(0.5, 0.5);
                this.Group0.add(this.preloadBarBack);

                this.preloadBar = this.make.image(Base.Xc, Base.Yc+1,'loaderatlas','slider.png');
                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.Group0.add(this.preloadBar);

                var frameData = this.cache.getFrameData('loaderatlas');
                this.PreloaderWidth = frameData.getFrameByName('sliderbg.png').width;
                this.preloadBar.x -= this.PreloaderWidth/2;
                this.preloadBar.anchor.setTo(0, 0.5);
                this.load.setPreloadSprite(this.preloadBar);
            }

            /*if(this.State==1)
            {
                this.Group0Alpha-=0.1;
                if(this.Group0Alpha<=0) this.Group0Alpha = 0;
                this.Group0.setAll('alpha',this.Group0Alpha);
            } */
        };

        this.TimerEvt = this.game.time.events.loop(30,this.TimerFunc, this);

     //   this.load.bitmapFont('NumFont', 'fonts/num.png', 'fonts/num.fnt');
        this.load.json('language', 'lang/lang.json');

     //  var phaserJSON = game.cache.getJSON('language');
        //phaserJSON.name
       // this.load.bitmapFont('MainFont', 'fonts/main.png', 'fonts/main.fnt');
        this.load.bitmapFont('GoldFont', 'fonts/gold.png', 'fonts/gold.fnt');
     //   this.load.bitmapFont('NumBigFont', 'fonts/numbig.png', 'fonts/numbig.fnt');
      //  this.load.bitmapFont('BigFont', 'fonts/big.png', 'fonts/big.fnt');

        this.load.audio('music', 'audio/music.mp3');

        this.load.audio('button', 'audio/button.mp3');
        this.load.audio('merge0', 'audio/merge0.mp3');
        this.load.audio('merge1', 'audio/merge1.mp3');
        this.load.audio('merge2', 'audio/merge2.mp3');
        this.load.audio('trow', 'audio/trow.mp3');
        this.load.audio('attach', 'audio/attach.mp3');
        this.load.audio('win', 'audio/win.mp3');
        this.load.audio('lose', 'audio/lose.mp3');
        this.load.audio('coin', 'audio/coin.mp3');
        this.load.audio('prize', 'audio/prize.mp3');
        this.load.audio('shake', 'audio/shake_boom.mp3');
        this.load.audio('window', 'audio/window_swoosh.mp3');
        this.load.audio('frenzy', 'audio/frenzy.mp3');
        this.load.audio('count', 'audio/count.mp3');

      //  this.load.atlas('bgs', 'images/bgs.png', 'images/bgs.json');
        this.load.atlas('gfx', 'images/gfx.png', 'images/gfx.json');
        this.load.atlas('atlas', 'images/atlas.png', 'images/atlas.json');

        sdkHandler.trigger('restore', {
            key: 'merge01',
            callback: function(error, value) {
                if (error || value == null) {
                    this.loadedSave = true;
                    Base.Saves = { highscore: 0, music:true,sound:true,coins:0,help:true};
                    Base.Saves.coins = 100;
                } else {
                    this.loadedSave = true;
                    Base.Saves = JSON.parse(value);
                }
            }
        }, this);
	},

    loadComplete:  function ()  {


    },

	create: function () {
		this.preloadBar.cropEnabled = false;
	},


    checkScreenChange: function() {
        // CALLED EVERY 1/30 sec

        if(window.innerHeight!=Base.HeightWnd || window.innerWidth!=Base.WidthWnd) {

            Base.makeScreenAdjust(this.game); // it will call this correct function AdjustSize
        }
    },

    AdjustSize: function() {
        // BASE FUNCTION
     /*   if(this.logoImg!=null) {
            this.logoImg.y = Base.Height * Base.HCoeff / 2 - 110;
        }*/

        if(this.preloadBarBack!=null)
        {
            this.preloadBarBack.x = Base.Xc;
            this.preloadBarBack.y = Base.Yc;

            this.preloadBar.x = Base.Xc;
            this.preloadBar.y = Base.Yc;
            this.preloadBar.x -= this.PreloaderWidth/2;

            this.BgImg.x = Base.Xc;
            this.BgImg.y = Base.Yc;
            this.BgImg.scale.set(Base.WidthGame/200,Base.HeightGame/200);

            // this.preloadBarBack.y = Base.Height*Base.HCoeff/2 + 270;
           // this.preloadBar.y = Base.Height*Base.HCoeff/2 + 270;
        }
    },

    freezeGame : function()
    {
        Base.FreezeFlag = true;
    },

    unfreezeGame : function()
    {
        Base.FreezeFlag = false;
    },

    //http://antongames.com/games/dunk/
	update: function () {

        switch (this.State) {
            case 0:

                if (this.loadedSave &&
                    this.cache.isSoundDecoded('button') &&
                    this.cache.isSoundDecoded('merge0') &&
                    this.cache.isSoundDecoded('trow') &&
                    this.cache.isSoundDecoded('attach') &&
                    this.cache.isSoundDecoded('music') &&
                    this.ready == false &&
                    this.game.cache.checkImageKey('atlas') && this.game.cache.checkImageKey('gfx')
                && this.game.cache.checkBitmapFontKey('GoldFont')) {


                 //   this.scale.setUserScale(Spiky.ScaleX,Spiky.ScaleY);

                //    this.Group0Alpha = 1;
              //      this.Group0.setAll('alpha',this.Group0Alpha);

                    this.ready = true;
                    this.State = 1;
                    //  this.game.camera.flash(0xFFFFFF,400);

                    sdkHandler.trigger('loading.completed',
                        {
                            callback: function(error, user) {
                                if(error) {
                                    console.log('loading not complete');
                                }
                                else {
                                  //  console.log('loading OK');
                                    this.sgLoadedFlag = true;
                                }
                            }
                        },
                        this);
                    //   this.sgLoadedFlag = true;

                  /* this.Group0Alpha = 0;
                     this.GroupBase.exist = false;
                     this.Group0.visible = false;
                     this.Group0.exist = false; */
               //    this.State = 2;

                }
                break;

            case 1:

                if(this.sgLoadedFlag) {
                    this.game.time.events.remove(this.TimerEvt);
                    Base.TimeStartGame = this.game.time.now;

                  //  sgSettings.commands.runGame = this.StartGameMode.bind(this);
                  //  sgSettings.commands.runGame();
                     this.state.start('Game');
                }

              /*  return;

                if(this.Group0Alpha<=0)
                {
                    this.game.time.events.remove(this.TimerEvt);

                  //  this.game.camera.flash(0xFFFFFF,400);
                    Base.TimeStartGame = this.game.time.now;
                 //   this.state.start('Game');
                 //   this.Group0Alpha = 0;
                 //   this.GroupBase.exist = false;
                 //   this.Group0.visible = false;
                 //   this.Group0.exist = false;

                    //  this.Group1Alpha = 0;
                    //   this.Group1.visible = false;
                    //  this.Group1.exist = false;
                    //  this.GroupBase.exist = false;
                    this.State = 2;
                }  */
                break;

        }
    }
};

