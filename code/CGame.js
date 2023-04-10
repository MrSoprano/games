
CGame = function (papa) {

    this.Papa = papa;
    this.game =  this.Papa.game;
    this.cache =  this.Papa.cache;
    this.scale =  this.Papa.scale;
    this.dT = 1.0/Base.UPS;//game.time.physicsElapsed;
    this.BaseGroup = this.Papa.MenuGroup;
 //   this.Base = new CBaseWnd(papa,this.BaseGroup);

    this.MainPanel = null;
    this.DownPanel = null;
    this.PauseWnd = null;
    this.CoinsWnd = null;
    this.ResultsWnd = null;
    this.ChoiceWnd = null;
    this.PauseFlag = false;

    this.Tweens = new CTweens();

    this.LevelThreads =  new CThreadManager();
    this.FXThreads =  new CThreadManager();

    this.Prizes = [];
    this.Dust = [];
    this.ExplParts = [];
    this.PopUps = [];
    this.ExplGlows = [];
    this.Dust = [];
    this.FishFXs = [];
    this.Anims = [];

    this.LinesXY = [];

    this.Kills = [];
    this.KillsIndex = 0;

    this.ShoutOuts = [{index:-1,type:0,scale:1,texts:[sgLang.nice[Base.Lang],sgLang.good[Base.Lang]],shake:false},
        {type:0,scale:1.1,index:-1,texts:[sgLang.well[Base.Lang],sgLang.great[Base.Lang],sgLang.awesome[Base.Lang]],shake:false},
        {type:0,scale:1,index:-1,texts:[sgLang.well[Base.Lang],sgLang.great[Base.Lang],sgLang.awesome[Base.Lang]],shake:true}];
    this.ConfFrames = ['conf0.png','conf1.png','conf2.png','conf3.png'];

    Base.Score = 0;

    this.IDCntr = 0;

    this.BgGroup = this.Papa.BgGroup;
    this.StaticGroup =  this.Papa.StaticGroup; // lines and backet back rim
    this.GameGroup = this.Papa.GameGroup; // balls and backet
    this.GameTopGroup = this.Papa.GameTopGroup; // balls and backet
    this.TopGroup = this.Papa.TopGroup;
    this.MenuGroup = this.Papa.MenuGroup;
    this.MenuTopGroup = this.Papa.MenuTopGroup;
    this.WndGroup = this.Papa.WndGroup;
    this.WndTopGroup = this.Papa.WndTopGroup;
   // this.ShutterGroup = this.Papa.ShutterGroup;

    this.BgGroup.scale.set(Base.Scale);

    this.GameGroup.scale.set(Base.Scale);
    this.GameTopGroup.scale.set(Base.Scale);
    this.TopGroup.scale.set(Base.Scale);
    this.MenuGroup.scale.set(Base.Scale);
    this.MenuTopGroup.scale.set(Base.Scale);
    this.WndGroup.scale.set(Base.Scale);
    this.WndTopGroup.scale.set(Base.Scale);
  //  this.ShutterGroup.scale.set(Base.Scale);
    this.BgImg  = this.game.make.image(0, 0, 'gfx', 'bg.png');
    this.BgImg.anchor.set(0);
    this.BgGroup.add(this.BgImg);
    this.BgFreenzyImg = this.game.make.image(0, 0, 'gfx', 'blueBG.png');
   // this.BgFreenzyScale = 1;//this.BgImg.width/this.BgFreenzyImg.width;
//    this.BgFreenzyImg.scale.set(this.BgFreenzyScale );
    this.BgGroup.add(this.BgFreenzyImg);

    //sgLang.clear[Base.Lang]

   /* fff =  this.game.add.text(Base.Width/2,150, sgLang.clear['ru'],  //
        { font: "40px FontVector", fill: "#FFFFFF", align: "center" });
    fff.anchor.set(0.5);
    this.MenuGroup.add(fff);


    var fff =  this.game.add.text(Base.Width/2,200, sgLang.newhs['ja'],  //
        { font: "40px FontVector", fill: "#FFFFFF", align: "center" });
    fff.anchor.set(0.5);
    this.MenuGroup.add(fff);

    fff =  this.game.add.text(Base.Width/2,250, sgLang.change['br'],  //
        { font: "40px FontVector", fill: "#FFFFFF", align: "center" });
    fff.anchor.set(0.5);
    this.MenuGroup.add(fff); */
  //  console.log('lang '+sgSettings.config.env.locale);


    Base.CellDiam = (Base.Width-Base.FieldMarg*2)/Base.GameCols;
  //  console.log("cell diam "+Base.CellDiam);
    var step =  Base.CellDiam;
    for(i=0;i<Base.GameCols;i++) {
        Base.Lines[i] = Base.FieldMarg + step/2 + i*step;
        img  = this.game.make.image(Base.Lines[i], Base.Y_bott, 'atlas', 'startpointBlock.png');
        img.anchor.set(0.5);
        this.BgGroup.add(img);
    }

    for(var i=0;i<Base.GameCols-1;i++) {
         this.LinesXY.push({x:Base.Lines[i]+step/2,y:125});
         var img  = this.game.make.image(this.LinesXY[i].x, this.LinesXY[i].y, 'atlas', 'lineOnBG.png');
         img.anchor.set(0.5,0);
         this.BgGroup.add(img);
    }

    // HERE FReanz Panel

    this.FreenzyPanelImg = this.game.make.image(Base.Width/2,0, 'atlas', 'frenzyPanel.png');
    this.FreenzyPanelImg.anchor.set(0.5,0);
    this.MenuGroup.add(this.FreenzyPanelImg);
    var fontH = Base.LangParams[Base.LangIndex].h_frenzy + 'px FontVector';
    this.FreenzyText =  this.game.add.text(Base.Width/2, 50, 'xxxx',
        { font: fontH, fill: "#502b08", align: "center" });
    this.FreenzyText.anchor.set(0.5,0.5);
  //  this.FreenzyText =  this.game.make.bitmapText(Base.Width/2, 40, 'MainFont', 'FRENZY',40);
  //  this.FreenzyText.anchor.set(0.5);
   // this.FreenzyText.tint  =  0x502b08;
    this.MenuGroup.add(this.FreenzyText);

    this.MainPanel = new CMainPanel(this,this.LevelThreads,this.MenuGroup);
    this.MainPanel.create();

    this.DownPanel = new CDownPanel(this,this.LevelThreads,this.MenuGroup);
    this.DownPanel.create();

    this.FreenzySliderBgImg = this.game.make.image(Base.Width/2,109, 'atlas', 'frenzyLine.png');
    this.MenuGroup.add(this.FreenzySliderBgImg);
    this.FreenzySliderImg = this.game.make.image(Base.Width/2,109, 'atlas', 'frenzyLine2.png');
    this.MenuGroup.add(this.FreenzySliderImg);

    this.Frenzy = new CFrenzy(this,this.BgGroup,this.LevelThreads);
    this.Frenzy.init(this.FreenzySliderImg,this.FreenzySliderBgImg,this.BgFreenzyImg,
        this.FreenzyPanelImg,this.FreenzyText);

  //  this.ScrollBg = new CScrollImg(this,this.FXThreads);

    this.ButtonsHaltFlag = false;

    this.Y_field = 115;
    this.Y_booster = 825;

    this.Xm = 0;
    this.Ym = 0;

    this.ActiveFlag = false;

    this.Sounds = this.Papa.Sounds;

    this.PauseFlag = false;

    this.Field = new CField(this,this.LevelThreads,this.GameGroup);
    this.Field.init();

    this.CoinsGame = 0;

   /* this.ButtSound =  this.Papa.game.make.button(Base.X_sound, Base.Y_sound,
        'atlas',this.OnSoundButton, this,
        'soundB.png', 'soundB.png','soundB.png','soundB.png');
    this.TopGroup.add(this.ButtSound);
    this.ButtSound.anchor.set(0.5);
    //butt.hitArea = new PIXI.Circle(0,0,60);
    this.ButtSound.onDownSound = this.Papa.Sounds[Base.SndButton];
    this.ButtSound.input.PriorityID = 1;

    if(Base.MuteFlag)
        this.ButtSound.setFrames( 'soundBgrey.png','soundBgrey.png','soundBgrey.png','soundBgrey.png');
    this.ButtSound.update(); */

    this.correctCoord();

    this.TextSmallPop = null;

   //############################################################

    this.TextPopUp = new CTextPopUp(this,this.MenuGroup,this.FXThreads);

   // Base.LangParams[Base.LangIndex].scale
    var fontH = Math.floor(Base.LangParams[Base.LangIndex].scale*70)+'px FontVector';
    var text = this.game.add.text(200, 370, 'xxx',
        { font: fontH, fill: "#ffffff", align: "center" });
    text.setShadow(0,3,'rgba(0,0,0,0.2)');
    text.shadowBlur = 2;
    this.MenuGroup.add(text);
    this.TextPopUp.init(text);

 //   this.imgDecay  = this.game.make.image(-200,-200, 'gfx', 'light_00.png');
  //  this.MenuTopGroup.add(this.imgDecay );

    this.game.camera.roundPx = false;
    this.Shake = new CCameraShake(this.game.camera,this.FXThreads);

/*
    this.ButtClose =  this.Papa.game.make.button(Base.X_pause, Base.Y_pause,
        'atlas',this.OnCloseButton, this, 'close.png', 'close.png','close.png','close.png');
    this.TopGroup.add(this.ButtClose);
    this.ButtClose.anchor.set(0.5);
    //butt.hitArea = new PIXI.Circle(0,0,60);
    this.ButtClose.onDownSound = this.Papa.Sounds[Base.SndButton];
    this.ButtClose.visible = false;
    this.ButtClose.input.PriorityID = 1;
  */
};


CGame.prototype.Clear = function()
{
    this.LevelThreads.create();
    this.FXThreads.create();

    //this.Click = false;
    this.PauseFlag = false;

    this.IDCntr = 0;

    this.GamesCntr =  0;

   // this.StaticGroup.visible = true;
  //  this.GameGroup.visible = true;
   // this.MenuGroup.visible = true;
};

CGame.prototype.Create = function() {
    this.Clear();

    this.game.input.onDown.add(this.OnDown, this);

    this.ActiveFlag = true;

    //clear
    this.State = 0;



    Base.Score = 0;
    this.CoinsGame = 0;
    this.Field.create();
    if(Base.HelpFlag)  this.Field.setHelp();
    this.Papa.makeDelayCall(1,this.startGame,this,null);

    sdkHandler.trigger('start');
};

CGame.prototype.clearBeforeNewGame = function() {
    this.Frenzy.kill();
    Base.Score = 0;
    this.CoinsGame = 0;
    this.updateScore();
};

/*
CGame.prototype.makeGame = function() {

    this.clearBeforeNewGame();

    this.Field.create();
  //  this.Field.setHelp();
    this.Papa.makeDelayCall(1,this.startGame,this,null);
}; */

CGame.prototype.OnReplay = function() {
    this.GamesCntr++;
    this.clearBeforeNewGame();

    sdkHandler.trigger('gameStart');
    this.Field.Replay();
};

CGame.prototype.OnNoChoice = function() {
    this.setResults();
};

CGame.prototype.OnContinue = function() {
    this.Field.Continue();
};

CGame.prototype.setFreenzy  = function()
{
    this.PlaySnd(Base.SndFrenzy);
    if(this.Frenzy.ActiveFlag) return false;
    this.Frenzy.create(Base.Width/2);
    return true;
};

CGame.prototype.StopFreenzy  = function()
{
    this.Frenzy.stop();
};

CGame.prototype.makeShoutOut = function(type,shake)
{
    var def = this.ShoutOuts[type];
    var index = Math.floor(def.texts.length*Math.random());
    this.TextPopUp.create(Base.Width/2,Base.Height/2-50,
        this.ShoutOuts[type].type,this.ShoutOuts[type].texts[index],
        this.ShoutOuts[type].scale,550);
    if(shake) { this.Shake.create([5,2],70,1); this.PlaySnd(Base.SndShake); }
};

CGame.prototype.makeNoCoinsText = function(x,w_max)
{

    if(this.TextSmallPop==null)  {
        this.TextSmallPop = new CTextPopUp(this,this.MenuTopGroup,this.FXThreads);
        var text = this.game.add.text(0, 0, 'xxx',
             { font: "40px FontVector", fill: "#ffffff", align: "center" });
      //  var text = this.game.make.bitmapText(0, 0, 'MainFont', '0',38);
        this.MenuTopGroup.add(text);
        this.TextSmallPop.init(text);
    }

    if(this.TextSmallPop.ActiveFlag)  return;
    this.TextSmallPop.create(x,Base.Height-65,1,sgLang.nocoin[Base.Lang],1,0);
    this.TextSmallPop.setWidthMax(w_max);
};

CGame.prototype.makeShoutOutHiScore = function()
{
    this.TextPopUp.create(Base.Width/2,Base.Height/2-50,1,sgLang.newhs[Base.Lang],0.9,470);
    this.PlaySnd(Base.SndWin);
    this.Shake.create([5,2],70,1);
    this.PlaySnd(Base.SndShake);
};

CGame.prototype.setChoice = function()
{
    if(this.PauseFlag)  return;

  //  this.Papa.saveAll();

    if(this.ChoiceWnd==null) {
        this.ChoiceWnd = new CWndChoice(this, this.FXThreads, this.WndGroup,this.WndTopGroup);
        this.ChoiceWnd.init();
    }

    this.ChoiceWnd.create();
    this.MainPanel.PauseOn();
    this.PauseFlag = true;
};

CGame.prototype.setResults = function()
{
    if(this.PauseFlag)  return;

    sdkHandler.trigger('gameOver', {score:Base.Score}, this);

  //  this.Papa.saveAll();

    if(Base.NoInterAdFlag)
    {
        if(this.ResultsWnd==null) {
            this.ResultsWnd = new CWndResults(this, this.FXThreads, this.WndGroup,this.WndTopGroup);
            this.ResultsWnd.init();
        }
        this.ResultsWnd.create();
    }
    else
    {
        sdkHandler.trigger('beforePlayButtonDisplay', {
            callback: function() {
                 // console.log('xxxxx   beforePlayButtonDisplay  callback');
                if(this.ResultsWnd==null) {
                    this.ResultsWnd = new CWndResults(this, this.FXThreads,
                        this.WndGroup,this.WndTopGroup);
                    this.ResultsWnd.init();
                }
                this.ResultsWnd.create();
            }
        },this);
    }

   /* if(this.ResultsWnd==null) {
        this.ResultsWnd = new CWndResults(this, this.FXThreads, this.WndGroup,this.WndTopGroup);
        this.ResultsWnd.init();
    }
    this.ResultsWnd.create(); */

    this.MainPanel.PauseOn();
    this.PauseFlag = true;
};

CGame.prototype.setPause = function()
{
    if(this.PauseFlag)  return;

    if(this.PauseWnd==null) {
        this.PauseWnd = new CWndPause(this, this.FXThreads, this.WndGroup,this.WndTopGroup);
        this.PauseWnd.init();
    }

    this.PauseWnd.create();
    this.MainPanel.PauseOn();
    this.PauseFlag = true;
};

CGame.prototype.setCoinsWnd = function()
{
    if(this.PauseFlag)  return;

    if(this.CoinsWnd==null) {
        this.CoinsWnd = new CWndCoins(this, this.FXThreads, this.WndGroup,this.WndTopGroup);
        this.CoinsWnd.init();
    }

    this.CoinsWnd.create();
    this.MainPanel.PauseOn();
    this.PauseFlag = true;
};

CGame.prototype.PauseOff = function() {
    // called outside in wndpause
    this.PauseFlag = false;
    this.MainPanel.PauseOff();
};

CGame.prototype.updateScore = function() {
    this.MainPanel.setScore(Base.Score);
};

CGame.prototype.updateCoins = function() {
    this.MainPanel.setCoins(Base.Coins);
    this.DownPanel.OnCoinsChange(Base.Coins);
    this.Papa.saveAll();
};

CGame.prototype.correctCoord = function()
{
    // this.Bg0Img.scale.set(Base.WidthGame/640,Base.HeightGame/960);
    this.X0 = (Base.WidthGame/Base.Scale - Base.Width)/2;
    this.BgGroup.x =  this.X0;
    this.StaticGroup.x = this.X0;
    this.GameGroup.x = this.X0;
    this.GameTopGroup.x = this.X0;
    this.TopGroup.x = this.X0;
    this.MenuGroup.x = this.X0;
    this.MenuTopGroup.x = this.X0;
    this.WndGroup.x = this.X0;
    this.WndTopGroup.x = this.X0;

    this.BgImg.scale.set(1,Base.HeightGame/960);
    this.BgFreenzyImg.scale.set(1,Base.HeightGame/960);
   // this.BgFreenzyImg.scale.set(this.BgFreenzyScale,this.BgFreenzyScale*Base.HeightGame/960);

    // if(this.MainPanel) this.MainPanel.OnResize();
    if(this.DownPanel)  this.DownPanel.OnResize();
    if(this.PauseWnd) this.PauseWnd.OnResize();
    if(this.ResultsWnd) this.ResultsWnd.OnResize();
    if(this.ChoiceWnd) this.ChoiceWnd.OnResize();
    if(this.CoinsWnd) this.CoinsWnd.OnResize();
};

CGame.prototype.OnGameHeightChange = function()
{
    // !!! BASE FUNCTION
    // this.BgGroup.scale.set():this.game.height/Base.BgImgHeight);
    this.correctCoord();

    //  if(this.currSubWnd!=null)
    //     this.currSubWnd.OnGameSizeChange();

};

CGame.prototype.startGame = function()
{
    sdkHandler.trigger('gameStart');
    this.Field.startPlay();
};

CGame.prototype.addCoins = function(add) {
    Base.Coins += add;
    this.updateCoins();
};

CGame.prototype.spendCoins = function(spend) {
    Base.Coins -= spend;
    this.updateCoins();
};

CGame.prototype.MakeBooster = function(type) {

    if(this.Field.applyBooster(type)) {
        this.spendCoins(Base.BoostersPrice[type]);
        return true;
    }
    return false;
};

CGame.prototype.OnFieldGameover = function()
{
   // called on game over
};


CGame.prototype.OnBoosterEnd = function(type)
{
    // called on booster actiob ends
    this.DownPanel.OnActionOver(type);
};


/*
CGame.prototype.OnCloseButton = function()
{
    if(this.PauseFlag)  return;
    this.Papa.clearDelayCalls(); // !!
    this.ClearOnLevelUp();
    this.FadeGameStaff();
  //  this.Papa.makeDelayCall(0.5,this.setMenu,this,null);
};

CGame.prototype.HideButtons = function(hide)
{
    if(hide)
    {
        this.ButtBalls.visible = false;
        this.ButtOpt.visible = false;
        this.ButtArch.visible = false;
     //   this.ButtLev.visible = false;
   //     this.LevText.visible = false;
    }
    else
    {
        this.ButtBalls.visible = true;
        this.ButtOpt.visible = true;
        this.ButtArch.visible = true;
     //   this.ButtLev.visible = true;
    //    this.LevText.visible = true;
    }
}

CGame.prototype.HideMenu = function()
{
    this.game.input.onDown.remove(this.OnDown, this);
    this.HideButtons(true);
    // this.ButtCred.visible = false;
    // this.ButtMore.visible = false;
    this.PauseFlag = true;

    this.KillMenuBall();

    this.DugaImg.kill();
    this.DugaImg = null;
    this.HelpHand.FadeOut();

    for(var i=0;i<this.Backets.length;i++)
    {
        if(this.Backets[i].ActiveFlag)
        {
            this.Backets[i].kill();
        }
    }

    if(this.MenuFlag)
    {
        // title scale out
        this.MenuEndFlag = true;
        this.ScalerMenu.setScaling(0.05,0.2,this.OnMenuScaled,this) ;
        this.HiScoreObj.setScaling(0.05,0.2,true);
        this.Menu.stopTitleGlow();

        this.TitleGlowImg.kill();
        this.TitleGlitter.kill();
        this.MenuFlag = false;

        this.Menu.kill();
    }
}; */

/*
CGame.prototype.OnOptionsButton = function()
{
    var aspect = this.game.width/this.game.height;
    var dy = 0;
    if(aspect<0.7) dy = (0.7-aspect)*400;
//570+dy

    if(this.OptWnd==null)
        this.OptWnd = new COptionsWnd(this,this.FXThreads,this.MenuGroup);

    // x0,y0,x1,y1,scale,alpha,order,onClose)
    this.OptWnd.create(this.ButtOpt,this.Xc,0.2,0.2,0,this.OnButtWndClose);

    // clear old wnd
    this.game.input.onDown.remove(this.OnDown, this);
    this.HideButtons(true);

    this.currSubWnd = this.OptWnd;
   // this.ButtMore.visible = false;
    this.PauseFlag = true;
};

CGame.prototype.FromWndToMenu = function()
{
    //  revive old wnd
    this.Papa.makeDelayCall(0.1,this.setMenu,this,null);
    this.game.input.onDown.add(this.OnDown, this);
    this.PauseFlag = false;
    this.currSubWnd = null;
    //this.OnButtWndClose();
};

CGame.prototype.OnButtWndClose = function()
{
    //  revive old wnd
    this.game.input.onDown.add(this.OnDown, this);

    this.HideButtons(false);

    this.currSubWnd = null;
//    this.ButtMore.visible = true;
    this.PauseFlag = false;
};

CGame.prototype.setFullscreen = function(on)
{
    if(on) {
        this.Papa.scale.startFullScreen();
        Backet.FullscreenFlag = true;
    }
    else
    {
        this.Papa.scale.stopFullScreen();
        Backet.FullscreenFlag = false;
    }
};
*/

/*
CGame.prototype.MuteSounds = function(mute)
{
    Base.MuteFlag = mute;
    this.Papa.MuteSounds(Base.MuteFlag);
    this.Papa.saveMute();
    this.UpdateSoundButton();
    return true;
};  */

/*
CGame.prototype.OnSoundButton = function()
{
    Base.MuteFlag = !Base.MuteFlag;
    this.Papa.MuteSounds(Base.MuteFlag);
    this.Papa.saveMute();
    this.UpdateSoundButton();
    return true;
}; */

CGame.prototype.UpdateSoundButton = function()
{
   /* if(Base.MuteFlag) this.ButtSound.setFrames('soundBgrey.png','soundBgrey.png','soundBgrey.png','soundBgrey.png');
    else this.ButtSound.setFrames('soundB.png','soundB.png','soundB.png','soundB.png');
    this.ButtSound.update(); */
};

/*
CGame.prototype.addKill = function(obj)
{
     this.Kills[this.KillsIndex] = obj;
     this.KillsIndex++;
}; */

CGame.prototype.clearGameProgress = function() {

    Base.HiScore = 0;
    Base.Coins = 0;

    /*if(!Base.EditModeFlag)
    {
        this.Papa.saveHiScore();
        this.Papa.saveCoins();
    } */
};

//##################HERE#########################
//##################HERE#########################
//##################HERE#########################
/*
CGame.prototype.makeChooseWnd = function() {
    if(this.ChooseWnd==null)
        this.ChooseWnd = new CChooseWnd(this,this.FXThreads,this.MenuGroup);
    this.ChooseWnd.create(this.Xc,0.1,0,0,this.OnGameGoOn,this.OnGameNotGoOn,null)
    this.currSubWnd = this.ChooseWnd;
};

CGame.prototype.OnGameGoOn = function() {
    this.currSubWnd = null;
    this.DoDiamondsSpendInGame(Backet.GameGoOnPrice);
    this.Papa.makeDelayCall(0.3,this.OnGameGoOn2,this,null);
};

CGame.prototype.OnGameGoOn2 = function() {
  //  this.game.input.onDown.add(this.OnDown, this);
    this.GameWasResumedFlag = true;
    this.ButtClose.visible = true;
    this.TouchAllowFlag = true;
   // this.PauseFlag = false;
    this.EndOfGameFlag = false;
    this.GamePlayFlag = true;
    this.Papa.makeDelayCall(0.2,this.startNewLevel,this,null);
};

CGame.prototype.OnGameNotGoOn = function() {
    this.currSubWnd = null;
    this.DoEndOfGame(0.2);
    this.NeedToLevelEndSplashFlag = false; // import after  EndOfGame
};

CGame.prototype.EndOfGame = function(pause)
{
    if(!this.GamePlayFlag)  return;
    if(this.EndOfGameFlag)  return;
    this.EndOfGameFlag = true;
    this.GamePlayFlag = false;
    this.TouchAllowFlag = false;

    if(this.GameType==1 ||  this.GameWasResumedFlag || this.Score<10)
     //this.GameType==1 ||  this.GameWasResumedFlag || this.Score<20 || Backet.Diamonds<25
    {
        this.DoEndOfGame(pause);

        this.ButtClose.visible = false;
    }
    else
    {
     //   this.game.input.onDown.remove(this.OnDown, this);
        this.Papa.makeDelayCall(pause+0.2,this.makeChooseWnd0,this,null);
        this.ButtClose.visible = false;
        this.ChooseGameGoOnFlag = true;
    }
};



CGame.prototype.makeDoneWnd = function() {
  //  this.DoneFireworkFlag = true;  // TEMP

    if(this.DoneWnd==null)
        this.DoneWnd = new CDoneWnd(this,this.LevelThreads,this.MenuGroup);

    this.DoneWnd.create(this.Score,Backet.HiScore,this.DoneFireworkFlag,this.setMenu);

    this.currSubWnd = this.DoneWnd;
}; */

CGame.prototype.PlaySnd = function(snd)
{
    this.Papa.PlaySnd(snd);
};

CGame.prototype.StopSnd = function(snd)
{
    this.Papa.StopSnd(snd);
};

CGame.prototype.addExplGlow = function(x,y,scale0,scale1,life,fade,alpha,atlas,imgStr,group)
{
    var obj = null;
    for(var i=0;i<this.ExplGlows.length;i++)
    {
        if(!this.ExplGlows[i].ActiveFlag)
        {
            obj = this.ExplGlows[i];
            break;
        }
    }

    if(obj==null)
    {
        obj = new CExplGlow(this,this.FXThreads);
        this.ExplGlows.push(obj);
    }
    obj.create(x,y,scale0,scale1,life,fade,alpha,atlas,imgStr,group);

    return obj;
};

CGame.prototype.addExplGlow2 = function(x,y,w,h,life,fade,alpha,atlas,imgStr,group)
{
    var obj = null;
    for(var i=0;i<this.ExplGlows.length;i++)
    {
        if(!this.ExplGlows[i].ActiveFlag)
        {
            obj = this.ExplGlows[i];
            break;
        }
    }

    if(obj==null)
    {
        obj = new CExplGlow(this,this.FXThreads);
        this.ExplGlows.push(obj);
    }
    obj.setScreenSplash(x,y,w,h,life,fade,alpha,atlas,imgStr,group);

    return obj;
};

CGame.prototype.addScorePop = function(x,y,num,freenzy,row,col)
{
    var obj = null;
    for(var i=0;i<this.PopUps.length;i++)
    {
        if(this.PopUps[i].ActiveFlag)
        {
            if(this.PopUps[i].Row==row && this.PopUps[i].Col==col) {
                obj = this.PopUps[i];
                obj.setNumber(num);
                return obj;
            }
        }
    }

    if(freenzy)
        return this.addPopUp(x,y,0,num,0.8,0xFFFFFF,0,1);
    else
        return this.addPopUp(x,y,0,num,0.3,0xFFFFAA,0,0.7);// 0x333311
};

CGame.prototype.addPopUp = function(x,y,type,num,alpha,tint,pause,scale)
{
    var obj = null;
    for(var i=0;i<this.PopUps.length;i++)
    {
        if(!this.PopUps[i].ActiveFlag)
        {
            obj = this.PopUps[i];
            break;
        }
    }

    if(obj==null)
    {
        obj = new CPopNum(this,this.MenuGroup,this.FXThreads);
        this.PopUps.push(obj);
    }
    //x,y,type,num,alpha,tint,pause,scale,func,funcContex
    obj.create(x,y,type,num,alpha,tint,pause,scale,null,null);

    return obj;
    //setShortUp = function(add,time)
};

CGame.prototype.addFishFX = function(x,y,base,type,func,funcContex)
{
    var obj = null;
    for(var i=0;i<this.FishFXs.length;i++)
    {
        if(!this.FishFXs[i].ActiveFlag)
        {
            obj = this.FishFXs[i];
            break;
        }
    }

    if(obj==null)
    {
        //papa,group,threads
        obj = new CFishAnimFX(this,this.MenuTopGroup,this.FXThreads);
        this.FishFXs.push(obj);
    }

    obj.create(x,y,0.4,base,type,func,funcContex);
    return obj;
};

/*
CGame.prototype.addAnimImg = function(x,y,atlas,frame,group)
{
    var obj = null;
    for(var i=0;i<this.Anims.length;i++)
    {
        if(!this.Anims[i].ActiveFlag)
        {
            obj = this.Anims[i];
            break;
        }
    }

    if(obj==null)
    { //
        obj = new CAnimImg(this,this.FXThreads);
        this.Anims.push(obj);
    }

    //x,y,atlas,frame,group)
    obj.create(x,y,atlas,frame,group);
    return obj;
}; */

CGame.prototype.addDustParticle = function(x,y,type,time,speedx,speedy,alpha)
{
    var obj = null;
    for(var i=0;i<this.Dust.length;i++)
    {
        if(!this.Dust[i].ActiveFlag)
        {
            obj = this.Dust[i];
            break;
        }
    }

    if(obj==null)
    { //
        obj = new CDustParticle(this,this.FXThreads);
        this.Dust.push(obj);
    }

    //(x,y,time,speed,imgStr,group,alpha)
    obj.create(x,y,type,time,speedx,speedy,this.StaticGroup,alpha);
    return obj;
};

CGame.prototype.addExplParticle = function(x,y,pic,type,time,speedx,speedy,ang,rot,group)
{
    var obj = null;
    for(var i=0;i<this.ExplParts.length;i++)
    {
        if(!this.ExplParts[i].ActiveFlag)
        {
            obj = this.ExplParts[i];
            break;
        }
    }

    if(obj==null)
    { //
        obj = new CExplParticle(this,this.FXThreads);
        this.ExplParts.push(obj);
    }

    //x,y,pic,type,life,speedx,speedy,ang,rot,group)
    obj.create(x,y,pic,type,time,speedx,speedy,ang,rot,group);
    return obj;
};


CGame.prototype.OnDown = function(pnt)
{
    //if(!this.TouchAllowFlag) return;

   /* var text = this.game.add.text(100, 300, 'Counter: 0',
        { font: "64px FontVector", fill: "#ffffff", align: "center" });
    this.MenuGroup.add(text); */

   // this.makeShoutOut(0);

    this.Xm = pnt.x/Base.Scale - (Base.WidthGame/Base.Scale - Base.Width)/2;
    this.Ym = pnt.y/Base.Scale;

 //   this.game.camera.setPosition(10*Math.random(),10*Math.random());
 //   this.game.camera.update();

  //  this.Shake.create([2,1],50,1);

   // this.addPopUp(this.Xm,this.Ym,0,3456,0.4,0x333311,0);

   // if(this.Xm<100) this.setFreenzyScreen();
  //  if(this.Xm>500) this.OffFreenzyScreen();

    if(this.PauseFlag) {

        return;
    }

  //  this.game.camera.shake(0.005, 500);

  //  this.game.camera.setPosition(this.game.camera.x+10, this.game.camera.y+20);

  /*  console.log("xc "+Base.Xc);
    console.log("xs "+(Base.Xc/Base.Scale));
    console.log("xm "+this.Xm);
    console.log("ym "+this.Ym);*/

    if(this.Ym>this.Y_booster) {
        this.DownPanel.OnClick(this.Xm,this.Ym );
        return;
    }

    if(this.Ym>this.Y_field)  {
        this.Field.OnClick(this.Xm,this.Ym);
    }
};

CGame.prototype.getID = function()
{
    this.IDCntr++;
    return this.IDCntr-1;
};


CGame.prototype.Close = function()
{
 //   this.BaseGroup.exists = false;
 //   this.BaseGroup.visible = false;
    this.ActiveFlag = false;
    this.Papa.removeThread(this);
};

CGame.prototype.getNoFrameImg = function(x,y,tex,group,order) {
    var img = null;
    for (var i = 0; i < group.children.length; i++)
    {
        if (group.children[i].alive === false &&
            (group.children[i] instanceof Phaser.Image) &&
            (group.children[i].type==Phaser.IMAGE))
        {
            img = group.children[i];
            break;
        }
    }

    if (img == null) {
        img = this.game.make.image(x, y, tex, null);
        group.add(img);
    }
    else {
        img.revive();
        img.x = x;
        img.y = y;
        if(img.key!=tex)
           img.loadTexture(tex);
    }

    img.Order = order;
    //  group.sort('Order',-1);
    return img;
};

//text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0',
//    { font: "64px Arial", fill: "#ffffff", align: "center" });
//text.anchor.setTo(0.5, 0.5);
/*
this.tf = new Phaser.Text(this.game, 0, 0, 'text');
this.tf.font = 'VAGzStarBold';
this.tf.fontSize = 70;
this.tf.anchor.set(0.5);
this.dummy.addChild(this.tf); */

CGame.prototype.getText = function(x,y,font,size,color,str,group) {

    var text = new Phaser.Text(this.game, 0, 0, 'text');
    text.font = font;
    text.fontSize = size;
    text.fill = color;
    text.anchor.set(0.5);
    group.add(text);
    text.Order = 0;
    return text;
};

CGame.prototype.getImg = function(x,y,tex,frameName,group,order) {
    var img = null;
    for (var i = 0; i < group.children.length; i++)
    {
        if (group.children[i].alive === false &&
            (group.children[i] instanceof Phaser.Image) &&
            (group.children[i].type==Phaser.IMAGE) &&
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

    img.Order = order;
    //  group.sort('Order',-1);
    return img;
};

CGame.prototype.getZeroImg = function(x,y,tex,frameName,group) {

    var img = this.getImg(x,y,tex,frameName,group,0);
    img.alpha = 1;
    img.rotation = 0;
    img.scale.set(1);
    img.anchor.set(0.5);
    return img;
};

CGame.prototype.getBitmapText = function(x,y,font,str,size,group) {
    var text = null;
    for (var i = 0; i < group.children.length; i++)
    {
        if (group.children[i].alive === false &&
            (group.children[i] instanceof Phaser.BitmapText) &&
            (group.children[i].type==Phaser.BITMAPTEXT) &&
            (group.children[i].key===font))
        {
            text = group.children[i];
            break;
        }
    }

    if (text == null) {
        text = this.game.make.bitmapText(x, y, font, str,size);
        text.anchor.set(0.5);
        group.add(text);
    }
    else {
        img.revive();
        text.x = x;
        text.y = y;
        text.alpha = 1;
        text.rotation = 0;
        text.fontSize = font;
        text.anchor.set(0.5);
        text.setText(str);
    }

    text.tint = 0xffffff;
    text.Order = 0;
    //  group.sort('Order',-1);
    return text;
};

CGame.prototype.getButton = function(x,y,tex,frames,callback,callbackContext,group ) {
    var butt = null;
    for (var i = 0; i < group.children.length; i++)
    {
        if (group.children[i].alive === false &&
            (group.children[i] instanceof Phaser.Button) &&
            (group.children[i].type==Phaser.BUTTON) &&
            (group.children[i].key===tex))
        {
            butt = group.children[i];
            break;
        }
    }

   // x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame

    if (butt == null) {
        butt = this.game.make.button(x, y, tex,callback,callbackContext,
            frames[0],frames[1],frames[2],frames[3]);
        group.add(butt);
    }
    else {
        butt.revive();
        butt.x = x;
        butt.y = y;
        butt.setFrames(frames[0],frames[1],frames[2],frames[3]);
        butt.onInputUp.removeAll();
        butt.onInputUp.add(callback, callbackContext);
    }

    butt.Order = 0;
    //  group.sort('Order',-1);
    return butt;
};

CGame.prototype.makeConfeti  = function(xc,yc) {

    // addExplGlow = function(x,y,scale0,scale1,life,fade,alpha,atlas,imgStr,group)
  //  this.addExplGlow(xc,yc,0.5,2,0.1,0.2,0.3,'atlas','ring1.png',this.Group);

    var lastFrame = -1;
    var num = 8;
    var speed0 = 1000;
    var speedRnd = 400;
    for(var i=0;i<3;i++) {

        var ang0 = i*(Math.PI/num)/2;
        var ang = ang0;
        var angStep = 2*Math.PI/num;

        for(var k=0;k<num;k++) {
            var frame =  Math.floor(Math.random()*this.ConfFrames.length);
            if(frame==lastFrame) frame++; if(frame>=this.ConfFrames.length) frame = 0;
            var speed = speed0 + speedRnd*Math.random();
            var rot = Math.PI/10 +  Math.random()*Math.PI/8;
            if(Math.random()>0.5) rot = -rot;
            //x,y,pic,type,life,speedx,speedy,ang,rot,group)
            var part = this.addExplParticle(xc+10*Math.cos(ang),yc+10*Math.sin(ang),
                this.ConfFrames[frame],0,0.5+0.2*Math.random(),speed*Math.cos(ang),
                speed*Math.sin(ang),Math.PI*Math.random(),rot,this.MenuGroup);
            part.setGravity(40);
            ang0 += angStep;
            ang = ang0 + 0.3*angStep*Math.random();
        }
        num -= 2;
        speed0 -= 250;
    }
};

CGame.prototype.update = function() {

    this.Tweens.update();

    this.FXThreads.update();

    if (this.PauseFlag)  return;

    this.LevelThreads.update();

//    this.Xm = this.game.input.x / Base.Scale;
 //   this.Ym = this.game.input.y / Base.Scale;

 /*   if(this.KillsIndex>0)
    {
        for(var i=0;i<this.KillsIndex;i++)
        {
            this.Kills[i].kill();
        }
        this.KillsIndex = 0;
    } */

};