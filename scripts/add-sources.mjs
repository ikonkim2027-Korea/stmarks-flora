// Adds sources array to each plant in plants.ts
// Uses reliable, canonical URL patterns for each source.

import fs from "node:fs";
import path from "node:path";

const PLANTS_FILE = path.resolve("src/data/plants.ts");

// Plant ID -> list of sources
// Primary sources: Go Botany (Native Plant Trust), iNaturalist, Wikipedia, USDA PLANTS
// Tertiary: Mass Audubon, specific institutional sources
// All URLs verified as canonical patterns for these databases.

function goBotany(genus, species) {
  return `https://gobotany.nativeplanttrust.org/species/${genus.toLowerCase()}/${species.toLowerCase()}/`;
}

function iNaturalist(sciName) {
  return `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(sciName)}`;
}

function wikipedia(sciName) {
  return `https://en.wikipedia.org/wiki/${sciName.replace(/ /g, "_").replace(/var\._/g, "")}`;
}

function usda(symbol) {
  return `https://plants.usda.gov/home/plantProfile?symbol=${symbol}`;
}

// Map plant ID -> sources array
// Scientific name is parsed to genus + species for Go Botany.
const plantSources = {
  "red-maple": [
    { label: "Go Botany — Acer rubrum", url: goBotany("Acer", "rubrum") },
    { label: "USDA PLANTS Database", url: usda("ACRU") },
    { label: "iNaturalist Observations", url: iNaturalist("Acer rubrum") },
    { label: "Wikipedia", url: wikipedia("Acer rubrum") },
  ],
  "eastern-white-pine": [
    { label: "Go Botany — Pinus strobus", url: goBotany("Pinus", "strobus") },
    { label: "USDA PLANTS Database", url: usda("PIST") },
    { label: "iNaturalist Observations", url: iNaturalist("Pinus strobus") },
    { label: "Wikipedia", url: wikipedia("Pinus strobus") },
  ],
  "trout-lily": [
    { label: "Go Botany — Erythronium americanum", url: goBotany("Erythronium", "americanum") },
    { label: "USDA PLANTS Database", url: usda("ERAM5") },
    { label: "iNaturalist Observations", url: iNaturalist("Erythronium americanum") },
    { label: "Wikipedia", url: wikipedia("Erythronium americanum") },
  ],
  "garlic-mustard": [
    { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
    { label: "Go Botany — Alliaria petiolata", url: goBotany("Alliaria", "petiolata") },
    { label: "iNaturalist Observations", url: iNaturalist("Alliaria petiolata") },
    { label: "Wikipedia", url: wikipedia("Alliaria petiolata") },
  ],
  "cinnamon-fern": [
    { label: "Go Botany — Osmundastrum cinnamomeum", url: goBotany("Osmundastrum", "cinnamomeum") },
    { label: "USDA PLANTS Database", url: usda("OSCI") },
    { label: "iNaturalist Observations", url: iNaturalist("Osmundastrum cinnamomeum") },
    { label: "Wikipedia", url: wikipedia("Osmundastrum cinnamomeum") },
  ],
  "japanese-barberry": [
    { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
    { label: "Go Botany — Berberis thunbergii", url: goBotany("Berberis", "thunbergii") },
    { label: "iNaturalist Observations", url: iNaturalist("Berberis thunbergii") },
    { label: "Wikipedia", url: wikipedia("Berberis thunbergii") },
  ],
  "bloodroot": [
    { label: "Go Botany — Sanguinaria canadensis", url: goBotany("Sanguinaria", "canadensis") },
    { label: "USDA PLANTS Database", url: usda("SACA13") },
    { label: "iNaturalist Observations", url: iNaturalist("Sanguinaria canadensis") },
    { label: "Wikipedia", url: wikipedia("Sanguinaria canadensis") },
  ],
  "hepatica": [
    { label: "Go Botany — Hepatica americana", url: goBotany("Anemone", "americana") },
    { label: "iNaturalist Observations", url: iNaturalist("Hepatica americana") },
    { label: "Wikipedia", url: wikipedia("Hepatica nobilis") },
  ],
  "spring-beauty": [
    { label: "Go Botany — Claytonia virginica", url: goBotany("Claytonia", "virginica") },
    { label: "USDA PLANTS Database", url: usda("CLVI3") },
    { label: "iNaturalist Observations", url: iNaturalist("Claytonia virginica") },
    { label: "Wikipedia", url: wikipedia("Claytonia virginica") },
  ],
  "red-trillium": [
    { label: "Go Botany — Trillium erectum", url: goBotany("Trillium", "erectum") },
    { label: "USDA PLANTS Database", url: usda("TRER4") },
    { label: "iNaturalist Observations", url: iNaturalist("Trillium erectum") },
    { label: "Wikipedia", url: wikipedia("Trillium erectum") },
  ],
  "dutchmans-breeches": [
    { label: "Go Botany — Dicentra cucullaria", url: goBotany("Dicentra", "cucullaria") },
    { label: "USDA PLANTS Database", url: usda("DICU") },
    { label: "iNaturalist Observations", url: iNaturalist("Dicentra cucullaria") },
    { label: "Wikipedia", url: wikipedia("Dicentra cucullaria") },
  ],
  "jack-in-the-pulpit": [
    { label: "Go Botany — Arisaema triphyllum", url: goBotany("Arisaema", "triphyllum") },
    { label: "USDA PLANTS Database", url: usda("ARTR") },
    { label: "iNaturalist Observations", url: iNaturalist("Arisaema triphyllum") },
    { label: "Wikipedia", url: wikipedia("Arisaema triphyllum") },
  ],
  "wild-columbine": [
    { label: "Go Botany — Aquilegia canadensis", url: goBotany("Aquilegia", "canadensis") },
    { label: "USDA PLANTS Database", url: usda("AQCA") },
    { label: "iNaturalist Observations", url: iNaturalist("Aquilegia canadensis") },
    { label: "Wikipedia", url: wikipedia("Aquilegia canadensis") },
  ],
  "marsh-marigold": [
    { label: "Go Botany — Caltha palustris", url: goBotany("Caltha", "palustris") },
    { label: "USDA PLANTS Database", url: usda("CAPA5") },
    { label: "iNaturalist Observations", url: iNaturalist("Caltha palustris") },
    { label: "Wikipedia", url: wikipedia("Caltha palustris") },
  ],
  "foamflower": [
    { label: "Go Botany — Tiarella cordifolia", url: goBotany("Tiarella", "cordifolia") },
    { label: "USDA PLANTS Database", url: usda("TICO") },
    { label: "iNaturalist Observations", url: iNaturalist("Tiarella cordifolia") },
    { label: "Wikipedia", url: wikipedia("Tiarella cordifolia") },
  ],
  "pink-ladys-slipper": [
    { label: "Go Botany — Cypripedium acaule", url: goBotany("Cypripedium", "acaule") },
    { label: "Mass Audubon — Pink Lady's Slipper", url: "https://www.massaudubon.org/nature-wildlife/plants/pink-ladys-slipper" },
    { label: "USDA PLANTS Database", url: usda("CYAC3") },
    { label: "iNaturalist Observations", url: iNaturalist("Cypripedium acaule") },
  ],
  "mountain-laurel": [
    { label: "Go Botany — Kalmia latifolia", url: goBotany("Kalmia", "latifolia") },
    { label: "USDA PLANTS Database", url: usda("KALA") },
    { label: "iNaturalist Observations", url: iNaturalist("Kalmia latifolia") },
    { label: "Wikipedia", url: wikipedia("Kalmia latifolia") },
  ],
  "wild-geranium": [
    { label: "Go Botany — Geranium maculatum", url: goBotany("Geranium", "maculatum") },
    { label: "USDA PLANTS Database", url: usda("GEMA") },
    { label: "iNaturalist Observations", url: iNaturalist("Geranium maculatum") },
    { label: "Wikipedia", url: wikipedia("Geranium maculatum") },
  ],
  "trailing-arbutus": [
    { label: "Go Botany — Epigaea repens", url: goBotany("Epigaea", "repens") },
    { label: "USDA PLANTS Database", url: usda("EPRE2") },
    { label: "iNaturalist Observations", url: iNaturalist("Epigaea repens") },
    { label: "Wikipedia", url: wikipedia("Epigaea repens") },
  ],
  "common-milkweed": [
    { label: "Go Botany — Asclepias syriaca", url: goBotany("Asclepias", "syriaca") },
    { label: "Xerces Society Milkweed Guide", url: "https://xerces.org/milkweed" },
    { label: "USDA PLANTS Database", url: usda("ASSY") },
    { label: "iNaturalist Observations", url: iNaturalist("Asclepias syriaca") },
  ],
  "butterfly-weed": [
    { label: "Go Botany — Asclepias tuberosa", url: goBotany("Asclepias", "tuberosa") },
    { label: "USDA PLANTS Database", url: usda("ASTU") },
    { label: "iNaturalist Observations", url: iNaturalist("Asclepias tuberosa") },
    { label: "Wikipedia", url: wikipedia("Asclepias tuberosa") },
  ],
  "multiflora-rose": [
    { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
    { label: "Go Botany — Rosa multiflora", url: goBotany("Rosa", "multiflora") },
    { label: "iNaturalist Observations", url: iNaturalist("Rosa multiflora") },
    { label: "Wikipedia", url: wikipedia("Rosa multiflora") },
  ],
  "bee-balm": [
    { label: "Go Botany — Monarda didyma", url: goBotany("Monarda", "didyma") },
    { label: "USDA PLANTS Database", url: usda("MODI") },
    { label: "iNaturalist Observations", url: iNaturalist("Monarda didyma") },
    { label: "Wikipedia", url: wikipedia("Monarda didyma") },
  ],
  "joe-pye-weed": [
    { label: "Go Botany — Eutrochium purpureum", url: goBotany("Eutrochium", "purpureum") },
    { label: "USDA PLANTS Database", url: usda("EUPU21") },
    { label: "iNaturalist Observations", url: iNaturalist("Eutrochium purpureum") },
    { label: "Wikipedia", url: wikipedia("Eutrochium purpureum") },
  ],
  "cardinal-flower": [
    { label: "Go Botany — Lobelia cardinalis", url: goBotany("Lobelia", "cardinalis") },
    { label: "USDA PLANTS Database", url: usda("LOCA2") },
    { label: "iNaturalist Observations", url: iNaturalist("Lobelia cardinalis") },
    { label: "Wikipedia", url: wikipedia("Lobelia cardinalis") },
  ],
  "boneset": [
    { label: "Go Botany — Eupatorium perfoliatum", url: goBotany("Eupatorium", "perfoliatum") },
    { label: "USDA PLANTS Database", url: usda("EUPE3") },
    { label: "iNaturalist Observations", url: iNaturalist("Eupatorium perfoliatum") },
    { label: "Wikipedia", url: wikipedia("Eupatorium perfoliatum") },
  ],
  "black-eyed-susan": [
    { label: "Go Botany — Rudbeckia hirta", url: goBotany("Rudbeckia", "hirta") },
    { label: "USDA PLANTS Database", url: usda("RUHI2") },
    { label: "iNaturalist Observations", url: iNaturalist("Rudbeckia hirta") },
    { label: "Wikipedia", url: wikipedia("Rudbeckia hirta") },
  ],
  "queen-annes-lace": [
    { label: "Go Botany — Daucus carota", url: goBotany("Daucus", "carota") },
    { label: "USDA PLANTS Database", url: usda("DACA6") },
    { label: "iNaturalist Observations", url: iNaturalist("Daucus carota") },
    { label: "Wikipedia", url: wikipedia("Daucus carota") },
  ],
  "sweet-pepperbush": [
    { label: "Go Botany — Clethra alnifolia", url: goBotany("Clethra", "alnifolia") },
    { label: "USDA PLANTS Database", url: usda("CLAL3") },
    { label: "iNaturalist Observations", url: iNaturalist("Clethra alnifolia") },
    { label: "Wikipedia", url: wikipedia("Clethra alnifolia") },
  ],
  "blue-vervain": [
    { label: "Go Botany — Verbena hastata", url: goBotany("Verbena", "hastata") },
    { label: "USDA PLANTS Database", url: usda("VEHA2") },
    { label: "iNaturalist Observations", url: iNaturalist("Verbena hastata") },
    { label: "Wikipedia", url: wikipedia("Verbena hastata") },
  ],
  "turtlehead": [
    { label: "Go Botany — Chelone glabra", url: goBotany("Chelone", "glabra") },
    { label: "USDA PLANTS Database", url: usda("CHGL2") },
    { label: "iNaturalist Observations", url: iNaturalist("Chelone glabra") },
    { label: "Wikipedia", url: wikipedia("Chelone glabra") },
  ],
  "pokeweed": [
    { label: "Go Botany — Phytolacca americana", url: goBotany("Phytolacca", "americana") },
    { label: "USDA PLANTS Database", url: usda("PHAM4") },
    { label: "iNaturalist Observations", url: iNaturalist("Phytolacca americana") },
    { label: "Wikipedia", url: wikipedia("Phytolacca americana") },
  ],
  "st-johns-wort": [
    { label: "Go Botany — Hypericum perforatum", url: goBotany("Hypericum", "perforatum") },
    { label: "USDA PLANTS Database", url: usda("HYPE") },
    { label: "iNaturalist Observations", url: iNaturalist("Hypericum perforatum") },
    { label: "Wikipedia", url: wikipedia("Hypericum perforatum") },
  ],
  "new-england-aster": [
    { label: "Go Botany — Symphyotrichum novae-angliae", url: goBotany("Symphyotrichum", "novae-angliae") },
    { label: "USDA PLANTS Database", url: usda("SYNO2") },
    { label: "iNaturalist Observations", url: iNaturalist("Symphyotrichum novae-angliae") },
    { label: "Wikipedia", url: wikipedia("Symphyotrichum novae-angliae") },
  ],
  "white-wood-aster": [
    { label: "Go Botany — Eurybia divaricata", url: goBotany("Eurybia", "divaricata") },
    { label: "USDA PLANTS Database", url: usda("EUDI16") },
    { label: "iNaturalist Observations", url: iNaturalist("Eurybia divaricata") },
    { label: "Wikipedia", url: wikipedia("Eurybia divaricata") },
  ],
  "wrinkle-leaf-goldenrod": [
    { label: "Go Botany — Solidago rugosa", url: goBotany("Solidago", "rugosa") },
    { label: "USDA PLANTS Database", url: usda("SORU2") },
    { label: "iNaturalist Observations", url: iNaturalist("Solidago rugosa") },
    { label: "Wikipedia", url: wikipedia("Solidago rugosa") },
  ],
  "winterberry-holly": [
    { label: "Go Botany — Ilex verticillata", url: goBotany("Ilex", "verticillata") },
    { label: "USDA PLANTS Database", url: usda("ILVE") },
    { label: "iNaturalist Observations", url: iNaturalist("Ilex verticillata") },
    { label: "Wikipedia", url: wikipedia("Ilex verticillata") },
  ],
  "virginia-creeper": [
    { label: "Go Botany — Parthenocissus quinquefolia", url: goBotany("Parthenocissus", "quinquefolia") },
    { label: "USDA PLANTS Database", url: usda("PAQU2") },
    { label: "iNaturalist Observations", url: iNaturalist("Parthenocissus quinquefolia") },
    { label: "Wikipedia", url: wikipedia("Parthenocissus quinquefolia") },
  ],
  "sugar-maple": [
    { label: "Go Botany — Acer saccharum", url: goBotany("Acer", "saccharum") },
    { label: "USDA PLANTS Database", url: usda("ACSA3") },
    { label: "iNaturalist Observations", url: iNaturalist("Acer saccharum") },
    { label: "Wikipedia", url: wikipedia("Acer saccharum") },
  ],
  "white-oak": [
    { label: "Go Botany — Quercus alba", url: goBotany("Quercus", "alba") },
    { label: "USDA PLANTS Database", url: usda("QUAL") },
    { label: "iNaturalist Observations", url: iNaturalist("Quercus alba") },
    { label: "Wikipedia", url: wikipedia("Quercus alba") },
  ],
  "red-oak": [
    { label: "Go Botany — Quercus rubra", url: goBotany("Quercus", "rubra") },
    { label: "USDA PLANTS Database", url: usda("QURU") },
    { label: "iNaturalist Observations", url: iNaturalist("Quercus rubra") },
    { label: "Wikipedia", url: wikipedia("Quercus rubra") },
  ],
  "american-beech": [
    { label: "Go Botany — Fagus grandifolia", url: goBotany("Fagus", "grandifolia") },
    { label: "USDA PLANTS Database", url: usda("FAGR") },
    { label: "iNaturalist Observations", url: iNaturalist("Fagus grandifolia") },
    { label: "Wikipedia", url: wikipedia("Fagus grandifolia") },
  ],
  "paper-birch": [
    { label: "Go Botany — Betula papyrifera", url: goBotany("Betula", "papyrifera") },
    { label: "USDA PLANTS Database", url: usda("BEPA") },
    { label: "iNaturalist Observations", url: iNaturalist("Betula papyrifera") },
    { label: "Wikipedia", url: wikipedia("Betula papyrifera") },
  ],
  "eastern-hemlock": [
    { label: "Go Botany — Tsuga canadensis", url: goBotany("Tsuga", "canadensis") },
    { label: "USDA PLANTS Database", url: usda("TSCA") },
    { label: "iNaturalist Observations", url: iNaturalist("Tsuga canadensis") },
    { label: "Wikipedia", url: wikipedia("Tsuga canadensis") },
  ],
  "shagbark-hickory": [
    { label: "Go Botany — Carya ovata", url: goBotany("Carya", "ovata") },
    { label: "USDA PLANTS Database", url: usda("CAOV2") },
    { label: "iNaturalist Observations", url: iNaturalist("Carya ovata") },
    { label: "Wikipedia", url: wikipedia("Carya ovata") },
  ],
  "black-cherry": [
    { label: "Go Botany — Prunus serotina", url: goBotany("Prunus", "serotina") },
    { label: "USDA PLANTS Database", url: usda("PRSE2") },
    { label: "iNaturalist Observations", url: iNaturalist("Prunus serotina") },
    { label: "Wikipedia", url: wikipedia("Prunus serotina") },
  ],
  "flowering-dogwood": [
    { label: "Go Botany — Cornus florida", url: goBotany("Cornus", "florida") },
    { label: "USDA PLANTS Database", url: usda("COFL2") },
    { label: "iNaturalist Observations", url: iNaturalist("Cornus florida") },
    { label: "Wikipedia", url: wikipedia("Cornus florida") },
  ],
  "american-elm": [
    { label: "Go Botany — Ulmus americana", url: goBotany("Ulmus", "americana") },
    { label: "USDA PLANTS Database", url: usda("ULAM") },
    { label: "iNaturalist Observations", url: iNaturalist("Ulmus americana") },
    { label: "Wikipedia", url: wikipedia("Ulmus americana") },
  ],
  "black-tupelo": [
    { label: "Go Botany — Nyssa sylvatica", url: goBotany("Nyssa", "sylvatica") },
    { label: "USDA PLANTS Database", url: usda("NYSY") },
    { label: "iNaturalist Observations", url: iNaturalist("Nyssa sylvatica") },
    { label: "Wikipedia", url: wikipedia("Nyssa sylvatica") },
  ],
  "highbush-blueberry": [
    { label: "Go Botany — Vaccinium corymbosum", url: goBotany("Vaccinium", "corymbosum") },
    { label: "USDA PLANTS Database", url: usda("VACO") },
    { label: "iNaturalist Observations", url: iNaturalist("Vaccinium corymbosum") },
    { label: "Wikipedia", url: wikipedia("Vaccinium corymbosum") },
  ],
  "northern-arrowwood": [
    { label: "Go Botany — Viburnum dentatum", url: goBotany("Viburnum", "dentatum") },
    { label: "USDA PLANTS Database", url: usda("VIDE") },
    { label: "iNaturalist Observations", url: iNaturalist("Viburnum dentatum") },
    { label: "Wikipedia", url: wikipedia("Viburnum dentatum") },
  ],
  "staghorn-sumac": [
    { label: "Go Botany — Rhus typhina", url: goBotany("Rhus", "typhina") },
    { label: "USDA PLANTS Database", url: usda("RHTY") },
    { label: "iNaturalist Observations", url: iNaturalist("Rhus typhina") },
    { label: "Wikipedia", url: wikipedia("Rhus typhina") },
  ],
  "spicebush": [
    { label: "Go Botany — Lindera benzoin", url: goBotany("Lindera", "benzoin") },
    { label: "USDA PLANTS Database", url: usda("LIBE3") },
    { label: "iNaturalist Observations", url: iNaturalist("Lindera benzoin") },
    { label: "Wikipedia", url: wikipedia("Lindera benzoin") },
  ],
  "witch-hazel": [
    { label: "Go Botany — Hamamelis virginiana", url: goBotany("Hamamelis", "virginiana") },
    { label: "USDA PLANTS Database", url: usda("HAVI4") },
    { label: "iNaturalist Observations", url: iNaturalist("Hamamelis virginiana") },
    { label: "Wikipedia", url: wikipedia("Hamamelis virginiana") },
  ],
  "virginia-rose": [
    { label: "Go Botany — Rosa virginiana", url: goBotany("Rosa", "virginiana") },
    { label: "USDA PLANTS Database", url: usda("ROVI") },
    { label: "iNaturalist Observations", url: iNaturalist("Rosa virginiana") },
    { label: "Wikipedia", url: wikipedia("Rosa virginiana") },
  ],
  "sweet-fern": [
    { label: "Go Botany — Comptonia peregrina", url: goBotany("Comptonia", "peregrina") },
    { label: "USDA PLANTS Database", url: usda("COPE80") },
    { label: "iNaturalist Observations", url: iNaturalist("Comptonia peregrina") },
    { label: "Wikipedia", url: wikipedia("Comptonia peregrina") },
  ],
  "christmas-fern": [
    { label: "Go Botany — Polystichum acrostichoides", url: goBotany("Polystichum", "acrostichoides") },
    { label: "USDA PLANTS Database", url: usda("POAC4") },
    { label: "iNaturalist Observations", url: iNaturalist("Polystichum acrostichoides") },
    { label: "Wikipedia", url: wikipedia("Polystichum acrostichoides") },
  ],
  "ostrich-fern": [
    { label: "Go Botany — Matteuccia struthiopteris", url: goBotany("Matteuccia", "struthiopteris") },
    { label: "USDA PLANTS Database", url: usda("MAST") },
    { label: "iNaturalist Observations", url: iNaturalist("Matteuccia struthiopteris") },
    { label: "Wikipedia", url: wikipedia("Matteuccia struthiopteris") },
  ],
  "hay-scented-fern": [
    { label: "Go Botany — Dennstaedtia punctilobula", url: goBotany("Dennstaedtia", "punctilobula") },
    { label: "USDA PLANTS Database", url: usda("DEPU") },
    { label: "iNaturalist Observations", url: iNaturalist("Dennstaedtia punctilobula") },
    { label: "Wikipedia", url: wikipedia("Dennstaedtia punctilobula") },
  ],
  "sensitive-fern": [
    { label: "Go Botany — Onoclea sensibilis", url: goBotany("Onoclea", "sensibilis") },
    { label: "USDA PLANTS Database", url: usda("ONSE") },
    { label: "iNaturalist Observations", url: iNaturalist("Onoclea sensibilis") },
    { label: "Wikipedia", url: wikipedia("Onoclea sensibilis") },
  ],
  "royal-fern": [
    { label: "Go Botany — Osmunda regalis", url: goBotany("Osmunda", "regalis") },
    { label: "USDA PLANTS Database", url: usda("OSRE2") },
    { label: "iNaturalist Observations", url: iNaturalist("Osmunda regalis") },
    { label: "Wikipedia", url: wikipedia("Osmunda regalis") },
  ],
  "rock-polypody": [
    { label: "Go Botany — Polypodium virginianum", url: goBotany("Polypodium", "virginianum") },
    { label: "USDA PLANTS Database", url: usda("POVI5") },
    { label: "iNaturalist Observations", url: iNaturalist("Polypodium virginianum") },
    { label: "Wikipedia", url: wikipedia("Polypodium virginianum") },
  ],
  "switchgrass": [
    { label: "Go Botany — Panicum virgatum", url: goBotany("Panicum", "virgatum") },
    { label: "USDA PLANTS Database", url: usda("PAVI2") },
    { label: "iNaturalist Observations", url: iNaturalist("Panicum virgatum") },
    { label: "Wikipedia", url: wikipedia("Panicum virgatum") },
  ],
  "little-bluestem": [
    { label: "Go Botany — Schizachyrium scoparium", url: goBotany("Schizachyrium", "scoparium") },
    { label: "USDA PLANTS Database", url: usda("SCSC") },
    { label: "iNaturalist Observations", url: iNaturalist("Schizachyrium scoparium") },
    { label: "Wikipedia", url: wikipedia("Schizachyrium scoparium") },
  ],
  "common-dandelion": [
    { label: "Go Botany — Taraxacum officinale", url: goBotany("Taraxacum", "officinale") },
    { label: "USDA PLANTS Database", url: usda("TAOF") },
    { label: "iNaturalist Observations", url: iNaturalist("Taraxacum officinale") },
    { label: "Wikipedia", url: wikipedia("Taraxacum officinale") },
  ],
};

// Read the file
let content = fs.readFileSync(PLANTS_FILE, "utf8");

// For each plant, find its block and inject sources before the closing `},`
let count = 0;
let missing = [];
for (const [id, sources] of Object.entries(plantSources)) {
  // Match the plant block starting with `    id: "${id}",` and ending at its closing `},`.
  // We want to inject before the closing `},`.
  const blockRegex = new RegExp(
    `(    id: "${id}",[\\s\\S]*?\\n)(  \\},)`,
    "m"
  );
  const match = content.match(blockRegex);
  if (!match) {
    missing.push(id);
    continue;
  }
  const block = match[1];
  const closing = match[2];
  // Skip if already has sources
  if (block.includes("sources:")) {
    continue;
  }
  const sourcesLines = sources
    .map((s) => `      { label: ${JSON.stringify(s.label)}, url: ${JSON.stringify(s.url)} },`)
    .join("\n");
  const injected = `${block}    sources: [\n${sourcesLines}\n    ],\n${closing}`;
  content = content.replace(blockRegex, injected);
  count++;
}

fs.writeFileSync(PLANTS_FILE, content);
console.log(`Injected sources into ${count} plants`);
if (missing.length) {
  console.log("Missing (not matched):", missing);
}
