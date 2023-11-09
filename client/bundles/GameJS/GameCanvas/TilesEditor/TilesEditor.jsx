import React, { useEffect, useRef, useState } from 'react';
import './TilesEditor.scss';

import GameInstance from 'bundles/GameJS/store/GameInit';
import TileItem from './TileItem';

const TILE_SIZE = 32;

function TilesEditor({ canvasRef, subscription }) {
  const socket = GameInstance.init.networkSystem.GetSocket();
  const [tileType, setTileType] = useState(350);
  const tileTypeRef = useRef(tileType);

  const [tileWalkable, setTileWalkable] = useState(true);
  const tileWalkableRef = useRef(tileWalkable);

  const [tileSafe, setTileSafe] = useState(false);
  const tileSafeRef = useRef(tileSafe);

  const [editLayer, setEditLayer] = useState(0);
  const editLayerRef = useRef(editLayer);

  const [enabledTileEditor, setEnabledTileEditor] = useState(false);
  const enabledTileEditorRef = useRef(enabledTileEditor);

  const [playerPosition, setPlayerPosition] = useState({
    x: -55555555,
    y: -55555555
  });
  const playerRef = useRef(playerPosition);
  const isMouseDown = useRef(false);
  const lastPosition = useRef({ x: -9999999999, y: -9999999999 });

  const [hideLayer1, setHideLayer1] = useState(false);
  const hideLayer1Ref = useRef(hideLayer1);

  const [autoCompleteObj, setAutoCompleteObj] = useState(false);
  const autoCompleteObjRef = useRef(autoCompleteObj);

  useEffect(() => {
    tileTypeRef.current = tileType;
  }, [tileType]);

  useEffect(() => {
    editLayerRef.current = editLayer;
  }, [editLayer]);

  useEffect(() => {
    tileWalkableRef.current = tileWalkable;
  }, [tileWalkable]);

  useEffect(() => {
    tileSafeRef.current = tileSafe;
  }, [tileSafe]);

  useEffect(() => {
    enabledTileEditorRef.current = enabledTileEditor;
  }, [enabledTileEditor]);

  useEffect(() => {
    autoCompleteObjRef.current = autoCompleteObj;
  }, [autoCompleteObj]);

  useEffect(() => {
    setHideLayer1.current = hideLayer1;

    var layer = document.getElementById('GameCanvas-layer-1');
    if (setHideLayer1.current)
      layer.style.display = "none";
    else
      layer.style.display = "block";

  }, [hideLayer1]);

  useEffect(() => {
    playerRef.current.x = playerPosition.x;
    playerRef.current.y = playerPosition.y;
  }, [playerPosition]);

  const changeTileType = (newType) => {
    setTileType(newType);
  }

  const changeLayer = (newLayer) => {
    setEditLayer(newLayer.target.value);
  }

  const changeWalkable = () => {
    setTileWalkable(!tileWalkable)
  }

  const changeTileSafe = () => {
    setTileSafe(!tileSafe)
  }

  const toggleLayer = () => {
    setHideLayer1(!hideLayer1);
  }

  const toggleTileEditor = () => {
    setEnabledTileEditor(!enabledTileEditor);
  }

  const toggleAutoCompleteObj = () => {
    setAutoCompleteObj(!autoCompleteObj);
  }

  function whileMouseDown(event) {
    if (!enabledTileEditorRef.current) return;
    if (playerRef.current.x == -55555555) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tileSize = 2 * TILE_SIZE;
    const removeDivisorX = (canvasRef.current.width % TILE_SIZE);
    const removeDivisorY = (canvasRef.current.height % TILE_SIZE);
    
    const left = playerRef.current.x - Math.round((canvasRef.current.width - removeDivisorX) / tileSize);
    const top = playerRef.current.y - Math.round((canvasRef.current.height - removeDivisorY) / tileSize);

    const tileX = Math.floor(x / TILE_SIZE) + left;
    const tileY = Math.floor(y / TILE_SIZE) + top;

    if (lastPosition.current.x == tileX && lastPosition.current.y == tileY) return;

    lastPosition.current = { x: tileX, y: tileY };

    if (tileTypeRef.current == 8 && autoCompleteObjRef.current) {
      GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
        layer: editLayerRef.current,
        x: tileX - 1,
        y: tileY,
        newType: 7,
        walkable: true,
        safeZone: false,
      });

      GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
        layer: editLayerRef.current,
        x: tileX,
        y: tileY -1,
        newType: 6,
        walkable: true,
        safeZone: false,
      });

      GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
        layer: editLayerRef.current,
        x: tileX - 1,
        y: tileY - 1,
        newType: 5,
        walkable: true,
        safeZone: false,
      });

      GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
        layer: editLayerRef.current,
        x: tileX,
        y: tileY,
        newType: 8,
        walkable: false,
        safeZone: false,
      });
      return;
    }

    GameInstance.init.networkSystem.EmitServer("tileEditor:updateTile", {
      layer: editLayerRef.current,
      x: tileX,
      y: tileY,
      newType: tileTypeRef.current,
      walkable: tileWalkableRef.current,
      safeZone: tileSafeRef.current,
    });
  }

  function handleMouseDown(event) {
    if (!enabledTileEditorRef.current) return;
    isMouseDown.current = true;
  }

  function handleMouseUp(event) {
    if (!enabledTileEditorRef.current) return;
    isMouseDown.current = false;
  }

  function handleMouseMove(event) {
    if (!enabledTileEditorRef.current) return;
    if (isMouseDown.current) {
      whileMouseDown(event);
    }
  }

  useEffect(() => {

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', whileMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseMove);
    };
  }, [canvasRef]);

  useEffect(() => {
    socket.on("UpdatePositionTileEditor", (data) => {
      setPlayerPosition({
        x: data.Data.Pos.x,
        y: data.Data.Pos.y,
      })
    });
  }, []);

  return (
    <div className="tiles-editor">
      <div className="title">Tile Editor</div>

      <div className="tile-types">
        <ul>
          <TileItem itemId={-1} changeTileType={changeTileType} />
          <TileItem itemId={3} changeTileType={changeTileType} />
          <TileItem itemId={4} changeTileType={changeTileType} />
          <TileItem itemId={5} changeTileType={changeTileType} />
          <TileItem itemId={6} changeTileType={changeTileType} />
          <TileItem itemId={7} changeTileType={changeTileType} />
          <TileItem itemId={8} changeTileType={changeTileType} />
          <TileItem itemId={9} changeTileType={changeTileType} />
          <TileItem itemId={10} changeTileType={changeTileType} />
          <TileItem itemId={11} changeTileType={changeTileType} />
          <TileItem itemId={12} changeTileType={changeTileType} />
          <TileItem itemId={13} changeTileType={changeTileType} />
          <TileItem itemId={14} changeTileType={changeTileType} />
          <TileItem itemId={15} changeTileType={changeTileType} />
          <TileItem itemId={16} changeTileType={changeTileType} />
          <TileItem itemId={17} changeTileType={changeTileType} />
          <TileItem itemId={18} changeTileType={changeTileType} />
          <TileItem itemId={19} changeTileType={changeTileType} />
          <TileItem itemId={20} changeTileType={changeTileType} />
          <TileItem itemId={21} changeTileType={changeTileType} />
          <TileItem itemId={22} changeTileType={changeTileType} />
          <TileItem itemId={23} changeTileType={changeTileType} />
          <TileItem itemId={24} changeTileType={changeTileType} />
          <TileItem itemId={25} changeTileType={changeTileType} />
          <TileItem itemId={26} changeTileType={changeTileType} />
          <TileItem itemId={27} changeTileType={changeTileType} />
          <TileItem itemId={28} changeTileType={changeTileType} />
          <TileItem itemId={29} changeTileType={changeTileType} />
          <TileItem itemId={30} changeTileType={changeTileType} />
          <TileItem itemId={31} changeTileType={changeTileType} />
          <TileItem itemId={32} changeTileType={changeTileType} />
          <TileItem itemId={136} changeTileType={changeTileType} />
          <TileItem itemId={137} changeTileType={changeTileType} />
          <TileItem itemId={138} changeTileType={changeTileType} />
          <TileItem itemId={139} changeTileType={changeTileType} />
          <TileItem itemId={140} changeTileType={changeTileType} />
          <TileItem itemId={141} changeTileType={changeTileType} />
          <TileItem itemId={142} changeTileType={changeTileType} />
          <TileItem itemId={143} changeTileType={changeTileType} />
          <TileItem itemId={144} changeTileType={changeTileType} />
          <TileItem itemId={145} changeTileType={changeTileType} />
          <TileItem itemId={146} changeTileType={changeTileType} />
          <TileItem itemId={147} changeTileType={changeTileType} />
          <TileItem itemId={148} changeTileType={changeTileType} />
          <TileItem itemId={149} changeTileType={changeTileType} />
          <TileItem itemId={150} changeTileType={changeTileType} />
          <TileItem itemId={151} changeTileType={changeTileType} />
          <TileItem itemId={152} changeTileType={changeTileType} />
          <TileItem itemId={153} changeTileType={changeTileType} />
          <TileItem itemId={154} changeTileType={changeTileType} />
          <TileItem itemId={155} changeTileType={changeTileType} />
          <TileItem itemId={156} changeTileType={changeTileType} />
          <TileItem itemId={157} changeTileType={changeTileType} />
          <TileItem itemId={158} changeTileType={changeTileType} />
          <TileItem itemId={159} changeTileType={changeTileType} />
          <TileItem itemId={160} changeTileType={changeTileType} />
          <TileItem itemId={161} changeTileType={changeTileType} />
          <TileItem itemId={162} changeTileType={changeTileType} />
          <TileItem itemId={163} changeTileType={changeTileType} />
          <TileItem itemId={164} changeTileType={changeTileType} />
          <TileItem itemId={165} changeTileType={changeTileType} />
          <TileItem itemId={166} changeTileType={changeTileType} />
          <TileItem itemId={167} changeTileType={changeTileType} />
          <TileItem itemId={168} changeTileType={changeTileType} />
          <TileItem itemId={169} changeTileType={changeTileType} />
          <TileItem itemId={170} changeTileType={changeTileType} />
          <TileItem itemId={171} changeTileType={changeTileType} />
          <TileItem itemId={172} changeTileType={changeTileType} />
          <TileItem itemId={173} changeTileType={changeTileType} />
          <TileItem itemId={174} changeTileType={changeTileType} />
          <TileItem itemId={175} changeTileType={changeTileType} />
          <TileItem itemId={176} changeTileType={changeTileType} />
          <TileItem itemId={177} changeTileType={changeTileType} />
          <TileItem itemId={178} changeTileType={changeTileType} />
          <TileItem itemId={179} changeTileType={changeTileType} />
          <TileItem itemId={180} changeTileType={changeTileType} />
          <TileItem itemId={181} changeTileType={changeTileType} />
          <TileItem itemId={182} changeTileType={changeTileType} />
          <TileItem itemId={183} changeTileType={changeTileType} />
          <TileItem itemId={184} changeTileType={changeTileType} />

          <TileItem itemId={268} changeTileType={changeTileType} />
          <TileItem itemId={269} changeTileType={changeTileType} />
          <TileItem itemId={270} changeTileType={changeTileType} />
          <TileItem itemId={271} changeTileType={changeTileType} />
          <TileItem itemId={272} changeTileType={changeTileType} />
          <TileItem itemId={273} changeTileType={changeTileType} />
          <TileItem itemId={274} changeTileType={changeTileType} />
          <TileItem itemId={275} changeTileType={changeTileType} />
          <TileItem itemId={276} changeTileType={changeTileType} />
          <TileItem itemId={277} changeTileType={changeTileType} />
          <TileItem itemId={278} changeTileType={changeTileType} />
          <TileItem itemId={279} changeTileType={changeTileType} />
          <TileItem itemId={280} changeTileType={changeTileType} />
          <TileItem itemId={281} changeTileType={changeTileType} />

          <TileItem itemId={297} changeTileType={changeTileType} />
          <TileItem itemId={298} changeTileType={changeTileType} />
          <TileItem itemId={299} changeTileType={changeTileType} />
          <TileItem itemId={300} changeTileType={changeTileType} />
          <TileItem itemId={301} changeTileType={changeTileType} />

          <TileItem itemId={311} changeTileType={changeTileType} />
          <TileItem itemId={312} changeTileType={changeTileType} />
          <TileItem itemId={313} changeTileType={changeTileType} />
          <TileItem itemId={314} changeTileType={changeTileType} />
          <TileItem itemId={315} changeTileType={changeTileType} />
          <TileItem itemId={316} changeTileType={changeTileType} />
          <TileItem itemId={317} changeTileType={changeTileType} />
          <TileItem itemId={318} changeTileType={changeTileType} />
          <TileItem itemId={319} changeTileType={changeTileType} />
          <TileItem itemId={320} changeTileType={changeTileType} />

          <TileItem itemId={105} changeTileType={changeTileType} />
          <TileItem itemId={106} changeTileType={changeTileType} />
          <TileItem itemId={107} changeTileType={changeTileType} />
          <TileItem itemId={108} changeTileType={changeTileType} />
          <TileItem itemId={109} changeTileType={changeTileType} />
          <TileItem itemId={110} changeTileType={changeTileType} />
          <TileItem itemId={111} changeTileType={changeTileType} />
          <TileItem itemId={112} changeTileType={changeTileType} />

          <TileItem itemId={336} changeTileType={changeTileType} />
          <TileItem itemId={337} changeTileType={changeTileType} />
          <TileItem itemId={338} changeTileType={changeTileType} />
          <TileItem itemId={339} changeTileType={changeTileType} />
          <TileItem itemId={340} changeTileType={changeTileType} />
          <TileItem itemId={341} changeTileType={changeTileType} />

          <TileItem itemId={342} changeTileType={changeTileType} />
          <TileItem itemId={343} changeTileType={changeTileType} />
          <TileItem itemId={344} changeTileType={changeTileType} />
          <TileItem itemId={345} changeTileType={changeTileType} />
          <TileItem itemId={346} changeTileType={changeTileType} />
          <TileItem itemId={347} changeTileType={changeTileType} />
          <TileItem itemId={348} changeTileType={changeTileType} />
          <TileItem itemId={349} changeTileType={changeTileType} />

          <TileItem itemId={350} changeTileType={changeTileType} />
          <TileItem itemId={351} changeTileType={changeTileType} />
          <TileItem itemId={352} changeTileType={changeTileType} />
          <TileItem itemId={353} changeTileType={changeTileType} />
          <TileItem itemId={354} changeTileType={changeTileType} />
          <TileItem itemId={355} changeTileType={changeTileType} />
          <TileItem itemId={356} changeTileType={changeTileType} />
          <TileItem itemId={357} changeTileType={changeTileType} />
          <TileItem itemId={358} changeTileType={changeTileType} />
          <TileItem itemId={359} changeTileType={changeTileType} />
          <TileItem itemId={360} changeTileType={changeTileType} />
          <TileItem itemId={361} changeTileType={changeTileType} />
          <TileItem itemId={362} changeTileType={changeTileType} />
          <TileItem itemId={363} changeTileType={changeTileType} />
          <TileItem itemId={364} changeTileType={changeTileType} />
          <TileItem itemId={365} changeTileType={changeTileType} />
          <TileItem itemId={366} changeTileType={changeTileType} />
          <TileItem itemId={367} changeTileType={changeTileType} />
          <TileItem itemId={368} changeTileType={changeTileType} />
          <TileItem itemId={369} changeTileType={changeTileType} />
          <TileItem itemId={370} changeTileType={changeTileType} />
          <TileItem itemId={371} changeTileType={changeTileType} />
          <TileItem itemId={372} changeTileType={changeTileType} />
          <TileItem itemId={373} changeTileType={changeTileType} />
          <TileItem itemId={374} changeTileType={changeTileType} />
          <TileItem itemId={375} changeTileType={changeTileType} />
          <TileItem itemId={376} changeTileType={changeTileType} />
          <TileItem itemId={377} changeTileType={changeTileType} />
          <TileItem itemId={378} changeTileType={changeTileType} />
          <TileItem itemId={379} changeTileType={changeTileType} />
          <TileItem itemId={380} changeTileType={changeTileType} />
          <TileItem itemId={381} changeTileType={changeTileType} />
          <TileItem itemId={382} changeTileType={changeTileType} />
          <TileItem itemId={383} changeTileType={changeTileType} />
          <TileItem itemId={384} changeTileType={changeTileType} />
          <TileItem itemId={385} changeTileType={changeTileType} />
          <TileItem itemId={386} changeTileType={changeTileType} />
          <TileItem itemId={387} changeTileType={changeTileType} />
          <TileItem itemId={390} changeTileType={changeTileType} />
          <TileItem itemId={391} changeTileType={changeTileType} />
          <TileItem itemId={392} changeTileType={changeTileType} />
          <TileItem itemId={393} changeTileType={changeTileType} />
          <TileItem itemId={394} changeTileType={changeTileType} />
          <TileItem itemId={395} changeTileType={changeTileType} />
          <TileItem itemId={396} changeTileType={changeTileType} />
          <TileItem itemId={397} changeTileType={changeTileType} />
          <TileItem itemId={398} changeTileType={changeTileType} />
          <TileItem itemId={399} changeTileType={changeTileType} />
          <TileItem itemId={400} changeTileType={changeTileType} />
          <TileItem itemId={401} changeTileType={changeTileType} />
          <TileItem itemId={402} changeTileType={changeTileType} />
        </ul>

        <ul>
          <TileItem itemId={403} changeTileType={changeTileType} />
          <TileItem itemId={404} changeTileType={changeTileType} />
        </ul>

        <ul>
          <TileItem itemId={405} changeTileType={changeTileType} />
          <TileItem itemId={406} changeTileType={changeTileType} />
          <TileItem itemId={407} changeTileType={changeTileType} />
          <TileItem itemId={408} changeTileType={changeTileType} />
          <TileItem itemId={409} changeTileType={changeTileType} />
          <TileItem itemId={410} changeTileType={changeTileType} />
          <TileItem itemId={411} changeTileType={changeTileType} />
          <TileItem itemId={412} changeTileType={changeTileType} />
          <TileItem itemId={413} changeTileType={changeTileType} />
          <TileItem itemId={414} changeTileType={changeTileType} />
          <TileItem itemId={415} changeTileType={changeTileType} />
          <TileItem itemId={416} changeTileType={changeTileType} />
          <TileItem itemId={417} changeTileType={changeTileType} />
          <TileItem itemId={418} changeTileType={changeTileType} />
          <TileItem itemId={419} changeTileType={changeTileType} />
          <TileItem itemId={420} changeTileType={changeTileType} />
          <TileItem itemId={421} changeTileType={changeTileType} />
          <TileItem itemId={422} changeTileType={changeTileType} />
          <TileItem itemId={423} changeTileType={changeTileType} />
          <TileItem itemId={424} changeTileType={changeTileType} />
          <TileItem itemId={425} changeTileType={changeTileType} />
          <TileItem itemId={426} changeTileType={changeTileType} />
          <TileItem itemId={427} changeTileType={changeTileType} />
          <TileItem itemId={428} changeTileType={changeTileType} />
          <TileItem itemId={429} changeTileType={changeTileType} />
          <TileItem itemId={430} changeTileType={changeTileType} />
          <TileItem itemId={431} changeTileType={changeTileType} />
          <TileItem itemId={432} changeTileType={changeTileType} />
          <TileItem itemId={433} changeTileType={changeTileType} />
          <TileItem itemId={434} changeTileType={changeTileType} />
          <TileItem itemId={435} changeTileType={changeTileType} />
          <TileItem itemId={436} changeTileType={changeTileType} />
          <TileItem itemId={437} changeTileType={changeTileType} />
          <TileItem itemId={438} changeTileType={changeTileType} />
          <TileItem itemId={439} changeTileType={changeTileType} />
          <TileItem itemId={440} changeTileType={changeTileType} />
          <TileItem itemId={441} changeTileType={changeTileType} />
          <TileItem itemId={442} changeTileType={changeTileType} />
          <TileItem itemId={443} changeTileType={changeTileType} />
          <TileItem itemId={444} changeTileType={changeTileType} />
          <TileItem itemId={445} changeTileType={changeTileType} />
          <TileItem itemId={446} changeTileType={changeTileType} />
          <TileItem itemId={447} changeTileType={changeTileType} />
          <TileItem itemId={448} changeTileType={changeTileType} />
          <TileItem itemId={449} changeTileType={changeTileType} />
          <TileItem itemId={450} changeTileType={changeTileType} />
          <TileItem itemId={451} changeTileType={changeTileType} />
          <TileItem itemId={452} changeTileType={changeTileType} />
          <TileItem itemId={453} changeTileType={changeTileType} />
          <TileItem itemId={454} changeTileType={changeTileType} />
          <TileItem itemId={455} changeTileType={changeTileType} />
          <TileItem itemId={456} changeTileType={changeTileType} />
          <TileItem itemId={457} changeTileType={changeTileType} />
          <TileItem itemId={458} changeTileType={changeTileType} />
          <TileItem itemId={459} changeTileType={changeTileType} />
          <TileItem itemId={460} changeTileType={changeTileType} />
          <TileItem itemId={461} changeTileType={changeTileType} />
          <TileItem itemId={462} changeTileType={changeTileType} />
          <TileItem itemId={463} changeTileType={changeTileType} />
          <TileItem itemId={464} changeTileType={changeTileType} />
        </ul>

        <hr />
        <input
          type="range"
          min="0"
          max="1"
          value={editLayerRef.current}
          onChange={changeLayer}
          className="slider"
        />
        <br/>Layer: {editLayerRef.current}

        <hr />
        walkable <br/>
        <input type="checkbox" onChange={changeWalkable} checked={tileWalkable} />

        <hr />
        SafeZone <br/>
        <input type="checkbox" onChange={changeTileSafe} checked={tileSafe} />

        <hr />
        Esconder Layer 1 <br/>
        <input type="checkbox" onChange={toggleLayer} checked={hideLayer1} />

        <hr />
        Auto Complete Object<br/>
        <input type="checkbox" onChange={toggleAutoCompleteObj} checked={autoCompleteObj} />

        <hr />
        Enabled? <br/>
        <input type="checkbox" onChange={toggleTileEditor} checked={enabledTileEditor} />

        <hr />
        Current Position<br/>
        X: {playerPosition.x}, Y: {playerPosition.y}
      </div>
    </div>
  );
}

export default TilesEditor;
