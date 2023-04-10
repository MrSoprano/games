Base.Game = function(game) {
    this.Score = 0;

  //  this.music = null;
    this.pauseButton = null;

    this.dT = 0;

    this.WaitMessage = null;
    this.PlayFlag = false;

    this.TManager = null;

    this.SecondTimeCntr = 0;
    this.Sounds = null;
    this.DebugFlag = false;

    this.HalfFlag = false;

 //   this.WrongOrientFlag = false;
 //   this.WrongOrientImg = null;

    this.CurrWnd = null;

    this.GamesCntr = 0;

    this.CurrTime = 0;
    this.LastTime = 0;

    this.DelayCalls = null;
    this.DelayCallsNum = 0;
};

Base.Game.prototype = {

    init: function () {
        this.BgImg = null;
    },

    create: function() {

        this.dT =  1.0/Base.UPS;//this.game.time.physicsElapsed;

      //  this.game.camera.flash(0xFFFFFF,300);
        this.BgImg  = this.game.add.image(-20, -20, 'gfx', 'bg.png');
        this.BgImg.tint = 0xEEEEEE;
        this.BgImg.anchor.set(0);
        this.BgImg.scale.set((Base.WidthGame+40)/this.BgImg.width,(Base.HeightGame+40)/this.BgImg.height);

     /*   var bmp = this.game.make.bitmapData(64, 64);
        bmp.fill(0x16,0x37,0x3f);
        this.cache.addImage('bgblue','',bmp.canvas);

        bmp = this.game.make.bitmapData(64, 64);
        bmp.fill(255,255,255);
        this.cache.addImage('bgwhite','',bmp.canvas); */

        this.BgGroup = this.game.add.group();
        this.StaticGroup = this.game.add.group();
        this.GameGroup = this.game.add.group();
        this.GameTopGroup = this.game.add.group();
        this.TopGroup = this.game.add.group();
        this.MenuGroup = this.game.add.group();
        this.MenuTopGroup = this.game.add.group();
        this.WndGroup = this.game.add.group();
        this.WndTopGroup = this.game.add.group();

     /*   this.BgFirstImg = this.make.image(Base.Xc, Base.Yc, 'loaderatlas','bgsmall.png');
        this.BgFirstImg.anchor.setTo(0.5);
        this.WndTopGroup.add(this.BgFirstImg);
        this.BgFirstImg.scale.set(Base.WidthGame/200,Base.HeightGame/200); */

       // this.WrongOrientFlag = false;
        this.Sounds = Base.Sounds;

        this.TManager = new CThreadManager(this);
        this.TManager.create();

        this.music = this.add.audio('music',1,true);

        this.Sounds[Base.SndButton] = this.add.audio('button');
        this.Sounds[Base.SndAttach] = this.add.audio('attach');
        this.Sounds[Base.SndMerge0] = this.add.audio('merge0');
        this.Sounds[Base.SndMerge1] = this.add.audio('merge1');
        this.Sounds[Base.SndMerge2] = this.add.audio('merge2');
        this.Sounds[Base.SndPrize] = this.add.audio('prize');
        this.Sounds[Base.SndCoin] = this.add.audio('coin');
        this.Sounds[Base.SndFrenzy] = this.add.audio('frenzy');
        this.Sounds[Base.SndWin] = this.add.audio('win');
        this.Sounds[Base.SndTrow] = this.add.audio('trow');
        this.Sounds[Base.SndLoose] = this.add.audio('lose');
        this.Sounds[Base.SndWindow] = this.add.audio('window');
        this.Sounds[Base.SndShake] = this.add.audio('shake');
        this.Sounds[Base.SndCount] = this.add.audio('count');

        this.getSavedData();

        window.sgLang = this.game.cache.getJSON('language');

        if(Base.MusicFlag)
            this.MuteMusic(!Base.MusicFlag);
      //  this.MuteSounds(!Base.SoundFlag);

        this.game.onPause.add(this.OnPause, this);
        this.game.onResume .add(this.OnResume , this);
  //      this.game.onFocus.add(this.OnFocus , this);
     //   this.game.onBlur.add(this.OnBlur , this);


        this.game.input.onDown.add(this.OnDownFirst, this);

        sgSettings.commands.runGame();
     //  this.DoGame();
    },

    OnPause : function()
    {
        sgSettings.commands.freezeGame();
    //    Base.FreezeFlag = true;
     //   if(Base.MusicFlag) this.MuteMusic(true);
    },

    OnResume : function()
    {
        sgSettings.commands.unfreezeGame();
       // Base.FreezeFlag = false;
       // if(Base.MusicFlag) this.MuteMusic(false);
    },

        /*
    OnBlur : function()
    {
        sgSettings.commands.freezeGame();
    },

    OnFocus : function()
    {
        sgSettings.commands.unfreezeGame();
    },
  */

    OnDownFirst : function(pnt)
     {
         this.MuteMusic(!Base.MusicFlag);
         this.game.input.onDown.remove(this.OnDownFirst, this);
     },
    //#################################
    freezeGame : function()
    {
        Base.FreezeFlag = true;
        if(Base.MusicFlag) this.MuteMusic(true);
    },

    unfreezeGame : function()
    {
        Base.FreezeFlag = false;
        if(Base.MusicFlag) this.MuteMusic(false);
    },

    getScore : function()
    {
        return Base.Score;
    },

    runGame : function()
    {
       this.DoGame();
    },

    startOver : function()
    {
        if(this.CurrWnd!=null)
          this.CurrWnd.OnReplay();
    },

//#################################
// ###########SAVING###############
    //#################################
    getSavedData : function()
    {
        Base.HiScore = Base.Saves.highscore;
     //   if(!Base.EditModeFlag)
        Base.Coins = Base.Saves.coins;
       // Base.Coins = 20;
        Base.SoundFlag = Base.Saves.sound;
        Base.MusicFlag = Base.Saves.music;
        Base.HelpFlag = Base.Saves.help;
    },

    saveAll : function()
    {
        Base.Saves.highscore = Base.HiScore;
      //  if(!Base.EditModeFlag)
           Base.Saves.coins =  Base.Coins;
        Base.Saves.sound = Base.SoundFlag;
        Base.Saves.music = Base.MusicFlag;
        Base.Saves.help = Base.HelpFlag;

        sdkHandler.trigger('save', {
            key: 'merge01',
            value: JSON.stringify(Base.Saves),
            callback: function(error) {
                if(error) {
                    /* save failed, handle error */
                  //  console.log(examplePrefix + "Saving callback - error");
                }
                else {
                    /* save succeeded */
                 //   console.log(examplePrefix + "Saving callback - success");
                }
            }
        }, this);

    },
/*
    GetSavedData : function()
    {

        if (this.game.device.localStorage) {
            // Shifter.HiScore = JSON.parse(this.gatSavedItem("hiScore",0));
            var def = this.gatSavedItem("hiscore", null);
            if (def != null) Base.HiScore = JSON.parse(def);
            else {
                Base.HiScore = 0;
                this.saveHiScore();
            }

           // Base.HiScore = 0; // temp

            def = this.gatSavedItem("coins", null);
            if (def != null) Base.Coins = JSON.parse(def);
            else {
                Base.Coins = 0;
                this.saveCoins();
            }

            Base.Coins = 40;


            def = this.gatSavedItem("sound", null);
            if (def != null) Base.SoundFlag = JSON.parse(def);
            else {
                Base.SoundFlag = true;
                this.saveSound();
            }

            def = this.gatSavedItem("music", null);
            if (def != null) Base.MusicFlag = JSON.parse(def);
            else {
                Base.MusicFlag = true;
                this.saveMusic();
            }
        }


    },
 */
    gatSavedItem: function(item,def)
    {
        if(Base.NoLocalStorageFlag) return undefined;

        var val =  localStorage.getItem(item);
        if(val===null && def!=null)
        {
            localStorage.setItem(item,JSON.stringify(def));
            val = JSON.stringify(def);
        }
        return val;
    },

    saveSavedItem: function(item,def)
    {
        if(Base.NoLocalStorageFlag) return false;
        localStorage.setItem(item,JSON.stringify(def));
        return true;
    },

    /*clearGameProgress: function()
    {
        Base.HiScore = 0;

        if(Base.NoLocalStorageFlag) return;

        if (this.game.device.localStorage) {
           // localStorage.setItem("hiScore",Spiky.HiScore);
            this.saveSavedItem('hiscore',0);
        }
    }, */

    /* saveHiScore: function()
    {
        if(Base.NoLocalStorageFlag) return;
        localStorage.setItem("hiscore",Base.HiScore);
    }, */

    /*saveMute : function()
    {
        if(Base.NoLocalStorageFlag) return;
       localStorage.setItem("mute",Base.MuteFlag);
    },*/

  /*  saveSound : function()
    {
        if(Base.NoLocalStorageFlag) return;
        localStorage.setItem("sound",Base.SoundFlag);
    },

    saveMusic : function()
    {
        if(Base.NoLocalStorageFlag) return;
        localStorage.setItem("music",Base.MusicFlag);
    },

    saveCoins : function()
    {
       Base.Saves.coins = Base.Coins;
       // if(Base.NoLocalStorageFlag) return;
       // localStorage.setItem("diamonds",Base.Coins);
    }, */


    //#################SOUND######################

 /*   MuteSounds: function(mute) {
        Base.MuteFlag = mute;
        for(var i=0;i<this.Sounds.length;i++)
            this.Sounds[i].mute = mute;
    }, */

    MuteMusic: function(mute) {
     //   Base.MusicFlag = !mute;
        if(mute)
        {
            if(this.music.isPlaying)
                this.music.pause();
        }
        else
        {
            if(this.music.paused)
                this.music.resume();
            else {
                if(!this.music.isPlaying)
                   this.music.play('', 0, 1, true);
            }
        }
    },

    PlaySnd: function(snd) {
        if(Base.SoundFlag)
           return this.Sounds[snd].play();
        return null
    },

    StopSnd: function(snd) {
        this.Sounds[snd].stop();
    },

    //#####################################

    removeThread: function(thread,func) {
        this.TManager.removeThread(thread,func);
    },

    DoGame: function() { // called from NOT game
        var wnd = this.TManager.getCachedThread(CGame);
        if(wnd==null) wnd = new CGame(this);
        wnd.Create();
        this.TManager.saveThread(wnd);
        this.TManager.addThread(wnd,wnd.update);
        this.CurrWnd = wnd; // stay always
    },

    clearDelayCalls: function()
    {
        for(var i=0;i<this.DelayCallsNum;i++)
             if(this.DelayCalls[i].ActiveFlag)
                 this.DelayCalls[i].kill();
    },

    makeDelayCall: function(delay,func,funcContex,args)
    {
        if(this.DelayCalls==null) this.DelayCalls = [];

        var dcall = null;
        for(var i=0;i<this.DelayCallsNum;i++) {
            if(!this.DelayCalls[i].ActiveFlag)
            {
                dcall = this.DelayCalls[i];
                break;
            }
        }

        if(dcall==null)
        {
            for(i=0;i<this.DelayCalls.length;i++) {
                if(!this.DelayCalls[i].ActiveFlag)
                {
                    dcall = this.DelayCalls[i];
                    this.DelayCallsNum = i + 1;
                    break;
                }
            }
        }
        if(dcall==null)
        {
            dcall = new CDelayCall(this);
            this.DelayCalls[this.DelayCallsNum] = dcall;
            this.DelayCallsNum++;
        }

        //Create = function(delay,func,args,go,kill,papa
        dcall.Create(delay,func,args,true,true,funcContex,this.TManager);
        return dcall;
    },

    getImg : function(x,y,tex,frameName,group) {
        var img = null;
        for (var i = 0; i < group.children.length; i++)
        {
            if (group.children[i].alive === false &&
                (group.children[i] instanceof Phaser.Image) &&
                (group.children[i].key===tex))
            {
                img = group.children[i];
                break;
            }
        }

        if (img == null) {
            img = this.game.make.image(x, y, tex, frameName);
            group.add(img);
        }
        else {
            img.revive();
            img.x = x;
            img.y = y;
            if(frameName!=null)
                img.frameName = frameName;
        }
        return img;
    },

    AdjustSize: function() {
           // BASE FUNCTION
        if(this.BgImg!==null)
          this.BgImg.scale.set((Base.WidthGame+40)/640,(Base.HeightGame+40)/960);

        if(this.CurrWnd!=null)
            this.CurrWnd.OnGameHeightChange();
    },


    update: function() {

        this.CurrTime = this.game.time.now;
        Base.RealTimeInt =  (this.CurrTime-this.LastTime)*0.001;//this.game.time.physicsElapsed;
        if(Base.RealTimeInt>1)  Base.RealTimeInt = this.game.time.physicsElapsed;
        if(Base.RealTimeInt>0.1) Base.RealTimeInt = 0.1;
        this.LastTime = this.CurrTime;

        if(Base.FreezeFlag)  return;

        if(window.innerHeight!=Base.HeightWnd || window.innerWidth!=Base.WidthWnd)
            Base.makeScreenAdjust(this.game); // it will call this correct function AdjustSize

       // if(this.WrongOrientFlag) return;
        this.TManager.update();
    }
};