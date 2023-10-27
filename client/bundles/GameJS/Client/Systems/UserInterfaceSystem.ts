import {ISystem} from "../Game";
import {Componenets, InputComponent, HealthComponent} from "../BasicComponents";
import {config} from "../Init";
import {World} from "../World";

export class UserInterfaceSytem implements ISystem {
    private HealthBar = document.getElementById("health-bar");
    private Level = document.getElementById("player-level");
    private Exp = document.getElementById("player-experience");
    private LvlProgressBar = document.getElementById("experience-bar");
    private Health = document.getElementById("health");

    Process(world: World) {
        for (var i = 0; i < world.entityList.length; i++) {
            if (!this.Level) {
                this.Level = document.getElementById("player-level");
                this.Exp = document.getElementById("player-experience");
                this.LvlProgressBar = document.getElementById("experience-bar");
                this.HealthBar = document.getElementById("health-bar");
                this.Health = document.getElementById("health");
                continue;
            }

            if ((world.entityList[i].ComponentSygnature & Componenets.Input) === Componenets.Input) {
                var inputComponent = <InputComponent> world.entityList[i].ComponentList[Componenets.Input];
                var healthComponent = <HealthComponent> world.entityList[i].ComponentList[Componenets.Health];
                if (inputComponent == null) continue;
                if (healthComponent == null) continue;

                this.HealthBar.style.width = `${healthComponent.HP / healthComponent.MaxHP * 100}%`;
                this.HealthBar.style.width = `${healthComponent.HP / healthComponent.MaxHP * 100}%`;
                this.Health.innerHTML = healthComponent.HP.toString() + "/" + healthComponent.MaxHP.toString();

                this.Level.innerHTML = inputComponent.Level.toString();
                this.Exp.innerHTML = inputComponent.Experience.toString() + "/" + config.Player.LvlExp[inputComponent.Level].toString();
                this.LvlProgressBar.style.width = `${inputComponent.Experience / config.Player.LvlExp[inputComponent.Level] * 100}%`;
               
            }
        }
    }
}
