
var Base = {
	HiScore: 0,
	SoundFlag: true,
	MusicFlag: true,
	//MuteFlag: false,
	FullscreenFlag: false,
	DecktopFlag: false,
	Lang:'en',
	LangIndex:0,
	LangScale:1,
	Saves:null,
	//sgSettings.config.env.locale
	NoInterAdFlag:true,
	RewardAdFlag:true,

	GamesPlayed: 0,
	Score: 0,
	Coins: 0,
	BoostersPrice: [20,25,30],

	PriceContinue: 40,
	VideoCoins: 50,
	VideoFlag: true,

	Y_bott: 773,
	Y_dead: 663,

	HelpFlag: true,

	FreezeFlag:false,

	EditModeFlag: true, // !!!

	MobileFlag: false,
	NoUpSoundFlag: false,
	NoLocalStorageFlag: false,

	PI2: Math.PI*2,

	BottomUp: 0, // up after scaling in mobile mode

	Xc: 0,
	Yc: 0,

    X_sound: 0,//800-60,
	Y_sound: 0,
	X_cred: 60+80,
	Y_cred: 0,
	X_opt: 60,
	Y_opt: 0,
	X_pause: 60,
	Y_pause: 60,
	Y_diam: 60,


	Fishki:[],

	FishkiTypes: 12,
	GameCols: 5,
	FieldMarg: 50,
	CellDiam: 0,
	Lines: [],
	Prizes: [],
	Numbers: [],
	SinTable: [],
	CosTable: [],
	Statics: [],
	Rains: [],

	RealTimeInt: 1/30,

	Width: 640, // const
	Height: 960, // const

	WidthGame: 0,
	HeightGame: 0,

	WidthWnd: 0,
	HeightWnd: 0, // used to dynamic scaling in desktor browser

	BgAtlasStr: 'atlas',

	Dusts: [],
	Glitter: [],
	GlitterLines: [],
	GlitterPoints: [],

	// SOUNDS
	Sounds: [],

	GamesCount: 0,
	ScaleX : 1,
	ScaleY: 1,
	ScaleSaveX : 1,
	ScaleSaveY: 1,
	UPS: 30,
	FSCntr: 0,
	MarginTopStr: "0px",
	MarginLeftStr: "0px",
	MarginLeftSaveStr: "0px",

	ScalingDoneFlag: false,
	DistOut: 0,

	NeedToChangeOrientFlag: false,

	SndButton: 0,
	SndMerge0: 1,
	SndMerge1: 2,
	SndMerge2: 3,
	SndTrow: 4,
	SndCoin: 5,
	SndWin: 6,
	SndPrize: 7,
	SndAttach: 8,
	SndFrenzy: 9,
	SndLoose: 10,
	SndShake: 11,
	SndWindow: 12,
	SndCount: 13,

	BgImgHeight: 965,
	Scale: 1,//960/1260,
	X0 : 0,  //  Base X0 of render
	BgIndex: 0,
	ChallengesOpen: 1,
	ChallengesNum: 50,

    HCoeff: 1,
	Aspect: 1
};

Base.getSinRaw = function(ang)
{
	if(ang<0) return 0;
	if(ang>=Base.PI2) return 0;
	return Base.SinTable[Math.floor( (Base.SinTable.length -1) *  (ang/(Base.PI2)))];
};

Base.getCosRaw = function(ang)
{
	if(ang<0) return 0;
	if(ang>=Base.PI2) return 0;
	return Base.CosTable[Math.floor( (Base.CosTable.length-1) *  (ang/(Base.PI2)))];
};

Base.clear = function()
{
	Base.SoundFlag = true;
	Base.MusicFlag = true;
	Base.HiScore = 0;
	Base.NeedToChangeOrientFlag = false;
};

Base.firstThings = function()
{
	var ang = 0;
	var angStep = 2*Math.PI/64;
	for(var i=0;i<64;i++)
	{
		Base.SinTable[i] = Math.sin(ang);
		Base.CosTable[i] = Math.cos(ang);
		ang+=angStep;
	}

	Base.FishPads = ['empty1.png','empty2.png','empty3.png','empty4.png',
		'empty5.png','empty6.png','empty7.png','empty8.png','empty9.png',
		'empty10.png','empty11.png','empty1.png','empty2.png','empty3.png','empty4.png',
		'empty5.png','empty6.png','empty7.png','empty8.png','empty9.png',
		'empty10.png','empty11.png','empty1.png','empty2.png','empty3.png','empty4.png',
		'empty5.png','empty6.png','empty7.png','empty8.png','empty9.png',
		'empty10.png','empty11.png'];

	Base.FishNums = ['fish2.png','fish4.png','fish8.png','fish16.png','fish32.png',
		'fish64.png','fish128.png','fish256.png','fish512.png','fish1024.png',
		'fish2048.png','4096.png','8192.png','16384.png','32768.png',
		'65536.png','131072.png','262144.png','524288.png','1048576.png','2097152.png','4194304.png','8388608.png',
		'16777216.png','33554432.png','67108864.png','134217728.png','268435456.png','536870912.png',
		'1073741824.png','2147483648.png','4294967296.png','8589934592.png','17179869184.png',
		'34359738368.png', '68719476736.png','137438953472.png','274877906944.png','549755813888.png'];

	Base.WhiteNums = ['num0.png','num1.png','num2.png','num3.png','num4.png','num5.png',
		'num6.png','num7.png','num8.png','num9.png','numplus.png'];

	Base.Lights = ['light_00.png','light_01.png','light_02.png','light_03.png','light_04.png','light_05.png',
		'light_06.png','light_07.png','light_08.png','light_09.png','light_10.png','light_11.png',
		'light_10.png','light_09.png','light_08.png','light_07.png','light_06.png','light_05.png',
		'light_04.png','light_03.png','light_02.png','light_01.png'];

	Base.FXAnims = [{sx:0,sy:-9,imgs:null},{sx:-6,sy:-1,imgs:null},{sx:-2,sy:-6,imgs:null}];
	Base.FXAnims[0].imgs = this.makeStrSeq('animationOne',18,39,false);
	Base.FXAnims[1].imgs = this.makeStrSeq('animationTwo_',18,44,false);
	Base.FXAnims[2].imgs = this.makeStrSeq('animationThree_',18,44,false);


	Base.Dusts[0] = {speedMin:0.1,atlas:'atlas',scaleDie:0.1,timeFade:0.25,scale0:1,scaleRnd:0.3}; // confeti

	Base.SoundFrames0 = ['sound.png','sound.png','sound.png','sound.png'];
	Base.SoundFrames1 = ['soundoff.png','soundoff.png','soundoff.png','soundoff.png'];

	Base.Numbers[0] = {imgs:['num0.png','num1.png','num2.png','num3.png','num4.png','num5.png',
		'num6.png','num7.png','num8.png','num9.png'],marg:8,atlas:'atlas'};
};


Base.makeStrSeq = function(strbase,num0,num1,loopback) {
	var anim = [];
	for(var i=num0;i<=num1;i++)
	{
		 anim.push(strbase+i+'.png');
	}

	if(loopback)
		for(i=num1-1;i>num0;i--)
			anim.push(anim[i]);

	return anim;
};


Base.makeScreenAdjust = function(game) {

//	if(Backet.MobileFlag)  return;

	Base.WidthWnd = window.innerWidth;
	Base.HeightWnd = window.innerHeight;

//	console.log("wnd "+Base.WidthWnd+"  "+Base.HeightWnd);

	if((window.innerHeight/window.innerWidth)>(Base.Height/Base.Width))
	{
		// screen is tall so need to change
		// make size by width
	 	game.scale.setGameSize(Base.Width, Base.Width * (Base.HeightWnd / Base.WidthWnd));
		Base.ScaleX = window.innerWidth / (game.width);
	}
	else
	{
		// set by height
		game.scale.setGameSize(Base.Height*( Base.WidthWnd/Base.HeightWnd), Base.Height);
		Base.ScaleX = window.innerHeight / (game.height);
	}


	Base.ScaleY = Base.ScaleX ;
	Base.ScaleSaveX = Base.ScaleX;
	Base.ScaleSaveY = Base.ScaleY;
	game.scale.setUserScale(Base.ScaleX, Base.ScaleY);

	//Base.HCoeff = (Base.Width * (Base.HeightWnd / Base.WidthWnd))/Base.Height;
//	Base.Aspect =  game.width/game.height;

	Base.WidthGame = game.width;
	Base.HeightGame = game.height;

	//console.log("game "+Base.WidthGame+"  "+Base.HeightGame);

	Base.Xc = game.width/2;
	Base.Yc = game.height/2;

	var state = game.state.getCurrentState(); // Boot,  Preloader,  Game
	if(state!=null)  state.AdjustSize();

};


Base.Boot = function(game) {};

Base.Boot.prototype = {
    preload: function() {
	//	this.load.crossOrigin =  'anonymous';
		this.load.atlas('loaderatlas', 'images/load.png', 'images/load.json');
	//	this.load.image('logo', 'images/logo.png');
    },

	AdjustSize: function() {
		// BASE FUNCTION
	},

    create: function() {
     	this.stage.backgroundColor = '#7b4121';

        this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;

		Base.ScaleY = 1;
		Base.ScaleX = 1;


		Base.Width = 640;//  constant
		Base.Height = 960;// constant
		Base.Scale = this.game.height/Base.Height;

		this.game.time.advancedTiming = true;
		this.game.time.desiredFps = 45;

		var desktop = this.game.device.desktop;
		if(this.game.device.android) desktop = false;
		if(this.game.device.iOS) {
			desktop = false;
			//Spiky.NoLocalStorageFlag = true;
		}
		Base.DecktopFlag = desktop;

	//	Base.NoLocalStorageFlag = false;
		//if(!this.game.device.localStorage)
		//	Base.NoLocalStorageFlag = true;

		Base.Lang = sgSettings.config.env.locale;
		Base.RewardAdFlag = sgSettings.config.rewarded.enabled;
		 //          0     1     2     3      4     5     6     7    8     9     10    11    12    13    14
		var lang = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'tr', 'nl', 'pl', 'vi', 'hi', 'pt-br', 'th', 'ja'];

		//#####################  TEMP.  GET LANGUAGE FROM URL ######################
		var params = getAllUrlParams(window.location.href);
		if(params.l!=undefined) {
			for(i=0;i<lang.length;i++) {
				if(params.l==lang[i]) {
					Base.Lang = lang[i];
				}
			}
		}
		//########################################################################

 	  //  Base.Lang = 'ru'; // TEMP

		Base.LangParams = [];
		for(i=0;i<lang.length;i++) {
			Base.LangParams.push({h_frenzy:36,scale:1,y_frenzy:0});
		}
		Base.LangParams[0].scale = 1.1; // en
		Base.LangParams[0].h_frenzy = 38; // en
		Base.LangParams[3].h_frenzy = 38; // fr
		Base.LangParams[3].h_frenzy = 38; // it
		Base.LangParams[8].h_frenzy = 35; // nl
		Base.LangParams[9].h_frenzy = 32; // vi

		Base.LangParams[10].scale = 1.4; // hi
		Base.LangParams[12].scale = 1.4; // th
		Base.LangParams[13].scale = 1.5; // jp

		var nomatch = true;
		for(var i=0;i<lang.length;i++) {
			if(lang[i]==Base.Lang) {
				nomatch = false;
				Base.LangIndex = i;
			}
		}

		if(nomatch)  Base.Lang = 'en';

		//var visualBounds = Phaser.DOM.visualBounds;

		if (desktop)
		{
			Base.MobileFlag = false;
			this.stage.disableVisibilityChange = true;

			this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

		//	this.game.scale.setGameSize(this.game.width, this.game.height-150); //###

			Base.makeScreenAdjust(this.game);

			/*var shift = 200;
			if(window.innerWidth>window.innerHeight)
			{
				this.game.scale.setGameSize(Base.Width, Base.Height-shift); //###
				var scl =  window.innerHeight/(this.game.height);
				Base.HCoeff = (Base.Height-shift)/Base.Height;
				Base.WidthWnd = window.innerWidth;//visualBounds.width;
				Base.HeightWnd = window.innerHeight;//visualBounds.height;
				Base.ScaleX = scl;//visualBounds.height/this.scale.game.height;
				Base.ScaleY = scl;//Shifter.ScaleX;
				Base.ScaleSaveX = Base.ScaleX;
				Base.ScaleSaveY = Base.ScaleY;
				this.scale.setUserScale(Base.ScaleX,Base.ScaleY);
				Base.Aspect =  this.game.width/this.game.height;
			}
			else
			{
				// iframe case

			} */
		}
		else {
			Base.MobileFlag = true;

			this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

			Base.makeScreenAdjust(this.game);
		}
		//this.state.getCurrentState(); // Boot,  Preloader,  Game

        this.state.start('Preloader');


    }
};


function getAllUrlParams(url) {

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
			if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {

				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];

				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
					// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				} else {
					// otherwise add the value to the end of the array
					obj[key].push(paramValue);
				}
			} else {
				// we're dealing with a string
				if (!obj[paramName]) {
					// if it doesn't exist, create property
					obj[paramName] = paramValue;
				} else if (obj[paramName] && typeof obj[paramName] === 'string'){
					// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				} else {
					// otherwise add the property
					obj[paramName].push(paramValue);
				}
			}
		}
	}

	return obj;
}
