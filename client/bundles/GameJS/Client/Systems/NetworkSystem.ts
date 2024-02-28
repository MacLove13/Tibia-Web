import * as io from 'socket.io-client';
import {
    CameraComponent,
    CharacterAnimationComponent, CharacterMessageComponent,
    Componenets,
    HealthComponent,
    InputComponent,
    MovementComponent,
    PositionComponent, SimpleAnimationComponent,
    SpriteComponent
} from "../BasicComponents";
import {config, Init} from "../Init";
import {GameObj} from "../GameObj";
import {Events, World} from "../World";
import {NewCharacterData, Rotation, MoveData} from "../Interchange/DataStructures";

export class NetworkSystem {
    private socket: io.Socket;
    private newEntityList = [];
    private EntityToRemove = [];
    private entityToModification = new Array< { ID; Type; Data; }>();
    private renderingSystem = [];
    private Initialized = false;

    connect(auth: string) {
        const url = 'http://192.99.177.163:2137';

        // this.socket = io.io(url)
        this.socket = io.io(url);

        // {
        //     withCredentials: true
        // });

        this.socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        this.socket.on('connect_timeout', (timeout) => {
            console.error('Conexão expirou após', timeout);
        });

        this.socket.on('error', (error) => {
            console.error('Erro no Socket.IO:', error);
        });

        this.socket.emit("onPlayerConnect", {
            Auth: auth
        });

        this.Setup();
    }

    SetRenderingSystem(layer, renderingSystem) {
        this.renderingSystem[layer] = renderingSystem;
    }

    Process(world: World) {
        for (var i = 0; i < this.newEntityList.length; i++) {
            world.Add(this.newEntityList[i]);
        }
     
        for (var i = 0; i < this.EntityToRemove.length; i++) {
            
            var removed = world.RemoveEntity(this.EntityToRemove[i]);
            if (removed && removed.ComponentList[Componenets.Camera]) {
                removed.ComponentList[Componenets.Sprite] = null;
                removed.ComponentList[Componenets.CharacterAnimation] = null;
                removed.ComponentList[Componenets.Health] = null;
                (<InputComponent>removed.ComponentList[Componenets.Input]).IsAlive = false;
                (<MovementComponent>removed.ComponentList[Componenets.Movement]).Speed = 1000;
                world.Add(removed);
            }
        }

        this.ProcessEvents(world);
        this.ModifyEntities(world);

        this.cleanup();
    }

    GetSocket() {
        return this.socket;
    }

    EmitServer(eventName: string, payload: any) {
        this.socket.emit(eventName, payload);
    }

    private Setup() {
        this.socket.on("NewCharacters", (data: NewCharacterData[]) => {
            for (var i = 0; i < data.length; i++) {

                console.log("AliveSprites")
                console.log(data[i].Race)
                console.log(config.Mobs[data[i].Race].AliveSprites[0])

                var gameObj = new GameObj();
                gameObj.ID = data[i].ID;
                gameObj.AddComponent(new PositionComponent(data[i].Position.x, data[i].Position.y, Rotation.Down));
                gameObj.AddComponent(new MovementComponent(data[i].Speed));
                gameObj.AddComponent(new HealthComponent(data[i].HP, data[i].MaxHP));
                gameObj.AddComponent(new SpriteComponent(config.Mobs[data[i].Race].AliveSprites[0], { x: -10, y: -10 }));
                gameObj.AddComponent(new CharacterAnimationComponent(config.Mobs[data[i].Race].AliveSprites, 5));
                this.newEntityList.push(gameObj);

                var animation = new GameObj();
                animation.ID = Math.random();
                animation.AddComponent(new PositionComponent(data[i].Position.x, data[i].Position.y));
                animation.AddComponent(new SpriteComponent(config.Animations.Beam.Sprites[0]));
                animation.AddComponent(new SimpleAnimationComponent(config.Animations.Beam.Sprites, false, 4));
                this.newEntityList.push(animation);
            }
        });

        this.socket.on("PlayerStart", (data: NewCharacterData) => {
            var gameObj = new GameObj();
            gameObj.ID = data.ID;


            console.log("AliveSprites")
            console.log(config.Mobs[data.Race].AliveSprites)

            gameObj.AddComponent(new PositionComponent(data.Position.x, data.Position.y, Rotation.Down));
            gameObj.AddComponent(new MovementComponent(data.Speed));
            gameObj.AddComponent(new CharacterAnimationComponent(config.Mobs[data.Race].AliveSprites, 5));
            gameObj.AddComponent(new SpriteComponent(config.Mobs[data.Race].AliveSprites[0], { x: -10, y: -10 }));
            var input = new InputComponent();
            input.Level = data.Level;
            gameObj.AddComponent(input);
            gameObj.AddComponent(new HealthComponent(data.HP, data.MaxHP));
            gameObj.AddComponent(new CameraComponent());
            this.newEntityList.push(gameObj);
            console.log("Vocé é um " + data.UClass);
        });

        this.socket.on("Game:UpdateMap", (data: any) => {
            this.renderingSystem[data.Layer].UpdateMapTiles(data.Map);
        })

        this.socket.on("map:HoverYTile", (data: any) => {
            this.renderingSystem[1].EnablePlayerHover(data.Toggle);
        })

        this.socket.on("CharacterMessage", (data: { Msg: string, ID }) => {
            this.entityToModification.push({ ID: data.ID, Type: ModType.Message, Data: data.Msg });
        });

        this.socket.on("CharacterMove", (data: { ID; Data: MoveData }) => {
            this.entityToModification.push({ ID: data.ID, Type: ModType.Move, Data: data.Data });
        });

        this.socket.on("CharacterTeleport", (data: { ID; Data: MoveData }) => {
            this.entityToModification.push({ ID: data.ID, Type: ModType.Teleport, Data: data.Data });
        });

        this.socket.on("ApplyDamage", (data: { AttackType: number; AttarckerID; TargetID; HitPoints: number }) => {
            this.entityToModification.push({ ID: data.TargetID, Type: ModType.Hit, Data: data.HitPoints });
        });

        this.socket.on("SelfHeal", (data: { TargetID; Health; }) => {
            console.log(data)
            this.entityToModification.push({ ID: data.TargetID, Type: ModType.Heal, Data: data.Health });
        });

        this.socket.on("ApplyExperience", (data: { ID; Exp: number }) => {
            this.entityToModification.push({ ID: data.ID, Type: ModType.Exp, Data: data });
        });

        this.socket.on("SpawnProjectile", (data) => {
            var gameObj = new GameObj();
            gameObj.ID = Math.random();
            gameObj.AddComponent(new PositionComponent(data.StartPos.x, data.StartPos.y, Rotation.Down));
            var movementComponet = new MovementComponent();
            movementComponet.RemoveOnDone = true;
            movementComponet.SetTarget(data.TargetPos.x, data.TargetPos.y);
            movementComponet.Speed = 1000;
            gameObj.AddComponent(movementComponet);
            gameObj.AddComponent(new SpriteComponent(44));
            this.newEntityList.push(gameObj);
        });

        this.socket.on("Animation", (data) => {
            var gameObj = new GameObj();
            gameObj.ID = Math.random();
            gameObj.AddComponent(new PositionComponent(data.Pos.x, data.Pos.y));
            gameObj.AddComponent(new SimpleAnimationComponent(data.Sprites, false, data.TicksPerFrame));
            gameObj.AddComponent(new SpriteComponent(data.Sprites[0]));
            this.newEntityList.push(gameObj);
        });

        this.socket.on("DeleteCharacters", (data: any[]) => {
           
            for (var i = 0; i < data.length; i++) {
                this.EntityToRemove.push(data[i]);
            }
        });

        this.socket.on("SetMainBackpack", (data: { image: string; slots: number; uuid: string; item_template: { Name: string; Attack: number; } }) => {
            // console.log(data);
        });
    }

    private ProcessEvents(world: World) {
        var plrMoveEventList = world.GetEventByType(Events.PlayerMove);
        plrMoveEventList.forEach((value) => {
            for (var i = 0; i < plrMoveEventList.length; i++) {
                this.socket.emit("PlayerMove", plrMoveEventList[i].Payload);
            }
        });

        var msgEventList = world.GetEventByType(Events.PlayerMessage);
        for (var i = 0; i < msgEventList.length; i++) {
            this.socket.emit("PlayerMessage", { Msg: msgEventList[i].Payload });
        }

        var targetEventList = world.GetEventByType(Events.PlayerTarget);
        for (var i = 0; i < targetEventList.length; i++) {
            this.socket.emit("PlayerTarget", targetEventList[i].Payload);
        }

        var healEventList = world.GetEventByType(Events.PlayerSelfHeal);
        for (var i = 0; i < healEventList.length; i++) {
            this.socket.emit("PlayerHeal", healEventList[i].Payload);
        }

        var useItemEventList = world.GetEventByType(Events.UseItem);
        for (var i = 0; i < useItemEventList.length; i++) {
            this.socket.emit("UseItem", useItemEventList[i].Payload);
        }
    }

    private ModifyEntities(world: World) {
        var gameObjList = world.entityList;
        for (var j = 0; j < gameObjList.length; j++) {
            var movement = <MovementComponent>gameObjList[j].ComponentList[Componenets.Movement];
            var position = <PositionComponent>gameObjList[j].ComponentList[Componenets.Position];

            for (var i = 0; i < this.entityToModification.length; i++) {
                if (this.entityToModification[i].ID !== gameObjList[j].ID) continue;

                if (this.entityToModification[i].Type === ModType.Move) {
                    if (!movement) continue;
                    movement.SetTarget(this.entityToModification[i].Data.Pos.x, this.entityToModification[i].Data.Pos.y);
                    position.Rotation = this.entityToModification[i].Data.Rot;
                }

                if (this.entityToModification[i].Type === ModType.Teleport) {
                    if (!movement) continue;
                    movement.IsMoving = false;
                    movement.SetTarget(this.entityToModification[i].Data.Pos.x, this.entityToModification[i].Data.Pos.y);
                    position.SetPosition(this.entityToModification[i].Data.Pos.x, this.entityToModification[i].Data.Pos.y);
                }

                if (this.entityToModification[i].Type === ModType.Message) {
                    var chMsg = <CharacterMessageComponent>gameObjList[j].ComponentList[Componenets.CharacterMessage];
                    if (!chMsg) {
                        gameObjList[j].AddComponent(new CharacterMessageComponent(this.entityToModification[i].Data));
                    } else {
                        chMsg.Str = this.entityToModification[i].Data;
                    }
                }

                if (this.entityToModification[i].Type === ModType.Hit) {
                    var healthComponent = <HealthComponent>gameObjList[j].ComponentList[Componenets.Health];
                    if (healthComponent) {
                        healthComponent.LoseHP(this.entityToModification[i].Data);
                        world.PushEvent(gameObjList[j], Events.TxtSpawn, { Str: this.entityToModification[i].Data.toString(), Color: "Red" });

                    }
                }

                if (this.entityToModification[i].Type === ModType.Heal) {

                    console.log(this.entityToModification[i])
                    var healthComponent = <HealthComponent>gameObjList[j].ComponentList[Componenets.Health];
                    if (healthComponent) {
                        healthComponent.SetHP(this.entityToModification[i].Data);
                        world.PushEvent(gameObjList[j], Events.TxtSpawn, { Str: this.entityToModification[i].Data.toString(), Color: "Red" });
                    }
                }

                if (this.entityToModification[i].Type === ModType.Exp) {
                    var inputComponent = <InputComponent>gameObjList[j].ComponentList[Componenets.Input];
                    if (inputComponent) {
                        world.PushEvent(gameObjList[j], Events.TxtSpawn, { Str: this.entityToModification[i].Data.Exp.toString(), Color: "White" });
                        if (this.entityToModification[i].Data.NextLvl) {
                            inputComponent.Level = this.entityToModification[i].Data.NextLvl;
                            inputComponent.Experience = 0;
                        } else {
                            inputComponent.Experience = this.entityToModification[i].Data.Exp;
                        }
                    }
                }
            }
        }
    }

    private cleanup() {
        this.newEntityList = [];
        this.entityToModification = [];
        this.EntityToRemove = [];
    }
}

const enum ModType { Move, Teleport, Message, Hit, Exp, Heal, Death };
