import SpriteGL, {SpriteRenderer} from "SpriteGL";
import {
    CharacterMessageComponent,
    Componenets,
    HealthComponent,
    PositionComponent, RenderMapComponent,
    SpriteComponent
} from "../BasicComponents";
import {config} from "../Init";
import {ISystem} from "../Game";
import {Events, World} from "../World";
import {Vector2D} from "../Interchange/DataStructures";

export class RenderingSystem implements ISystem {
    private renderer: SpriteRenderer;
    private mapsToRender = new Array<{ position: PositionComponent; map: RenderMapComponent; }>();
    private dmgTxtList = new Array<{ txtObj; position: Vector2D, lifeTime: number }>();
    private resized = false;
    private canvas: HTMLCanvasElement;
    private sprites;
    private layer: number;
    private renderPlayer: boolean;

    private map = {
        tiles: [],
    };

    constructor(canvas: HTMLCanvasElement, textureAtlas: HTMLImageElement, layer = 0) {
        this.renderer = SpriteGL.SpriteRenderer.fromCanvas(canvas, textureAtlas);
        this.canvas = canvas;
        this.sprites = textureAtlas;
        this.layer = layer;
        this.renderPlayer = this.layer == 0 ? true : false;

        this.renderer.ChangeBGColor({ r: 0, g: 0, b: 0, a: 0.0 });
    }

    ReGenerate() {
        this.renderer = SpriteGL.SpriteRenderer.fromCanvas(this.canvas, this.sprites);
    }

    Process(world: World) {
        var gameObjList = world.entityList;
        for (var i = 0; i < gameObjList.length; i++) {
            if ((gameObjList[i].ComponentSygnature & Componenets.Position) !== Componenets.Position) continue;
            var positionComponent = <PositionComponent> gameObjList[i].ComponentList[Componenets.Position];

            if (this.renderPlayer) {
                var spriteComponent = <SpriteComponent> gameObjList[i].ComponentList[Componenets.Sprite];
                if (spriteComponent) {
                    var pos = {
                        x: positionComponent.PixelPosition.x + spriteComponent.SpriteOnTilePos.x,
                        y: positionComponent.PixelPosition.y + spriteComponent.SpriteOnTilePos.y
                    }
                    this.DrawSprite(spriteComponent.RenderingSprite, pos.x, pos.y);

                    var chMsg = <CharacterMessageComponent>gameObjList[i].ComponentList[Componenets.CharacterMessage];
                    if (chMsg) {

                        if (!chMsg.TextObj || chMsg.TextObj.str !== chMsg.Str) {
                            this.renderer.DisposeTxt(chMsg.TextObj);
                            chMsg.TextObj = this.renderer.PrepareTxt(chMsg.Str, "Yellow", 14, true);

                        }

                        this.renderer.DrawTxt(chMsg.TextObj, (pos.x - chMsg.TextObj.Size.Width / 2) + 10, pos.y - 23);
                    }

                    var healthComponent = <HealthComponent>gameObjList[i].ComponentList[Componenets.Health];
                    if (healthComponent) {
                        this.renderer.SetHight(0.001);
                        this.DrawHealthBar(healthComponent.HP / healthComponent.MaxHP, pos.x, pos.y - 6);
                        this.renderer.SetHight(0.0);

                        if (healthComponent.IsTargeted) {
                            this.DrawSprite(99, positionComponent.PixelPosition.x, positionComponent.PixelPosition.y);
                        }
                    }

                    continue;
                }
            }

            var mapComponent = gameObjList[i].ComponentList[Componenets.RenderMap];
            if (mapComponent) {
                this.mapsToRender.push({ position: positionComponent, map: <any> mapComponent });
                continue;
            }
        }

        var txts = world.GetEventByType(Events.TxtSpawn);

        for (var i = 0; i < txts.length; i++) {
            var posComp = <PositionComponent>txts[i].Subject.ComponentList[Componenets.Position];

            var txtObj = this.renderer.PrepareTxt(txts[i].Payload.Str, txts[i].Payload.Color, 11, true);
            this.dmgTxtList.push({
                txtObj: txtObj, position: {
                    x: posComp.PixelPosition.x, y: posComp.PixelPosition.y - 25
                }, lifeTime: 0
            });

        }

        this.renderer.SetHight(0.001);
        for (var i = 0; i < this.dmgTxtList.length; i++) {
            this.renderer.DrawTxt(this.dmgTxtList[i].txtObj, this.dmgTxtList[i].position.x, this.dmgTxtList[i].position.y);
            this.dmgTxtList[i].position.y -= 10 / world.FPS;
            this.dmgTxtList[i].lifeTime += 1 / world.FPS;
            if (this.dmgTxtList[i].lifeTime > 1) {
                var txtObjToDispose = this.dmgTxtList.splice(i, 1)[0].txtObj;
                this.renderer.DisposeTxt(txtObjToDispose);
                i--;
            }
        }
        this.renderer.SetHight(0);
    }

    RenderAll(cameraList: Array<Vector2D>) {

        if (this.resized) {
            cameraList = [];
            cameraList.push({ x: 55 * config.TileSize, y: 55 * config.TileSize });
            this.resized = false;
        }

        if (cameraList.length === 0) {
            cameraList.push({ x: 55 * config.TileSize, y: 55 * config.TileSize });
        }

        if (this.mapsToRender.length !== 0) {
            this.DrawMap(cameraList[0], this.mapsToRender[0].position.PixelPosition, this.mapsToRender[0].map.Tiles);
        }
        this.mapsToRender = [];
        this.renderer.UpdateCamera(cameraList[0].x | 0, cameraList[0].y | 0);
        this.renderer.RenderAll();
    }

    private DrawSprite(index: number, posx: number, posy: number) {
        this.renderer.DrawSpr((index % 32) * 32, ((index / 32) | 0) * 32, 32, 32, posx, posy, config.TileSize, config.TileSize);
    }

    private DrawHealthBar(fraction: number, posx: number, posy: number) {
        if (fraction > 0.90) { this.renderer.DrawSpr(129, 386, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.75) { this.renderer.DrawSpr(129, 391, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.60) { this.renderer.DrawSpr(129, 396, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.45) { this.renderer.DrawSpr(129, 401, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.35) { this.renderer.DrawSpr(161, 386, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.20) { this.renderer.DrawSpr(161, 391, 26, 4, posx, posy, 26, 4); return; }
        if (fraction > 0.10) { this.renderer.DrawSpr(161, 396, 26, 4, posx, posy, 26, 4); return; }
        this.renderer.DrawSpr(161, 401, 26, 4, posx, posy, 26, 4);
    }

    private DrawMap(cameraPos, mapPos: Vector2D, tileMap: number[]) {
        
        this.renderer.SetHight(-0.0001);

        let tilesToRender = [];
        
        const halfXSize = 30; // Since 20x20 is the total size, half is 10 to get the radius
        const halfYSize = 15;

        // Calculate the bounds of the square
        const leftBound = cameraPos.xx - halfXSize;
        const rightBound = cameraPos.xx + halfXSize;
        const topBound = cameraPos.yy - halfYSize;
        const bottomBound = cameraPos.yy + halfYSize;

        // Now filter the tiles to get only those within the square
        tilesToRender = this.map.tiles.filter((tile) => {
          return (
            tile.x >= leftBound &&
            tile.x <= rightBound &&
            tile.y >= topBound &&
            tile.y <= bottomBound
          );
        });

        tilesToRender.map((tile) => {
            this.renderer.DrawSpr((tile.tile_type % 32) * 32, ((tile.tile_type / 32) | 0) * 32, 32, 32, tile.x * config.TileSize, tile.y * config.TileSize, config.TileSize, config.TileSize);
        });

        this.renderer.SetHight(0.0);
        this.renderer.ChangeBGColor({ r: 0, g: 0, b: 0, a: 0.0 });
    }

    UpdateMapTiles(map) {
        this.map = map;
        this.renderer.ChangeBGColor({ r: 0, g: 0, b: 0, a: 0.0 });
    }

    EnablePlayerHover(toggle) {
        this.renderPlayer = toggle;
    }

    RisizedWindow() {
        this.ReGenerate();
    }
}
