import React, {useContext, useEffect} from "react";
import './Maps.css';
import ResultBox from "../../components/ResultBox";
import {kiracModifier, MapMod, mapModifiers} from "../../generated/GeneratedMapMods";
import {generateMapModStr} from "../../utils/MapOutput";
import MapModList from "../../components/MapModList";
import {Checkbox} from "../vendor/Vendor";
import {getGradientColor} from "../../utils/ColorGradient";
import Header from "../../components/Header";
import {loadSettings, saveSettings} from "../../utils/LocalStorage";
import {defaultSettings, MapSettings} from "../../utils/SavedSettings";
import {ProfileContext} from "../../components/profile/ProfileContext";

const Maps = () => {
  const {globalProfile} = useContext(ProfileContext);
  const profile = loadSettings(globalProfile);

  const mods = Array.from(Object.keys(mapModifiers));
  const kiracModList = Array.from(Object.keys(kiracModifier));
  const badMods = mods
    .map((m) => ({...mapModifiers[m], value: m}))
    .sort((a, b) => b.scary - a.scary);
  const goodMods = mods
    .map((m) => ({...mapModifiers[m], value: m}))
    .sort((a, b) => a.scary - b.scary);
  const kiracMods = kiracModList
    .map((m) => ({...kiracModifier[m], value: m}))
    .sort((a, b) => a.scary - b.scary);

  const [selectedBadMods, setSelectedBadMods] = React.useState<string[]>(profile.map.badMods.filter((v: string) => mods.includes(v)));
  const [selectedGoodMods, setSelectedGoodMods] = React.useState<string[]>(profile.map.goodMods.filter((v: string) => mods.includes(v)));
  const [selectedKirac, setSelectedKirac] = React.useState<string[]>(profile.map.kirac.filter((v: string) => kiracModList.includes(v)));
  const [modGrouping, setModGrouping] = React.useState(profile.map.allGoodMods);
  const [quantity, setQuantity] = React.useState(profile.map.quantity);
  const [packsize, setPacksize] = React.useState(profile.map.packsize);
  const [optimizeQuant, setOptimizeQuant] = React.useState(profile.map.optimizeQuant);
  const [optimizePacksize, setOptimizePacksize] = React.useState(profile.map.optimizePacksize);
  const [rarity, setRarity] = React.useState(profile.map.rarity);
  const [t17, setT17] = React.useState(profile.map.t17);

  const [result, setResult] = React.useState("");

  useEffect(() => {
    let settings: MapSettings = {
      badMods: selectedBadMods,
      goodMods: selectedGoodMods,
      kirac: selectedKirac,
      allGoodMods: modGrouping,
      quantity,
      packsize,
      optimizeQuant,
      optimizePacksize,
      rarity,
      t17,
    };
    let search = generateMapModStr(settings, mapModifiers);
    saveSettings({
      ...profile,
      map: {...settings},
    });
    setResult(search);
  }, [result, rarity, selectedBadMods, selectedGoodMods, selectedKirac, modGrouping, quantity, packsize, optimizeQuant, optimizePacksize, t17]);


  return (
    <>
      <Header text={"Map Modifiers"}/>
      <ResultBox result={result} warning={undefined} reset={() => {
        setSelectedGoodMods(defaultSettings.map.goodMods);
        setSelectedBadMods(defaultSettings.map.badMods);
        setSelectedKirac(defaultSettings.map.kirac);
        setOptimizePacksize(defaultSettings.map.optimizePacksize);
        setOptimizeQuant(defaultSettings.map.optimizeQuant);
        setModGrouping(defaultSettings.map.allGoodMods)
        setQuantity(defaultSettings.map.quantity);
        setPacksize(defaultSettings.map.packsize);
        setRarity(defaultSettings.map.rarity);
        setT17(defaultSettings.map.t17);
      }}/>
      <div className="break"/>
      <div className="full-size generic-top-element">
        <label className="modifier-search-label" htmlFor="quantity">Quantity of at least</label>
        <input type="search" className="modifier-quantity-box" id="quantity" name="search-mod" value={quantity}
               onChange={v => setQuantity(v.target.value)}/>
        <label className="modifier-search-label" htmlFor="pack-size">Pack Size of at least</label>
        <input type="search" className="modifier-quantity-box" id="pack-size" name="search-mod" value={packsize}
               onChange={v => setPacksize(v.target.value)}/>
        <Checkbox label="Optimize Quantity value (round down to nearest 10, saves a lot of query space)"
                  value={optimizeQuant}
                  onChange={setOptimizeQuant}/>
        <Checkbox label="Optimize Pack Size value" value={optimizePacksize}
                  onChange={setOptimizePacksize}/>
        <div className="rarity-select">
          <Checkbox label="Normal Maps" value={rarity.normal}
                    onChange={(e) => setRarity({...rarity, normal: !!e})}/>
          <Checkbox label="Magic Maps" value={rarity.magic}
                    onChange={(e) => setRarity({...rarity, magic: !!e})}/>
          <Checkbox label="Rare Maps" value={rarity.rare}
                    onChange={(e) => setRarity({...rarity, rare: !!e})}/>
          <div className="radio-button-modgroup">
            <input type="radio" className="radio-button-map" id="maps-include" name="map-include"
                   defaultChecked={rarity.include}
                   checked={rarity.include}
                   onChange={v => setRarity({...rarity, include: true})}/>
            <label htmlFor="maps-include" className="radio-button-map radio-first-ele">Include</label>
            <input type="radio" id="maps-exclude" name="map-include" defaultChecked={!rarity.include}
                   checked={!rarity.include}
                   onChange={v => setRarity({...rarity, include: false})}/>
            <label htmlFor="maps-exclude" className="radio-button-map">Exclude</label>
          </div>
        </div>
        <div className="break spacer-top"/>
        <Checkbox label="Tier 17 Map Modifiers" className="tier17-color" value={t17}
                  onChange={setT17}/>
      </div>
      <div className="eq-col-2 box-small-padding">
        <div className="column-header map-column-text">I don't want any of these mods</div>
      </div>
      <div className="eq-col-2 box-small-padding">
        <div className="column-header map-column-text">I want these mods</div>
        <div className="radio-button-modgroup">
          <input type="radio" className="radio-button-map" id="mods-any" name="mods" value="any"
                 checked={!modGrouping}
                 onChange={v => setModGrouping(!v.target.checked)}/>
          <label htmlFor="mods-any" className="radio-button-map radio-first-ele">I want <b>any</b> of the
            modifiers</label>
          <input type="radio" id="mods-all" name="mods" value="all" checked={modGrouping}
                 onChange={v => setModGrouping(v.target.checked)}/>
          <label htmlFor="mods-all" className="radio-button-map">I want <b>all</b> of the modifiers</label>
        </div>
      </div>
      <div className="break"/>
      <div className="eq-col-2">
        <MapModList id="bad-mods"
                    colorFun={mapDangerColor}
                    mods={badMods.filter((e) => t17 || !e.isTier17)}
                    selected={selectedBadMods}
                    setSelected={setSelectedBadMods}
        />
      </div>
      <div className="eq-col-2">
        <MapModList id="good-mods"
                    colorFun={mapDangerColor}
                    mods={goodMods.filter((e) => t17 || !e.isTier17)}
                    selected={selectedGoodMods}
                    setSelected={setSelectedGoodMods}
        />
      </div>
      <div className="eq-col-2"></div>
      <div className="eq-col-2">
        <h2>Kirac missions</h2>
        <MapModList id="kirac" disableSearch={true} colorFun={mapDangerColor} mods={kiracMods} selected={selectedKirac}
                    setSelected={setSelectedKirac}/>
      </div>
    </>
  );
}

function mapDangerColor(m: MapMod): string {
  if (m.scary < 100) {
    return "#ffffff";
  }
  if (m.scary > 1100) {
    return "#eab7fc";
  } else {
    return getGradientColor("#FC9090", "#ffffff", (1100 - m.scary) / 1100);
  }
}

export default Maps;
