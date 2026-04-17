// Fetches lead image (original-size) from Wikipedia for each plant's scientific name,
// then writes `imageUrl: "..."` into plants.ts.
//
// Why Wikipedia: free, CC-licensed, high-quality botanical photos, stable URLs on upload.wikimedia.org,
// no API key needed, predictable JSON response.
//
// Strategy:
//   1. Query Wikipedia API with the scientific name as the page title
//   2. Use `prop=pageimages&piprop=original` to get the lead image URL
//   3. Fallback: if page not found, try the common name
//   4. Store the thumbnail (640px wide) URL in `imageUrl`
//
// Wikimedia allows hotlinking of Commons images for low-traffic sites per their policy.

import fs from "node:fs";
import path from "node:path";

const PLANTS_FILE = path.resolve("src/data/plants.ts");

async function fetchWikiImage(title) {
  // Try "prop=pageimages" which gives the page's lead image. Use thumbnail for reasonable size.
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("piprop", "original|thumbnail");
  url.searchParams.set("pithumbsize", "640");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", title);
  url.searchParams.set("origin", "*");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "StMarksFlora/1.0 (educational field guide; https://github.com/ikonkim2027-Korea/stmarks-flora)",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || page.missing) return null;
  // Prefer thumbnail (reasonable size) over original (can be huge)
  return page.thumbnail?.source || page.original?.source || null;
}

// Scientific name -> Wikipedia page title (usually same, but Wikipedia sometimes uses common names)
// Using scientific name is most reliable since Wikipedia maintains species pages under Latin names.
const wikiTitles = {
  "red-maple": "Acer rubrum",
  "eastern-white-pine": "Pinus strobus",
  "trout-lily": "Erythronium americanum",
  "garlic-mustard": "Alliaria petiolata",
  "cinnamon-fern": "Osmundastrum cinnamomeum",
  "japanese-barberry": "Berberis thunbergii",
  "bloodroot": "Sanguinaria",
  "hepatica": "Hepatica",
  "spring-beauty": "Claytonia virginica",
  "red-trillium": "Trillium erectum",
  "dutchmans-breeches": "Dicentra cucullaria",
  "jack-in-the-pulpit": "Arisaema triphyllum",
  "wild-columbine": "Aquilegia canadensis",
  "marsh-marigold": "Caltha palustris",
  "foamflower": "Tiarella cordifolia",
  "pink-ladys-slipper": "Cypripedium acaule",
  "mountain-laurel": "Kalmia latifolia",
  "wild-geranium": "Geranium maculatum",
  "trailing-arbutus": "Epigaea repens",
  "common-milkweed": "Asclepias syriaca",
  "butterfly-weed": "Asclepias tuberosa",
  "multiflora-rose": "Rosa multiflora",
  "bee-balm": "Monarda didyma",
  "joe-pye-weed": "Eutrochium purpureum",
  "cardinal-flower": "Lobelia cardinalis",
  "boneset": "Eupatorium perfoliatum",
  "black-eyed-susan": "Rudbeckia hirta",
  "queen-annes-lace": "Daucus carota",
  "sweet-pepperbush": "Clethra alnifolia",
  "blue-vervain": "Verbena hastata",
  "turtlehead": "Chelone glabra",
  "pokeweed": "Phytolacca americana",
  "st-johns-wort": "Hypericum perforatum",
  "new-england-aster": "Symphyotrichum novae-angliae",
  "white-wood-aster": "Eurybia divaricata",
  "wrinkle-leaf-goldenrod": "Solidago rugosa",
  "winterberry-holly": "Ilex verticillata",
  "virginia-creeper": "Parthenocissus quinquefolia",
  "sugar-maple": "Acer saccharum",
  "white-oak": "Quercus alba",
  "red-oak": "Quercus rubra",
  "american-beech": "Fagus grandifolia",
  "paper-birch": "Betula papyrifera",
  "eastern-hemlock": "Tsuga canadensis",
  "shagbark-hickory": "Carya ovata",
  "black-cherry": "Prunus serotina",
  "flowering-dogwood": "Cornus florida",
  "american-elm": "Ulmus americana",
  "black-tupelo": "Nyssa sylvatica",
  "highbush-blueberry": "Vaccinium corymbosum",
  "northern-arrowwood": "Viburnum dentatum",
  "staghorn-sumac": "Rhus typhina",
  "spicebush": "Lindera benzoin",
  "witch-hazel": "Hamamelis virginiana",
  "virginia-rose": "Rosa virginiana",
  "sweet-fern": "Comptonia peregrina",
  "christmas-fern": "Polystichum acrostichoides",
  "ostrich-fern": "Matteuccia struthiopteris",
  "hay-scented-fern": "Dennstaedtia punctilobula",
  "sensitive-fern": "Onoclea sensibilis",
  "royal-fern": "Osmunda regalis",
  "rock-polypody": "Polypodium virginianum",
  "switchgrass": "Panicum virgatum",
  "little-bluestem": "Schizachyrium scoparium",
  "common-dandelion": "Taraxacum officinale",
};

// Fetch all in parallel batches of 8
async function fetchAll() {
  const ids = Object.keys(wikiTitles);
  const results = {};
  const failures = [];
  const batchSize = 8;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (id) => {
        const title = wikiTitles[id];
        try {
          const img = await fetchWikiImage(title);
          return [id, img];
        } catch (err) {
          return [id, null];
        }
      })
    );
    for (const [id, img] of batchResults) {
      if (img) {
        results[id] = img;
      } else {
        failures.push({ id, title: wikiTitles[id] });
      }
    }
    console.log(`Fetched ${Math.min(i + batchSize, ids.length)}/${ids.length}`);
  }
  return { results, failures };
}

function main() {
  fetchAll().then(({ results, failures }) => {
    console.log(`\nFetched ${Object.keys(results).length}/${Object.keys(wikiTitles).length} images`);
    if (failures.length) {
      console.log("\nFailures:", failures);
    }

    // Save results for the update step
    fs.writeFileSync(
      path.resolve("scripts/image-urls.json"),
      JSON.stringify(results, null, 2)
    );
    console.log("\nSaved to scripts/image-urls.json");

    // Now inject into plants.ts
    let content = fs.readFileSync(PLANTS_FILE, "utf8");
    let injected = 0;
    for (const [id, imageUrl] of Object.entries(results)) {
      const regex = new RegExp(
        `(    id: "${id}",[\\s\\S]*?\\n)(  \\},)`,
        "m"
      );
      const match = content.match(regex);
      if (!match) continue;
      const block = match[1];
      const closing = match[2];
      if (block.includes("imageUrl:")) {
        // Replace existing imageUrl
        const newBlock = block.replace(
          /(\s+imageUrl: )"[^"]*"(,?)/,
          `$1${JSON.stringify(imageUrl)}$2`
        );
        content = content.replace(block, newBlock);
      } else {
        // Inject imageUrl before closing
        const injection = `${block}    imageUrl: ${JSON.stringify(imageUrl)},\n${closing}`;
        content = content.replace(regex, injection);
      }
      injected++;
    }
    fs.writeFileSync(PLANTS_FILE, content);
    console.log(`Injected imageUrl into ${injected} plants`);
  });
}

main();
