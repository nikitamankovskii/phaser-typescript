import "phaser";

export class GameScene extends Phaser.Scene {
    delta: number;
    lastStarTime: number;
    starsCaught: number;
    starsFallen: number;
    sand: Phaser.Physics.Arcade.StaticGroup;
    fire: any;
    info: Phaser.GameObjects.Text;
    group: any;
    
    constructor() {
        super({
        key: "GameScene"
        });
    }
    init(params: any): void {
        this.delta = 1000;
        this.lastStarTime = 0;
        this.starsCaught = 0;
        this.starsFallen = 0;
    }
    preload(): void {
        this.load.spritesheet('fire', 'assets/fire.png',{ frameWidth: 128, frameHeight: 128});
        this.load.image("star", "assets/star.png");
        //this.load.image("sand", "assets/sand.jpg");
        //player = game.add.sprite(32, game.world.height - 150, 'dude');
 
    }
    
    create(): void {
        
        //Phaser.Actions.PlaceOnLine(this.sand.getChildren(), new Phaser.Geom.Line(20, 580, 820, 580));
        //this.sand.refresh();
        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
        
        //this.fire = this.add.sprite(40, 540, 'fire').setScale(0.8);
        //this.fire = this.add.sprite(120, 540, 'fire').setScale(0.8);
        
        this.anims.create({
          key:'burn',
          frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 64 }),
          frameRate: 20,
          repeat: -1
        });
        this.group = this.add.group();
        this.group.createMultiple({ key: 'fire', frame: 'fire', repeat: 15, setScale: { x: 0.75, y: 0.75 } });
        Phaser.Actions.GridAlign(this.group.getChildren(), {
          width: 20,
          height: 10,
          cellWidth: 50,
          cellHeight: 80,
          x: -15,
          y: 525
        });
        this.anims.staggerPlay('burn', this.group.getChildren(), 1);
        

        
    }
    update(time: number): void {
        var diff: number = time - this.lastStarTime;
        if (diff > this.delta) {
          this.lastStarTime = time;
          if (this.delta > 500) {
            this.delta -= 20;
          }
          this.emitStar();
        }
        this.info.text =
          this.starsCaught + " caught - " +
          this.starsFallen + " fallen (max 3)";
      }
    private onClick(star: Phaser.Physics.Arcade.Image): () => void {
        return function () {
          star.setTint(0x00ff00);
          star.setVelocity(0, 0);
          this.starsCaught += 1;
          this.time.delayedCall(100, function (star) {
            star.destroy();
          }, [star], this);
        }
      }
    private onFall(star: Phaser.Physics.Arcade.Image): () => void {
        return function () {
          star.setTint(0xff0000);
          this.starsFallen += 1;
          this.time.delayedCall(100, function (star) {
            if (this.starsFallen > 2) {
                this.scene.start("ScoreScene", 
                  { starsCaught: this.starsCaught });
              }
          }, [star], this);
        }
      }
    private emitStar(): void {
        var star: Phaser.Physics.Arcade.Image;
        var x = Phaser.Math.Between(25, 775);
        var y = 26;
        star = this.physics.add.image(x, y, "star");
        star.setDisplaySize(50, 50);
        star.setVelocity(0, 200);
        star.setInteractive();

        star.on('pointerdown', this.onClick(star), this);
        console.log(star);
        
        if (star.originY >= 20) {
          this.onFall(star)
        }
        this.physics.add.collider (star, this.group.fire, this.onFall(star), null, this);
      }
  };
