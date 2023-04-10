window.onload = function() {

    var coeff = 1;//960/1260;
    var game = new Phaser.Game(Math.abs(coeff*640), Math.abs(coeff*960),Phaser.AUTO,'gameContainer'); // 800, 1260
    game.antialias = true;
    game.state.add('Boot', Base.Boot);
    game.state.add('Preloader', Base.Preloader);
    game.state.add('Game', Base.Game);
    game.state.start('Boot');
} ;
