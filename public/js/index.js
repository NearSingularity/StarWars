/* global $, Phaser */

$(() => {
    
    const current = new Date().getTime();
    const target = new Date(new Date().getFullYear(), 3, 13);
    const diff = ((+target - +current) / 1000) + 25200;
   
    const clock = $("#countdown").FlipClock(diff, {
        clockFace: 'DailyCounter',
        countdown: true,
        onStart: function() {
            console.log("START")  
        },
        onStop: function() {
            console.log('STOPPED')   
        },
        onInterval: function() {
            console.log('foo')
            clock.getFaceValue();
        }
    });
    
    const timer = setInterval(() => {
        if(clock.getTime().time <= 0) {
            setTimeout(() => window.location = 'http://www.starwars.com/', 1000)
            clearInterval(timer)
        }
    }, 1000)
    
    const play = {
        preload() {
          
        },
        create() {
            this.game.renderer.renderSession.roundPixels = true;
            this.game.stage.disableVisibilityChange = true;
            this.createShader();
        },
        update() {
            this.filter.uniforms.mouse.value.x = 0.5;
            this.filter.uniforms.mouse.value.y = 0.5;
            this.filter.update();
        },
        
        createShader() {
            const fragmentSrc = [
                "precision mediump float;",
                "uniform float     time;",
                "uniform vec2      resolution;",
                "uniform vec2      mouse;",
    
                "const float Tau        = 6.2832;",
                "const float speed  = .02;",
                "const float density    = .04;",
                "const float shape  = .04;",
    
                "float random( vec2 seed ) {",
                    "return fract(sin(seed.x+seed.y*1e3)*1e5);",
                "}",
    
                "float Cell(vec2 coord) {",
                    "vec2 cell = fract(coord) * vec2(.5,2.) - vec2(.0,.5);",
                    "return (1.-length(cell*2.-1.))*step(random(floor(coord)),density)*2.;",
                "}",
    
                "void main( void ) {",
    
                    "vec2 p = gl_FragCoord.xy / resolution  - mouse;",
    
                    "float a = fract(atan(p.x, p.y) / Tau);",
                    "float d = length(p);",
    
                    "vec2 coord = vec2(pow(d, shape), a)*256.;",
                    "vec2 delta = vec2(-time*speed*256., .5);",
                    "//vec2 delta = vec2(-time*speed*256., cos(length(p)*10.)*2e0+time*5e-1); // wavy wavy",
    
                    "float c = 0.;",
                    "for(int i=0; i<3; i++) {",
                        "coord += delta;",
                        "c = max(c, Cell(coord));",
                    "}",
    
                    "gl_FragColor = vec4(c*d);",
                "}"
            ];
    
            this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
            this.filter.setResolution(this.game.width, this.game.height);
    
            let sprite = this.add.sprite();
            sprite.width = this.game.width;
            sprite.height = this.game.height;
    
            sprite.filters = [ this.filter ];
        }
    }

    const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'space', true);
    game.state.add('play', play, true);

});