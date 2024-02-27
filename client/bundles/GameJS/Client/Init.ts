
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
  renderSystem: RenderingSystem[];
  initialized: boolean;

  constructor() {
    this.world = new World();
    this.inputSystem = new InputSystem();
    this.gameObj = new GameObj();
    this.events = Events;
    this.enemies = [];
    this.initialized = false;
    this.renderSystem = [];

    this.networkSystem = new NetworkSystem();
  }

  ProcessAndRenderLayers(camerasList, world) {
    // Layer 0
    this.renderSystem[0].Process(world);
    this.renderSystem[0].RenderAll(camerasList);

    // Layer 1
    this.renderSystem[1].Process(world);
    this.renderSystem[1].RenderAll(camerasList);
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

    const InitializeMapLayer = (layer, configData, sprites) => {
      const canvas = <HTMLCanvasElement>document.getElementById(`GameCanvas-layer-${layer}`);
      var newLayer = new RenderingSystem(canvas, sprites, layer);
      this.renderSystem.push(newLayer);
    };

    Promise.all([configPromise, spritePromise])
      .then(([configData, sprites]) => {
        config = configData.default as Config;

        InitializeMapLayer(0, configData, sprites);
        InitializeMapLayer(1, configData, sprites);

        this.gameObj.ID = 1541515125;
        this.gameObj.AddComponent(new PositionComponent(0, 0));
        this.gameObj.AddComponent(new RenderMapComponent(config.Data, config.MapWidth, config.MapHeight));
        this.world.Add(this.gameObj);
        this.networkSystem.connect(auth);
        requestAnimationFrame(Loop);

        this.networkSystem.SetRenderingSystem(0, this.renderSystem[0]);
        this.networkSystem.SetRenderingSystem(1, this.renderSystem[1]);
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
      this.ProcessAndRenderLayers(camerasList, this.world);

      this.world.ClearEvents();
      requestAnimationFrame(Loop);

      if (!this.initialized) {
        this.initialized = true;
        setIsInitializedAll(true);
      }
    }
  }

  GetWorld() {
    return this.world;
  }
}