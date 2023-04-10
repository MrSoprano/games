function startGame() {

  //  console.log('sgSdk.initialize...');

    var game = null;

    sgSdk.initialize( ['basic',  'scoreGame'],
        {
            id: "merge2020",  //mandatory, a unique identifier for your game (e.g. game name).
            build: "1.0.0", //mandatory, game version
            supportedLanguages: ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'tr', 'nl', 'pl'],   //mandatory, a list of supported game languages

            unfreezeGame: function () {

                if(game==null)  return;
                var state = game.state.getCurrentState();
                if(state!=null)  state.unfreezeGame();
            },   //mandatory, unfreeze game and sounds

            freezeGame: function () {
                if(game==null)  return;
                var state = game.state.getCurrentState();
                if(state!=null)  state.freezeGame();
            }, //mandatory, freeze game and sounds

            runGame: function () {
                if(game==null)  return;
                var state = game.state.getCurrentState();
                if(state!=null)  state.runGame();
            },    ///mandatory, start your game here (e.g. go to main menu)

            getScore: function () {
                if(game==null)  return 0;
                var state = game.state.getCurrentState();
                if(state!=null)  return state.getScore();
                return 0;
            },   //module:scoreGame, return the current game score (Number)

            startOver: function () {
                if(game==null)  return;
                var state = game.state.getCurrentState();
                if(state!=null)  state.startOver();
            },  //module:scoreGame, a function that goes to the actual game play directly

            gameAnalyticsKey: "ga-key-here",    //optional, if gameAnalyticsKey and gameAnalyticsSecret are provided, sg-sdk will initialize gameAnalytics
            gameAnalyticsSecret: "ga-secret-here",  //optional (gameAnalytics)
            gameAnalyticsResourceItemTypes: [], //optional (gameAnalytics)
            gameAnalyticsCustomDimensions1: [], //optional (gameAnalytics)
            gameAnalyticsCustomDimensions2: [], //optional (gameAnalytics)
            gameAnalyticsCustomDimensions3: [], //optional (gameAnalytics)
            changeLocale: function (locale) {}, //optional, a function that takes a by the game supported locale and changes the language option of the game

            placementIdInterstitial: "10648386269900xx_10648404669898xx" //optional pre roll ad
        },
      //  sgSettings.commands.freezeGame =

            function (err, settings, sdkHandler) {
        if (err) {
            //handle error here
          //  console.log('init not OK');
        }  else {

         //   console.log('init OK');
            window.sgSettings = settings; //an object contains your commands (settings.commands) and game config (settings.config)
            window.sdkHandler = sdkHandler; //this is the sdk to be used to call events in the game

            var coeff = 1;//960/1260;
            game = new Phaser.Game(Math.abs(coeff*640), Math.abs(coeff*960),
                Phaser.AUTO,'gameContainer'); // 800, 1260
            game.antialias = true;
            game.state.add('Boot', Base.Boot);
            game.state.add('Preloader', Base.Preloader);
            game.state.add('Game', Base.Game);
            game.state.start('Boot');

            //initialize succeeded, the game starting code should be placed here
            //sdkHandler: an object contains methods (on, off, trigger)
            //settings: an object contains your commands (settings.commands) and config (settings.config)
            //start the game here e.g. cc.game.run(), initGame()..etc.
        }
    });
}
