import ReactOnRails from 'react-on-rails';

import GameView from '../bundles/GameView/components/GameViewServer';

// This is how react_on_rails can see the GameView in the browser.
ReactOnRails.register({
  GameView,
});
