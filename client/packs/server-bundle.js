import ReactOnRails from 'react-on-rails';

import GameView from '../bundles/GameView/components/GameViewServer';
import GameJS from '../bundles/GameJS/GameJSServer';

ReactOnRails.register({
  GameView,
  GameJS
});
