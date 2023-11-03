
import {Config} from "./Interchange/DataStructures";
import {RenderingSystem} from "./Systems/RenderingSystem";
import {AnimationSystem} from "./Systems/AnimationSystem";
import {NetworkSystem} from "./Systems/NetworkSystem";
import {UserInterfaceSytem} from "./Systems/UserInterfaceSystem";
import {MovementSystem} from "./Systems/MovementSystem";
import {CameraSystem} from "./Systems/CameraSystem";
import {GameObj} from "./GameObj";
import {PositionComponent, RenderMapComponent} from "./BasicComponents";
import {World, Events} from "./World";
import {GetFPS, loadImage} from "./Misc";
import SpritesURL from "./resources/sprites.png";
import {InputSystem} from "./Systems/InputSystem";

export var config: Config;

export class Init {
  world: World;
  private inputSystem: InputSystem;
  gameObj: GameObj;
  events;
  enemies;
  networkSystem: NetworkSystem;
  renderSystem: RenderingSystem;
  renderSystemLayer1: RenderingSystem;

  constructor() {
    this.world = new World();
    this.inputSystem = new InputSystem();
    this.gameObj = new GameObj();
    this.events = Events;
    this.enemies = [];

    this.networkSystem = new NetworkSystem();
  }

  Process(auth: string, setIsInitializedAll) {
    var renderingSystem: RenderingSystem;
    var renderingSystemLayer1: RenderingSystem;

    var cameraSystem = new CameraSystem();
    
    var movmentSystem = new MovementSystem();
    var userInterfaceSystem = new UserInterfaceSytem();
    var characterAnimationSystem = new AnimationSystem();

    const configPromise = import("./resources/data.json");
    const spritePromise = loadImage(SpritesURL);

    Promise.all([configPromise, spritePromise])
      .then(([configData, sprites]) => {
        config = configData.default as Config;
        const canvas = <HTMLCanvasElement>document.getElementById("GameCanvas");
        renderingSystem = new RenderingSystem(canvas, sprites);
        this.renderSystem = renderingSystem;

        const canvasLayer1 = <HTMLCanvasElement>document.getElementById("GameCanvas-layer-1");
        renderingSystemLayer1 = new RenderingSystem(canvasLayer1, sprites, 1);
        this.renderSystemLayer1 = renderingSystemLayer1;

        this.gameObj.ID = 1541515125;
        this.gameObj.AddComponent(new PositionComponent(0, 0));
        this.gameObj.AddComponent(new RenderMapComponent(config.Data, config.MapWidth, config.MapHeight));
        this.world.Add(this.gameObj);
        this.networkSystem.connect(auth, setIsInitializedAll);
        requestAnimationFrame(Loop);
        this.networkSystem.SetRenderingSystem(renderingSystem, renderingSystemLayer1);
      });

    const Loop = () => {
      this.world.FPS = GetFPS();
      
      characterAnimationSystem.Process(this.world);
      movmentSystem.Process(this.world);
      cameraSystem.Process(this.world);
      this.inputSystem.Process(this.world);

      this.networkSystem.Process(this.world);
      userInterfaceSystem.Process(this.world);

      const camerasList = cameraSystem.GetCamerasList();
      
      // Layer 0
      renderingSystem.Process(this.world);
      renderingSystem.RenderAll(camerasList);

      // Layer 1
      renderingSystemLayer1.Process(this.world);
      renderingSystemLayer1.RenderAll(camerasList);

      this.world.ClearEvents();
      requestAnimationFrame(Loop);
    }
  }

  GetWorld() {
    return this.world;
  }
}