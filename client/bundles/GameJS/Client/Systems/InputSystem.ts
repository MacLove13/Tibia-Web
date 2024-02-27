import {ISystem} from "../Game";
import {Componenets, HealthComponent, InputComponent, MovementComponent, PositionComponent} from "../BasicComponents";
import {GameObj} from "../GameObj";
import {config} from "../Init";
import {Events, World} from "../World";
import {Rotation, Vector2D} from "../Interchange/DataStructures";

import GameInstance from '../../store/GameInit';

export class InputSystem implements ISystem {
    private keys = new Array<boolean>(200);
    private chatInput = <HTMLInputElement>document.getElementById("ChatInput");
    private canvas: HTMLCanvasElement[] = [];

    private chatMsgs = new Array<string>();
    private mouseClicks = new Array<Vector2D>();
    RequiredSygnature = Componenets.Position + Componenets.Movement + Componenets.Input ;

    constructor() {
        this.Setup();
        this.initCanvas();
    }

    private initCanvas(): void {
        this.canvas[0] = <HTMLCanvasElement> document.getElementById("GameCanvas-layer-0");
        this.canvas[1] = <HTMLCanvasElement> document.getElementById("GameCanvas-layer-1");
    }

    Process(world: World) {
        var gameObjList = world.entityList;
        for (var i = 0; i < gameObjList.length; i++) {

            if ((gameObjList[i].ComponentSygnature & this.RequiredSygnature) !== this.RequiredSygnature) continue;

            this.KeyboardInput(gameObjList[i], world);
            this.CheckChatWindow(gameObjList[i], world);
            this.CheckClick(gameObjList[i], world);
        }

        this.mouseClicks = [];
    }

    private KeyboardInput(gameObj: GameObj, world: World) {
        var movementComponent = <MovementComponent> gameObj.ComponentList[Componenets.Movement];
        var positionComponent = <PositionComponent> gameObj.ComponentList[Componenets.Position];
        var inputSystem = <InputComponent> gameObj.ComponentList[Componenets.Input];
        if (movementComponent.IsMoving) return;

        if (this.keys[37] && this.keys[38]) {
            positionComponent.Rotation = Rotation.Left;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Left,
                Pos: { x: positionComponent.TilePosition.x - 1, y: positionComponent.TilePosition.y - 1 }
            });
            movementComponent.SetTarget(positionComponent.TilePosition.x - 1, positionComponent.TilePosition.y);
            return;
        }
        else if (this.keys[40] && this.keys[39]) {
            positionComponent.Rotation = Rotation.Left;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Left,
                Pos: { x: positionComponent.TilePosition.x - 1, y: positionComponent.TilePosition.y - 1 }
            });
            movementComponent.SetTarget(positionComponent.TilePosition.x - 1, positionComponent.TilePosition.y);
            return;
        }
        else if (this.keys[37]) {
            positionComponent.Rotation = Rotation.Left;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Left,
                Pos: { x: positionComponent.TilePosition.x - 1, y: positionComponent.TilePosition.y }
            });
            movementComponent.SetTarget(positionComponent.TilePosition.x - 1, positionComponent.TilePosition.y);
            return;
        }
        else if (this.keys[38]) {
            positionComponent.Rotation = Rotation.Top;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Top,
                Pos: { x: positionComponent.TilePosition.x, y: positionComponent.TilePosition.y - 1 }
            });

            movementComponent.SetTarget(positionComponent.TilePosition.x, positionComponent.TilePosition.y - 1);
            return;
        }
        else if (this.keys[39]) {
            positionComponent.Rotation = Rotation.Right;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Right,
                Pos: { x: positionComponent.TilePosition.x + 1, y: positionComponent.TilePosition.y }
            });
            movementComponent.SetTarget(positionComponent.TilePosition.x + 1, positionComponent.TilePosition.y);
            return;
        }
        else if (this.keys[40]) {
            positionComponent.Rotation = Rotation.Down;
            if (inputSystem.IsAlive)
            world.PushEvent(gameObj, Events.PlayerMove, {
                Rot: Rotation.Down,
                Pos: { x: positionComponent.TilePosition.x, y: positionComponent.TilePosition.y + 1 }
            });
            movementComponent.SetTarget(positionComponent.TilePosition.x, positionComponent.TilePosition.y + 1);
            return;
        }
    }

    private CheckChatWindow(gameObj: GameObj, world: World) {
        if (this.chatMsgs.length > 0) {
            world.PushEvent(gameObj, Events.PlayerMessage, this.chatMsgs[0]);
            this.chatMsgs = [];
        }
    }

    private CheckClick(gameObj: GameObj, world: World) {
        if ((gameObj.ComponentSygnature & Componenets.Camera) !== Componenets.Camera) return;
        var cameraposcomp = <PositionComponent>gameObj.ComponentList[Componenets.Position];
        for (var i = 0; i < this.mouseClicks.length; i++) {
            var pos = {
                x: this.mouseClicks[i].x + cameraposcomp.PixelPosition.x - this.canvas[0].width / 2,
                y: this.mouseClicks[i].y + cameraposcomp.PixelPosition.y - this.canvas[0].height / 2
            };

            const TILE_SIZE = 32;

            const x = this.mouseClicks[i].x;
            const y = this.mouseClicks[i].y;
            const tileSize = 2 * TILE_SIZE;
            const removeDivisorX = (this.canvas[0].width % TILE_SIZE);
            const removeDivisorY = (this.canvas[0].height % TILE_SIZE);
            
            const left = cameraposcomp.TilePosition.x - Math.round((this.canvas[0].width - removeDivisorX) / tileSize);
            const top = cameraposcomp.TilePosition.y - Math.round((this.canvas[0].height - removeDivisorY) / tileSize);

            const tileX = Math.floor(x / TILE_SIZE) + left;
            const tileY = Math.floor(y / TILE_SIZE) + top;

            // console.log('X: ' + cameraposcomp.TilePosition.x + " Y: " + cameraposcomp.TilePosition.y)
            console.log('X: ', tileX, ' | Y: ', tileY)

            for (var entityIndex = 0; entityIndex < world.entityList.length; entityIndex++) {
                if ((world.entityList[entityIndex].ComponentSygnature & (Componenets.Position + Componenets.Health)) !== (Componenets.Position + Componenets.Health))
                    continue;
                
                if (world.entityList[entityIndex].ID === gameObj.ID) continue;

                var targetPosComp = <PositionComponent>world.entityList[entityIndex].ComponentList[Componenets.Position];
                
                if (targetPosComp.PixelPosition.x - 10 + config.TileSize > pos.x && targetPosComp.PixelPosition.x - 10 < pos.x) {
                    if (targetPosComp.PixelPosition.y - 10 + config.TileSize > pos.y && targetPosComp.PixelPosition.y - 10 < pos.y) {
                        var targeted = (<HealthComponent>world.entityList[entityIndex].ComponentList[Componenets.Health]).IsTargeted;
                        // (<HealthComponent>world.entityList[entityIndex].ComponentList[Componenets.Health]).IsTargeted = !targeted

                        var inputComponent = (< InputComponent > gameObj.ComponentList[Componenets.Input]);
                        if (!targeted) {
                            inputComponent.SetTargetEntity(world.entityList[entityIndex]);
                        } else {
                            inputComponent.FreeTargetedEntity();
                        }

                        world.PushEvent(gameObj, Events.PlayerTarget, { ID: world.entityList[entityIndex].ID, IsTargeting: !targeted });
                        return;
                    }
                }
            }
        }

    }

    private ValidInput() {
        if (this.chatInput) return;
        this.chatInput = <HTMLInputElement>document.getElementById("ChatInput");
    }

    private Setup() {
        addEventListener("keydown", (keyEvent) => {
            this.ValidInput();
            if (keyEvent.keyCode == 8) {
                if (this.chatInput.value.length > 0) {
                    this.chatInput.value = this.chatInput.value.substr(0, this.chatInput.value.length - 1);
                }
                keyEvent.preventDefault();
            }
            if (this.keys[keyEvent.keyCode]) return;
            this.keys[keyEvent.keyCode] = true;
        });

        addEventListener("keyup", (keyEvent) => {
            this.ValidInput();
            this.keys[keyEvent.keyCode] = false;
        });

        // addEventListener("keypress", (keyEvent) => {
        //     this.ValidInput();
        //     var key = keyEvent.keyCode || keyEvent.which;
        //     if (document.activeElement === this.chatInput) {
        //         keyEvent.preventDefault();
        //     }
        //     if (key === 13) {
        //         if (this.chatInput.value[0] == "!") {
        //             console.log("execute command")

        //             let text = this.chatInput.value.substring(1);
        //             let strline = text.split(" ");
        //             let command = strline[0];
        //             let args = strline.slice(1);

        //             GameInstance.init.networkSystem.EmitServer("chat:command:execute", {
        //                 cmd: command,
        //                 args: args
        //             });
        //             return
        //         }

        //         return;
        //         this.chatMsgs.push(this.chatInput.value.substr(0, 55));
        //         this.chatInput.value = "";
        //         return;
        //     }

        //     if (key === 8) return;
        //     if (key > 36 && key < 41) return;
        //     this.chatInput.value += String.fromCharCode(key);
        // });

        const CreateCanvasClick = () => {
            if (this.canvas[0] == undefined) return;
            this.canvas[0].addEventListener("click", (e) => {
                var x;
                var y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                }
                else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                x -= this.canvas[0].offsetLeft;
                y -= this.canvas[0].offsetTop;

                this.mouseClicks.push({ x: x, y: y });

            });
        }

        const CreateCanvasClickLayer1 = () => {
            if (this.canvas[1] == undefined) return;
            this.canvas[1].addEventListener("click", (e) => {
                var x;
                var y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                }
                else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                x -= this.canvas[1].offsetLeft;
                y -= this.canvas[1].offsetTop;

                this.mouseClicks.push({ x: x, y: y });

            });
        }

        if (this.canvas[0] == undefined) {
            var gameCanvasInterval = setInterval(() => {
                this.canvas[0] = <HTMLCanvasElement> document.getElementById("GameCanvas-layer-0");
                this.canvas[1] = <HTMLCanvasElement> document.getElementById("GameCanvas-layer-1");

                if (this.canvas[0] != undefined) {
                    clearInterval(gameCanvasInterval);
                    CreateCanvasClick();
                    CreateCanvasClickLayer1();
                }
            }, 1000)

            return;
        }
    }

}
