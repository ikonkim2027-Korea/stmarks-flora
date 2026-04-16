export type PlantCategory = "tree" | "shrub" | "wildflower" | "fern" | "grass" | "vine";
export type Habitat =
  | "forest-floor"
  | "woodland-edge"
  | "roadside"
  | "wetland"
  | "pond-edge"
  | "lawn-adjacent"
  | "rocky-outcrop"
  | "meadow"
  | "streambank";
export type Abundance = "abundant" | "common" | "occasional" | "uncommon";

export interface CollectionWindow {
  month: number;
  weeks: number[];
  note: string;
}

export interface Plant {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  category: PlantCategory;
  habitat: Habitat[];
  abundance: Abundance;
  collectionWindows: CollectionWindow[];
  description: string;
  identificationTips: string[];
  specimenNotes: string;
  nativeStatus: "native" | "naturalized" | "invasive";
  conservationNote?: string;
  imageUrl?: string;
  sources?: { label: string; url: string }[];
}

export const plants: Plant[] = [
  // ───────────────────────────────────────────
  // EXISTING 6 PLANTS
  // ───────────────────────────────────────────
  {
    id: "red-maple",
    scientificName: "Acer rubrum",
    commonName: "Red Maple",
    family: "Sapindaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge", "streambank"],
    abundance: "abundant",
    collectionWindows: [
      { month: 4, weeks: [1, 2, 3, 4], note: "Young leaves and flowers available" },
      { month: 5, weeks: [1, 2], note: "Samaras developing" },
      { month: 9, weeks: [3, 4], note: "Autumn color; pressing specimens" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Peak autumn foliage" },
    ],
    description:
      "One of the most abundant and widespread trees of eastern North America. Red maple is named for its brilliant scarlet autumn foliage, red flowers in early spring, and red twigs and buds in winter. It thrives in a wide range of habitats, from wet swampy ground to dry upland slopes.",
    identificationTips: [
      "Opposite leaves with 3–5 pointed lobes and V-shaped sinuses",
      "Leaf undersides are silvery-white",
      "Tiny red flowers appear before leaves in early spring",
      "Paired winged samaras (helicopter seeds) ripen in late spring",
      "Bark smooth gray on young trees, scaly and darker on older trunks",
    ],
    specimenNotes:
      "Press spring flowering branches with flowers attached. Collect autumn leaves at peak color. Samaras press well and add interest to herbarium sheets. Allow 2–3 weeks for full drying under weight.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Acer rubrum", url: "https://gobotany.nativeplanttrust.org/species/acer/rubrum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ACRU" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Acer%20rubrum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Acer_rubrum" },
    ],
  },
  {
    id: "eastern-white-pine",
    scientificName: "Pinus strobus",
    commonName: "Eastern White Pine",
    family: "Pinaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge", "rocky-outcrop"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "New growth candles elongating" },
      { month: 6, weeks: [1, 2], note: "Pollen cones active" },
      { month: 9, weeks: [1, 2, 3, 4], note: "Mature cones dropping" },
      { month: 10, weeks: [1, 2], note: "Needle bundles for pressing" },
    ],
    description:
      "The tallest tree in eastern North America, eastern white pine is a fast-growing conifer with graceful, soft blue-green needles in bundles of five. It dominates many New England forests and is a key species for wildlife habitat.",
    identificationTips: [
      "Needles in bundles of 5 (mnemonic: W-H-I-T-E = 5 letters)",
      "Long, slender curved cones 10–20 cm, often resin-coated",
      "Soft, flexible needles unlike the stiff needles of red pine",
      "Mature bark deeply furrowed into dark gray-brown ridges",
      "Horizontal branching in whorls creates layered crown",
    ],
    specimenNotes:
      "Collect needle fascicles with sheath intact. Press cone scales separately; full cones may be dried unwrapped. Young twigs with needles press well if needles are spread flat.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Pinus strobus", url: "https://gobotany.nativeplanttrust.org/species/pinus/strobus/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=PIST" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Pinus%20strobus" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Pinus_strobus" },
    ],
  },
  {
    id: "trout-lily",
    scientificName: "Erythronium americanum",
    commonName: "Trout Lily",
    family: "Liliaceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "common",
    collectionWindows: [
      { month: 4, weeks: [1, 2, 3], note: "Peak bloom — nodding yellow flowers" },
    ],
    description:
      "A delicate spring ephemeral wildflower of rich deciduous forests. Trout lily carpets the forest floor in early April before the tree canopy leafs out, taking advantage of full sunlight. Its mottled leaves resemble the spotted pattern of a brook trout.",
    identificationTips: [
      "Single nodding yellow flower with reflexed tepals",
      "Two basal leaves, mottled brownish-green on green background",
      "Blooming plants have two leaves; non-blooming have only one",
      "Blooms for only 1–2 weeks in early April",
      "Forms large colonies via underground stolons",
    ],
    specimenNotes:
      "Collect with root intact to show the corm. Press quickly as flowers wilt rapidly. Place petals face-down and spread leaves flat. These are spring ephemerals — extremely time-sensitive collection window.",
    nativeStatus: "native",
    conservationNote: "Collect minimally — only from large colonies with many blooming plants. Never collect all plants in a patch.",
    sources: [
      { label: "Go Botany — Erythronium americanum", url: "https://gobotany.nativeplanttrust.org/species/erythronium/americanum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ERAM5" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Erythronium%20americanum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Erythronium_americanum" },
    ],
  },
  {
    id: "garlic-mustard",
    scientificName: "Alliaria petiolata",
    commonName: "Garlic Mustard",
    family: "Brassicaceae",
    category: "wildflower",
    habitat: ["forest-floor", "woodland-edge", "roadside"],
    abundance: "abundant",
    collectionWindows: [
      { month: 4, weeks: [2, 3, 4], note: "White flowers in bloom" },
      { month: 5, weeks: [1, 2, 3], note: "Seed pods developing" },
    ],
    description:
      "An invasive biennial herb from Europe that has become one of the most serious woodland invaders in eastern North America. It displaces native spring wildflowers by allelopathy (releasing chemicals that inhibit other plants' growth) and disrupts mycorrhizal fungi networks.",
    identificationTips: [
      "Heart-shaped lower leaves with scalloped margins on first-year rosettes",
      "Triangular to kidney-shaped upper leaves on flowering stems",
      "Small white 4-petaled flowers in April–May",
      "Crushed leaves emit strong garlic odor",
      "Long narrow seed pods (siliques) on second-year plants",
    ],
    specimenNotes:
      "Collect freely — removal is encouraged. Press full flowering stem with roots. Good specimen for showing invasive species.",
    nativeStatus: "invasive",
    conservationNote: "Invasive species — collection and removal encouraged. Do not leave uprooted plants where seeds can disperse.",
    sources: [
      { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
      { label: "Go Botany — Alliaria petiolata", url: "https://gobotany.nativeplanttrust.org/species/alliaria/petiolata/" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Alliaria%20petiolata" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Alliaria_petiolata" },
    ],
  },
  {
    id: "cinnamon-fern",
    scientificName: "Osmundastrum cinnamomeum",
    commonName: "Cinnamon Fern",
    family: "Osmundaceae",
    category: "fern",
    habitat: ["wetland", "streambank", "pond-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2, 3, 4], note: "Fertile fronds (cinnamon-colored) visible" },
      { month: 6, weeks: [1, 2, 3, 4], note: "Full vegetative fronds for pressing" },
      { month: 7, weeks: [1, 2], note: "Large mature fronds" },
    ],
    description:
      "A large, stately fern of wet habitats, forming impressive vase-shaped clumps along streams and in swampy ground. Named for its distinctive cinnamon-brown fertile fronds that emerge in spring before the green vegetative fronds fully open.",
    identificationTips: [
      "Separate fertile fronds (cinnamon-brown, covered in spore masses) in spring",
      "Large once-pinnate green vegetative fronds up to 1.5m tall",
      "Woolly tufts of rusty-brown hairs at base of each pinna",
      "Forms large vase-shaped clumps in wet areas",
      "Pinnae not lobed to midrib (unlike interrupted fern)",
    ],
    specimenNotes:
      "Press individual pinnae rather than full fronds (too large). Include a fertile pinna if available. Fronds may require extra weight and time (3 weeks) for full pressing. Collect from established clumps only.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Osmundastrum cinnamomeum", url: "https://gobotany.nativeplanttrust.org/species/osmundastrum/cinnamomeum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=OSCI" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Osmundastrum%20cinnamomeum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Osmundastrum_cinnamomeum" },
    ],
  },
  {
    id: "japanese-barberry",
    scientificName: "Berberis thunbergii",
    commonName: "Japanese Barberry",
    family: "Berberidaceae",
    category: "shrub",
    habitat: ["woodland-edge", "roadside", "lawn-adjacent"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Small yellow flowers" },
      { month: 9, weeks: [3, 4], note: "Bright red berries; autumn leaves" },
      { month: 10, weeks: [1, 2, 3], note: "Persistent red berries on bare stems" },
    ],
    description:
      "An invasive deciduous shrub from Japan widely planted as an ornamental but now escaped into woodlands throughout the northeast. It forms dense, impenetrable thickets that exclude native vegetation and is associated with increased tick (Lyme disease) populations.",
    identificationTips: [
      "Single sharp spines at each node",
      "Small spatula-shaped leaves in clusters at spine nodes",
      "Bright red elongated berries persisting through winter",
      "Twigs with distinctive orange/yellow inner bark when cut",
      "Dense, arching, spiny branches",
    ],
    specimenNotes:
      "Collect with gloves — spines are sharp. Press leafy branches with berries when available. Good for showing invasive shrub characteristics.",
    nativeStatus: "invasive",
    conservationNote: "Invasive species — collection encouraged. Known to increase habitat suitability for Lyme disease-carrying ticks.",
    sources: [
      { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
      { label: "Go Botany — Berberis thunbergii", url: "https://gobotany.nativeplanttrust.org/species/berberis/thunbergii/" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Berberis%20thunbergii" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Berberis_thunbergii" },
    ],
  },

  // ───────────────────────────────────────────
  // APRIL — SPRING EPHEMERALS
  // ───────────────────────────────────────────
  {
    id: "bloodroot",
    scientificName: "Sanguinaria canadensis",
    commonName: "Bloodroot",
    family: "Papaveraceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "occasional",
    collectionWindows: [
      { month: 4, weeks: [1, 2], note: "Peak bloom — white flowers open on warm days" },
    ],
    description:
      "One of the earliest spring ephemerals, bloodroot sends up a single white flower wrapped in a lobed basal leaf from a thick orange-red rhizome. The flower is extremely short-lived, often lasting only one to two days. The plant gets its name from the bright orange-red sap in its roots and stems, which was used as dye by Indigenous peoples.",
    identificationTips: [
      "Single white flower with 8–12 petals and a golden center of stamens",
      "Flower wrapped by a single deeply lobed, blue-green basal leaf at emergence",
      "Broken stems and roots exude bright orange-red sap",
      "Flowers open only in sunshine and close at night",
      "Leaf expands to 15–25 cm wide after flowering ends",
    ],
    specimenNotes:
      "Collect entire plant including rhizome to show the diagnostic red sap. Press flower immediately — petals drop within hours of picking. Place petals face-down on paper and arrange the lobed leaf flat. Photograph the fresh sap color as it darkens to brown when dried.",
    nativeStatus: "native",
    conservationNote: "Collect sparingly — populations can be slow to recover. Take only from large, vigorous colonies.",
    sources: [
      { label: "Go Botany — Sanguinaria canadensis", url: "https://gobotany.nativeplanttrust.org/species/sanguinaria/canadensis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=SACA13" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Sanguinaria%20canadensis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Sanguinaria_canadensis" },
    ],
  },
  {
    id: "hepatica",
    scientificName: "Hepatica nobilis var. obtusa",
    commonName: "Round-lobed Hepatica",
    family: "Ranunculaceae",
    category: "wildflower",
    habitat: ["forest-floor", "rocky-outcrop"],
    abundance: "uncommon",
    collectionWindows: [
      { month: 4, weeks: [2, 3, 4], note: "Flowers emerging through leaf litter" },
      { month: 5, weeks: [1], note: "Late blooms; new leaves expanding" },
    ],
    description:
      "A small, early-blooming perennial of rocky deciduous woodlands. Hepatica flowers appear before its new leaves, rising through last year's persistent brown foliage. Flower color is variable, ranging from white to pale blue, lavender, or pink. The three-lobed evergreen leaves were thought to resemble the liver, giving the plant both its common and Latin names.",
    identificationTips: [
      "Flowers with 6–10 petal-like sepals in white, blue, lavender, or pink",
      "Three rounded leaf lobes (distinguishing it from sharp-lobed hepatica)",
      "Previous year's leathery brown leaves persist at base through winter",
      "Fuzzy stems (peduncles) covered in silky hairs",
      "Grows in leaf litter on rocky, well-drained slopes",
    ],
    specimenNotes:
      "Collect the entire rosette with old leaves attached for comparison to new growth. Press flowers face-down and note the color on the label, as pigments fade during drying. Handle gently — stems are delicate and snap easily.",
    nativeStatus: "native",
    conservationNote: "Uncommon in Worcester County — collect only one specimen per population. Never dig up rhizomes.",
    sources: [
      { label: "Go Botany — Hepatica americana", url: "https://gobotany.nativeplanttrust.org/species/anemone/americana/" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Hepatica%20americana" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hepatica_nobilis" },
    ],
  },
  {
    id: "spring-beauty",
    scientificName: "Claytonia virginica",
    commonName: "Spring Beauty",
    family: "Montiaceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "common",
    collectionWindows: [
      { month: 4, weeks: [3, 4], note: "First blooms appearing" },
      { month: 5, weeks: [1, 2], note: "Peak bloom — large colonies flowering" },
    ],
    description:
      "A dainty spring ephemeral that forms extensive carpets on the forest floor in early May. Each plant bears a loose raceme of small white to pale pink flowers with darker pink veins on the petals. Spring beauty grows from a small, deep corm and, like other spring ephemerals, completes its above-ground life cycle before the tree canopy closes.",
    identificationTips: [
      "Flowers white to pink with distinctive darker pink veining on each petal",
      "Only two opposite, narrow, grass-like stem leaves",
      "Flowers open on sunny days and close in overcast or cold conditions",
      "Plants 10–20 cm tall in loose clusters",
      "Grows from a small round corm deep in the soil",
    ],
    specimenNotes:
      "Dig carefully to include the corm, which is small and deep. Press the entire plant with flowers open — collect on a sunny afternoon for best results. Petals become translucent when dried, so press between sheets of waxed paper to preserve color detail.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Claytonia virginica", url: "https://gobotany.nativeplanttrust.org/species/claytonia/virginica/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CLVI3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Claytonia%20virginica" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Claytonia_virginica" },
    ],
  },
  {
    id: "red-trillium",
    scientificName: "Trillium erectum",
    commonName: "Red Trillium",
    family: "Melanthiaceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "Peak bloom — dark red flowers" },
    ],
    description:
      "A distinctive spring wildflower of rich mesic forests, red trillium bears a single dark maroon-red flower above a whorl of three broad leaves. The flower emits a faint unpleasant odor that attracts fly pollinators, earning it the folk name 'stinking Benjamin.' It grows slowly from a rhizome and can take seven or more years to reach flowering size from seed.",
    identificationTips: [
      "All parts in threes: 3 petals, 3 sepals, 3 leaves in a single whorl",
      "Dark maroon-red petals (occasionally white or yellow forms occur)",
      "Flower held on a short stalk (pedicel) above the leaf whorl",
      "Unpleasant musty odor when flower is sniffed up close",
      "Broad, diamond-shaped sessile leaves with prominent veining",
    ],
    specimenNotes:
      "Press the entire above-ground plant including the leaf whorl. Arrange leaves flat in a triangular pattern. The dark flower color preserves reasonably well when dried. Do not collect the rhizome — the plant takes years to mature and will not regenerate.",
    nativeStatus: "native",
    conservationNote: "Slow to reproduce — collect only the above-ground stem from large colonies. Never uproot the rhizome.",
    sources: [
      { label: "Go Botany — Trillium erectum", url: "https://gobotany.nativeplanttrust.org/species/trillium/erectum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=TRER4" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Trillium%20erectum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Trillium_erectum" },
    ],
  },
  {
    id: "dutchmans-breeches",
    scientificName: "Dicentra cucullaria",
    commonName: "Dutchman's Breeches",
    family: "Papaveraceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Peak bloom — pantaloon-shaped flowers" },
    ],
    description:
      "A charming spring ephemeral with finely dissected, fern-like basal leaves and an arching raceme of white flowers shaped like tiny upside-down pantaloons. It grows from a cluster of small pink-white bulblets (grain-like corms) on the forest floor. The entire above-ground plant disappears by early June as the canopy closes overhead.",
    identificationTips: [
      "White flowers with two divergent spurs resembling upside-down pantaloons",
      "Yellow tips visible at the base (opening) of each flower",
      "Finely divided, fern-like blue-green basal leaves",
      "Grows in clusters from small grain-like pink-white bulblets",
      "Entire plant disappears by June — true ephemeral",
    ],
    specimenNotes:
      "Press the entire plant including a few bulblets for the herbarium sheet. Arrange flowers along the raceme so the distinctive spur shape is visible. Dry quickly to preserve the delicate foliage. Collect from the center of large colonies only.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Dicentra cucullaria", url: "https://gobotany.nativeplanttrust.org/species/dicentra/cucullaria/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=DICU" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Dicentra%20cucullaria" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Dicentra_cucullaria" },
    ],
  },
  {
    id: "jack-in-the-pulpit",
    scientificName: "Arisaema triphyllum",
    commonName: "Jack-in-the-Pulpit",
    family: "Araceae",
    category: "wildflower",
    habitat: ["forest-floor", "wetland"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [3, 4], note: "Spathe and spadix visible" },
      { month: 6, weeks: [1, 2], note: "Late-blooming specimens" },
      { month: 9, weeks: [2, 3, 4], note: "Bright red berry cluster mature" },
    ],
    description:
      "A distinctive woodland perennial with a hooded green-and-purple striped spathe (the 'pulpit') sheltering a club-shaped spadix (the 'jack'). The plant produces one or two compound leaves, each divided into three leaflets. In autumn, the spathe withers to reveal a tight cluster of bright red berries. Plants can change sex from year to year depending on energy reserves.",
    identificationTips: [
      "Green spathe with purple or brown striping arching over the spadix",
      "One or two compound leaves each with three broad leaflets",
      "Spadix (the 'jack') is a smooth club shape hidden inside the spathe",
      "Bright red berry cluster on a stalk in September–October",
      "Grows from a corm; found in moist to wet deciduous woods",
    ],
    specimenNotes:
      "Slice the spathe lengthwise and flatten to show the spadix for pressing. Press leaves and spathe separately if the whole plant is too bulky. Berries can be preserved by slicing the cluster in half. Wear gloves — all parts contain calcium oxalate crystals that irritate skin.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Arisaema triphyllum", url: "https://gobotany.nativeplanttrust.org/species/arisaema/triphyllum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ARTR" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Arisaema%20triphyllum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Arisaema_triphyllum" },
    ],
  },
  {
    id: "wild-columbine",
    scientificName: "Aquilegia canadensis",
    commonName: "Wild Columbine",
    family: "Ranunculaceae",
    category: "wildflower",
    habitat: ["rocky-outcrop", "woodland-edge"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "Peak bloom — red and yellow flowers" },
      { month: 6, weeks: [1], note: "Late blooms; seed pods forming" },
    ],
    description:
      "A graceful native wildflower of rocky ledges and woodland edges, wild columbine produces distinctive nodding red-and-yellow flowers with long upward-pointing spurs that contain nectar. It is an important nectar source for ruby-throated hummingbirds, which arrive in Massachusetts in May just as columbine reaches peak bloom. The plant self-seeds readily on rocky, well-drained sites.",
    identificationTips: [
      "Nodding red-and-yellow flowers with 5 long tubular spurs pointing upward",
      "Yellow stamens and pistils dangle below the flower",
      "Compound leaves divided into rounded, 3-lobed leaflets with a blue-green cast",
      "Grows on rocky outcrops, ledges, and dry woodland edges",
      "Seed pods erect, splitting into 5 papery follicles",
    ],
    specimenNotes:
      "Press flowering stems with flowers in profile so the characteristic spurs are visible. Include basal leaves. Flowers retain color fairly well when dried. Collect seed pods at maturity for an additional herbarium sheet.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Aquilegia canadensis", url: "https://gobotany.nativeplanttrust.org/species/aquilegia/canadensis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=AQCA" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Aquilegia%20canadensis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Aquilegia_canadensis" },
    ],
  },
  {
    id: "marsh-marigold",
    scientificName: "Caltha palustris",
    commonName: "Marsh Marigold",
    family: "Ranunculaceae",
    category: "wildflower",
    habitat: ["wetland", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2, 3], note: "Peak bloom in wet areas" },
    ],
    description:
      "A robust wetland perennial that forms bright golden-yellow masses along stream banks and in marshy ground in mid-spring. The shiny, buttercup-like flowers and glossy kidney-shaped leaves make this one of the most conspicuous spring wildflowers in wet habitats. Despite its common name, it is not related to true marigolds but is a member of the buttercup family.",
    identificationTips: [
      "Glossy bright yellow flowers with 5–9 petal-like sepals (no true petals)",
      "Kidney-shaped to rounded dark green leaves with crenate margins",
      "Stems hollow and succulent, growing in clumps in standing water or saturated soil",
      "Leaves become very large (up to 18 cm) after flowering",
      "Found exclusively in very wet habitats — shallow water, seeps, and stream edges",
    ],
    specimenNotes:
      "Collect a stem with flowers, buds, and a basal leaf. Blot excess water thoroughly before pressing — the succulent stems hold moisture and are prone to mold. Press between extra layers of absorbent paper and change paper daily for the first 3 days.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Caltha palustris", url: "https://gobotany.nativeplanttrust.org/species/caltha/palustris/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CAPA5" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Caltha%20palustris" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Caltha_palustris" },
    ],
  },
  {
    id: "foamflower",
    scientificName: "Tiarella cordifolia",
    commonName: "Foamflower",
    family: "Saxifragaceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "Flowering racemes at peak" },
    ],
    description:
      "A low-growing woodland perennial that produces airy spikes of small white flowers above a rosette of fuzzy, maple-shaped leaves. When blooming in large colonies, the flower spikes give the forest floor a foamy appearance, hence the common name. Foamflower spreads by stolons to form extensive mats in shaded, humus-rich soils.",
    identificationTips: [
      "Slender raceme of tiny white flowers with projecting stamens giving a fuzzy look",
      "Heart-shaped to maple-shaped basal leaves with 3–5 pointed lobes",
      "Leaves softly hairy on both surfaces",
      "Spreads by above-ground stolons (runners) forming dense mats",
      "Flower stalks 15–30 cm tall, rising well above the leaf rosette",
    ],
    specimenNotes:
      "Collect a flowering stem with attached basal leaves and, if possible, a stolon showing vegetative spread. Press flowers quickly — they turn brown within hours of wilting. The delicate white flowers dry well if pressed within 30 minutes of collection.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Tiarella cordifolia", url: "https://gobotany.nativeplanttrust.org/species/tiarella/cordifolia/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=TICO" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Tiarella%20cordifolia" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Tiarella_cordifolia" },
    ],
  },
  {
    id: "pink-ladys-slipper",
    scientificName: "Cypripedium acaule",
    commonName: "Pink Lady's Slipper",
    family: "Orchidaceae",
    category: "wildflower",
    habitat: ["forest-floor"],
    abundance: "uncommon",
    collectionWindows: [
      { month: 5, weeks: [3, 4], note: "Bloom beginning under pines" },
      { month: 6, weeks: [1], note: "Late bloom; photograph only" },
    ],
    description:
      "A stunning native orchid of dry acidic woods under pines and oaks. The inflated pink pouch-shaped lip is unmistakable. This orchid depends on a specific mycorrhizal fungus for germination and growth, making it virtually impossible to transplant. Plants may take 10–15 years to flower from seed. It is uncommon and declining across much of its range due to habitat loss and over-collection.",
    identificationTips: [
      "Large inflated pink pouch (labellum) with darker pink veining and a cleft down the front",
      "Two broad, pleated basal leaves with parallel venation lying close to the ground",
      "Single flower atop a hairy scape 20–40 cm tall",
      "Lateral petals and sepals greenish-brown, twisted and spreading",
      "Found in dry, acidic soils under pine and oak canopy",
    ],
    specimenNotes:
      "DO NOT COLLECT. Photograph only. This species is protected or of conservation concern in many states and depends on mycorrhizal fungi that cannot survive collection. If a found-dead specimen is available (e.g., trampled), press the flower carefully by slicing the pouch open to flatten it.",
    nativeStatus: "native",
    conservationNote: "Do not collect — photograph only. Populations are declining and plants depend on specific mycorrhizal fungi. Listed as a species of Special Concern in Massachusetts.",
    sources: [
      { label: "Go Botany — Cypripedium acaule", url: "https://gobotany.nativeplanttrust.org/species/cypripedium/acaule/" },
      { label: "Mass Audubon — Pink Lady's Slipper", url: "https://www.massaudubon.org/nature-wildlife/plants/pink-ladys-slipper" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CYAC3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Cypripedium%20acaule" },
    ],
  },

  // ───────────────────────────────────────────
  // MAY–JUNE — LATE SPRING
  // ───────────────────────────────────────────
  {
    id: "mountain-laurel",
    scientificName: "Kalmia latifolia",
    commonName: "Mountain Laurel",
    family: "Ericaceae",
    category: "shrub",
    habitat: ["woodland-edge", "rocky-outcrop"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [2, 3, 4], note: "Peak bloom — showy flower clusters" },
    ],
    description:
      "The state flower of Connecticut, mountain laurel is an evergreen shrub that produces spectacular clusters of white to pink cup-shaped flowers in mid-June. The flowers have an ingenious catapult mechanism: bent stamens are tucked into pockets in the corolla and spring outward when triggered by a visiting bee, dusting the insect with pollen. It forms dense thickets on rocky, acidic slopes.",
    identificationTips: [
      "Cup-shaped flowers white to pink, often with a ring of dark pink spots inside",
      "Stamens bent like spring-loaded catapults, tucked into corolla pockets",
      "Leathery, glossy, dark green evergreen leaves, alternate, elliptical",
      "Gnarled, twisting trunks and branches on older specimens",
      "Brown seed capsules persist through winter in star-shaped clusters",
    ],
    specimenNotes:
      "Press a flowering branch with a few flower clusters and several leaves. Flowers are thick and fleshy — slice some in half longitudinally to show the stamen catapult mechanism. Allow extra drying time (3–4 weeks) for the leathery leaves.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Kalmia latifolia", url: "https://gobotany.nativeplanttrust.org/species/kalmia/latifolia/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=KALA" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Kalmia%20latifolia" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Kalmia_latifolia" },
    ],
  },
  {
    id: "wild-geranium",
    scientificName: "Geranium maculatum",
    commonName: "Wild Geranium",
    family: "Geraniaceae",
    category: "wildflower",
    habitat: ["woodland-edge", "forest-floor"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [3, 4], note: "Early blooms in open areas" },
      { month: 6, weeks: [1, 2, 3], note: "Peak bloom; seed capsules developing" },
    ],
    description:
      "A common late-spring wildflower of open woods and shaded roadsides, wild geranium produces loose clusters of pale lavender-pink, five-petaled flowers. After pollination, the fruit develops into a distinctive 'crane's bill' seed capsule that splits open elastically, flinging seeds several meters away. The deeply palmately lobed leaves turn reddish in autumn.",
    identificationTips: [
      "Five lavender-pink petals with darker veining, each 1.5–2 cm long",
      "Deeply palmately lobed leaves with 5 pointed segments",
      "Hairy stems and leaf stalks",
      "Distinctive elongated beak-shaped seed capsule (the 'crane's bill')",
      "Grows in partial shade along woodland edges and paths",
    ],
    specimenNotes:
      "Collect flowering stems with both flowers and developing seed capsules if possible. Press flowers face-down. Include a basal leaf to show the full leaf shape. The 'crane's bill' fruit is an excellent feature — collect mature fruits that have not yet split.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Geranium maculatum", url: "https://gobotany.nativeplanttrust.org/species/geranium/maculatum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=GEMA" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Geranium%20maculatum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Geranium_maculatum" },
    ],
  },
  {
    id: "trailing-arbutus",
    scientificName: "Epigaea repens",
    commonName: "Trailing Arbutus",
    family: "Ericaceae",
    category: "wildflower",
    habitat: ["forest-floor", "rocky-outcrop"],
    abundance: "uncommon",
    collectionWindows: [
      { month: 4, weeks: [1, 2, 3], note: "Fragrant flowers under leaf litter" },
    ],
    description:
      "One of the earliest spring-blooming wildflowers and the state flower of Massachusetts, trailing arbutus produces clusters of small, intensely fragrant pink-white flowers close to the ground among last year's leaf litter. This creeping evergreen subshrub grows on acidic, sandy soils in pine-oak forests. It has declined significantly due to over-collection and habitat disturbance.",
    identificationTips: [
      "Small tubular pink to white flowers in clusters, extremely fragrant",
      "Leathery, oval evergreen leaves that lie flat on the ground",
      "Stems trailing and hairy, creeping along the forest floor",
      "Blooms very early (April) often hidden under dead leaves",
      "Found on sandy, acidic soils under pines and oaks",
    ],
    specimenNotes:
      "DO NOT COLLECT — this is the Massachusetts state flower and is protected. Photograph only. If a naturally detached fragment is found, it may be pressed, but never uproot or cut living plants. The plant has a fragile root system and rarely survives disturbance.",
    nativeStatus: "native",
    conservationNote: "State flower of Massachusetts. Protected by state law — do not collect. Photograph only. Populations have declined dramatically from historical over-picking.",
    sources: [
      { label: "Go Botany — Epigaea repens", url: "https://gobotany.nativeplanttrust.org/species/epigaea/repens/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=EPRE2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Epigaea%20repens" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Epigaea_repens" },
    ],
  },
  {
    id: "common-milkweed",
    scientificName: "Asclepias syriaca",
    commonName: "Common Milkweed",
    family: "Apocynaceae",
    category: "wildflower",
    habitat: ["roadside", "meadow"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [4], note: "Flower buds forming" },
      { month: 7, weeks: [1, 2, 3], note: "Peak bloom — fragrant pink flower globes" },
      { month: 9, weeks: [3, 4], note: "Mature seed pods splitting open" },
      { month: 10, weeks: [1, 2], note: "Silk-bearing seeds dispersing" },
    ],
    description:
      "The most widespread milkweed in eastern North America and the primary host plant for monarch butterfly caterpillars. Large spherical clusters of fragrant pink-purple flowers attract many pollinators in midsummer. All parts exude milky white latex when broken. The large warty seed pods split in autumn to release seeds attached to silky parachute fibers.",
    identificationTips: [
      "Large spherical flower clusters (umbels) of pink-purple flowers",
      "Thick opposite leaves, oblong, with prominent pale midrib and milky sap",
      "Stout upright stems 1–1.5 m tall exuding white latex when broken",
      "Large warty green seed pods (follicles) 8–12 cm long",
      "Seeds with silky white 'parachutes' for wind dispersal in autumn",
    ],
    specimenNotes:
      "Press flowering stems — blot the milky sap with paper towels immediately as it stains and creates sticky patches. Press a seed pod halved lengthwise to show seed arrangement. Collect silk-bearing seeds separately in an envelope. Allow extra drying time for the thick stems.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Asclepias syriaca", url: "https://gobotany.nativeplanttrust.org/species/asclepias/syriaca/" },
      { label: "Xerces Society Milkweed Guide", url: "https://xerces.org/milkweed" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ASSY" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Asclepias%20syriaca" },
    ],
  },
  {
    id: "butterfly-weed",
    scientificName: "Asclepias tuberosa",
    commonName: "Butterfly Weed",
    family: "Apocynaceae",
    category: "wildflower",
    habitat: ["roadside", "meadow"],
    abundance: "occasional",
    collectionWindows: [
      { month: 7, weeks: [1, 2, 3], note: "Peak bloom — bright orange flowers" },
    ],
    description:
      "A striking milkweed with vivid orange flowers that is unusual among milkweeds in having clear (not milky) sap. It grows on dry, well-drained roadsides and open fields. Butterfly weed is an important nectar source for butterflies and a host plant for monarch caterpillars, though less commonly used than common milkweed. The deep taproot makes this plant drought-tolerant but difficult to transplant.",
    identificationTips: [
      "Bright orange flower clusters (unlike the pink/purple of other milkweeds)",
      "Clear watery sap, not milky white (unique among milkweeds)",
      "Alternate leaves (most milkweeds have opposite leaves) — narrow, lance-shaped",
      "Hairy stems, often multiple stems from the base",
      "Grows in dry, sunny, well-drained sites along roads and in sandy meadows",
    ],
    specimenNotes:
      "Press flowering stems with open flowers. Orange color preserves well when dried. Include developing seed pods if available. No milky sap to deal with, making pressing easier than other milkweeds.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Asclepias tuberosa", url: "https://gobotany.nativeplanttrust.org/species/asclepias/tuberosa/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ASTU" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Asclepias%20tuberosa" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Asclepias_tuberosa" },
    ],
  },
  {
    id: "multiflora-rose",
    scientificName: "Rosa multiflora",
    commonName: "Multiflora Rose",
    family: "Rosaceae",
    category: "shrub",
    habitat: ["woodland-edge", "roadside"],
    abundance: "abundant",
    collectionWindows: [
      { month: 6, weeks: [1, 2, 3], note: "Peak bloom — masses of white flowers" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Red rose hips for pressing" },
    ],
    description:
      "An extremely aggressive invasive shrub introduced from East Asia for erosion control and highway median plantings. It forms impenetrable arching thickets along woodland edges and roadsides, smothering native vegetation. A single plant can produce up to 500,000 seeds per year, which are dispersed by birds. It is now one of the most problematic invasive plants in the northeastern United States.",
    identificationTips: [
      "Clusters of many small white flowers (1.5–2 cm) with 5 petals in June",
      "Recurved thorns on arching canes",
      "Fringed stipules (comb-like projections) at the base of each leaf stalk",
      "Pinnately compound leaves with 7–9 small, serrated leaflets",
      "Small red rose hips in clusters persisting through winter",
    ],
    specimenNotes:
      "Collect freely — removal is beneficial. Press a flowering branch with thorns visible and stipules intact (these fringed stipules are the key diagnostic feature). Wear heavy gloves. Press rose hips separately in autumn.",
    nativeStatus: "invasive",
    conservationNote: "Highly invasive — collection and removal strongly encouraged. Produces up to 500,000 seeds per plant annually.",
    sources: [
      { label: "Massachusetts Invasive Plant List", url: "https://www.mass.gov/info-details/plant-species-listed-by-the-massachusetts-invasive-plant-advisory-group" },
      { label: "Go Botany — Rosa multiflora", url: "https://gobotany.nativeplanttrust.org/species/rosa/multiflora/" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Rosa%20multiflora" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rosa_multiflora" },
    ],
  },

  // ───────────────────────────────────────────
  // SUMMER — JULY–AUGUST
  // ───────────────────────────────────────────
  {
    id: "bee-balm",
    scientificName: "Monarda didyma",
    commonName: "Bee Balm",
    family: "Lamiaceae",
    category: "wildflower",
    habitat: ["woodland-edge", "meadow", "streambank"],
    abundance: "occasional",
    collectionWindows: [
      { month: 7, weeks: [1, 2, 3, 4], note: "Peak bloom — scarlet tubular flowers" },
    ],
    description:
      "A showy native wildflower of moist woodland edges and streambanks, bee balm produces dense rounded heads of brilliant scarlet tubular flowers. The plant is a member of the mint family, with characteristic square stems and aromatic leaves. It is a top nectar source for ruby-throated hummingbirds and various butterflies and bees in midsummer.",
    identificationTips: [
      "Dense rounded head of bright scarlet tubular flowers",
      "Square stems (characteristic of the mint family)",
      "Opposite toothed leaves that are strongly aromatic when crushed (minty-citrus scent)",
      "Reddish-tinged bracts beneath the flower head",
      "Grows 60–120 cm tall in moist, partially shaded sites",
    ],
    specimenNotes:
      "Press a flowering stem with the terminal flower head intact. Slice thick flower heads in half for better pressing. The scarlet color darkens to deep red-brown when dried. Include a note about the aromatic scent on the label, as this is lost in drying.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Monarda didyma", url: "https://gobotany.nativeplanttrust.org/species/monarda/didyma/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=MODI" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Monarda%20didyma" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Monarda_didyma" },
    ],
  },
  {
    id: "joe-pye-weed",
    scientificName: "Eutrochium purpureum",
    commonName: "Sweet Joe-Pye Weed",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["wetland", "meadow", "pond-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [4], note: "Flower buds forming" },
      { month: 8, weeks: [1, 2, 3], note: "Peak bloom — large domed pink clusters" },
    ],
    description:
      "A tall, commanding native wildflower of moist meadows and pond margins, reaching 1–2 meters tall. Large domed clusters of dusty pink-purple flowers attract a spectacular diversity of butterflies and bees in late summer. The whorled leaves emit a vanilla-like scent when crushed. The plant is named for a Mohican healer named Joe Pye who reportedly used it for treating typhus fever.",
    identificationTips: [
      "Very tall (1–2 m) with large domed flower clusters of dusty pink-purple",
      "Leaves in whorls of 3–5 around the stem, lance-shaped with serrated edges",
      "Stem green or lightly purple-speckled (not solid dark purple like spotted joe-pye weed)",
      "Crushed leaves have a vanilla-like fragrance",
      "Found in moist to wet open habitats — meadow edges, pond margins",
    ],
    specimenNotes:
      "Collect a section of stem showing a leaf whorl plus the terminal flower cluster. The full plant is too tall to press whole — cut a 40–50 cm section from the top. Press flower clusters between extra layers of blotting paper as they hold moisture. Note the vanilla scent on the label.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Eutrochium purpureum", url: "https://gobotany.nativeplanttrust.org/species/eutrochium/purpureum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=EUPU21" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Eutrochium%20purpureum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Eutrochium_purpureum" },
    ],
  },
  {
    id: "cardinal-flower",
    scientificName: "Lobelia cardinalis",
    commonName: "Cardinal Flower",
    family: "Campanulaceae",
    category: "wildflower",
    habitat: ["streambank", "wetland"],
    abundance: "occasional",
    collectionWindows: [
      { month: 7, weeks: [4], note: "First flowers opening at base of spike" },
      { month: 8, weeks: [1, 2, 3], note: "Peak bloom — brilliant red spikes" },
    ],
    description:
      "One of the most strikingly colored native wildflowers, cardinal flower produces tall spikes of intensely red tubular flowers along stream banks and in wet meadows. The flowers are perfectly shaped for pollination by ruby-throated hummingbirds. This short-lived perennial persists by forming basal rosettes that overwinter and replace the parent plant. It is uncommon enough that colonies should be left undisturbed.",
    identificationTips: [
      "Brilliant scarlet-red flowers in a tall terminal spike (raceme)",
      "Individual flowers bilaterally symmetric with a protruding staminal column",
      "Lance-shaped, toothed alternate leaves along an unbranched stem",
      "Grows 60–120 cm tall, exclusively in very wet habitats near water",
      "Milky sap in stems when broken",
    ],
    specimenNotes:
      "Collect sparingly — take a mid-stem section with several flowers from a large colony only. Press flowers in profile to show the distinctive shape. Red color darkens to deep maroon when dried. Blot any milky sap before pressing.",
    nativeStatus: "native",
    conservationNote: "Collect minimally — populations are often small. Leave the basal rosette intact so the plant can regenerate.",
    sources: [
      { label: "Go Botany — Lobelia cardinalis", url: "https://gobotany.nativeplanttrust.org/species/lobelia/cardinalis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=LOCA2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Lobelia%20cardinalis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Lobelia_cardinalis" },
    ],
  },
  {
    id: "boneset",
    scientificName: "Eupatorium perfoliatum",
    commonName: "Boneset",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["wetland", "meadow", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [4], note: "Flower buds forming" },
      { month: 8, weeks: [1, 2, 3], note: "Peak bloom — flat-topped white clusters" },
    ],
    description:
      "A distinctive wetland wildflower easily identified by its opposite leaves that are fused at the base, so the hairy stem appears to grow directly through them (perfoliate). Flat-topped clusters of dull white flowers bloom in late summer and attract many pollinators. The plant was historically used in folk medicine to treat 'break-bone fever' (dengue) and other ailments, giving it its common name.",
    identificationTips: [
      "Opposite leaves fused at the base so the stem appears to pierce through them (perfoliate)",
      "Flat-topped clusters of dull white fuzzy flowers",
      "Leaves lance-shaped, wrinkled, hairy, with conspicuous venation",
      "Stems stout, hairy, and upright, 60–120 cm tall",
      "Grows in wet meadows, ditches, and streambanks",
    ],
    specimenNotes:
      "Collect a stem section clearly showing the perfoliate leaf arrangement — this is the key diagnostic feature. Press the flower cluster between extra blotting paper. Label the perfoliate leaf character prominently on the herbarium sheet.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Eupatorium perfoliatum", url: "https://gobotany.nativeplanttrust.org/species/eupatorium/perfoliatum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=EUPE3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Eupatorium%20perfoliatum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Eupatorium_perfoliatum" },
    ],
  },
  {
    id: "black-eyed-susan",
    scientificName: "Rudbeckia hirta",
    commonName: "Black-eyed Susan",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["meadow", "roadside"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [1, 2, 3, 4], note: "Peak bloom — golden-yellow flowers" },
      { month: 8, weeks: [1, 2], note: "Continued bloom; seed heads forming" },
    ],
    description:
      "A cheerful biennial or short-lived perennial wildflower that lights up meadows and roadsides with its golden-yellow ray flowers surrounding a prominent dark brown-black central cone. The entire plant is rough-hairy to the touch. It is extremely common along roadsides and in disturbed meadows throughout central Massachusetts and blooms prolifically throughout July and August.",
    identificationTips: [
      "Golden-yellow ray flowers (8–20) surrounding a dark brown-black domed center",
      "Entire plant rough-hairy (hispid) on stems and leaves",
      "Basal leaves spatula-shaped; stem leaves narrower and alternate",
      "Flower heads 5–8 cm across on long stalks",
      "Grows 30–100 cm tall in full sun on roadsides and in meadows",
    ],
    specimenNotes:
      "Press flower heads face-down with rays spread flat. The yellow color preserves well. Include basal and stem leaves to show the difference. Collect multiple flower heads at different stages (bud, open, seeding) for a complete specimen.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Rudbeckia hirta", url: "https://gobotany.nativeplanttrust.org/species/rudbeckia/hirta/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=RUHI2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Rudbeckia%20hirta" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rudbeckia_hirta" },
    ],
  },
  {
    id: "queen-annes-lace",
    scientificName: "Daucus carota",
    commonName: "Queen Anne's Lace",
    family: "Apiaceae",
    category: "wildflower",
    habitat: ["roadside", "meadow"],
    abundance: "abundant",
    collectionWindows: [
      { month: 7, weeks: [1, 2, 3, 4], note: "Peak bloom — flat white umbels" },
      { month: 8, weeks: [1, 2], note: "Bird's nest seed heads forming" },
    ],
    description:
      "A naturalized biennial from Europe that is the wild ancestor of the cultivated carrot. The flat-topped white flower clusters (compound umbels) are among the most common roadside flowers of midsummer. As seeds mature, the umbel curls inward to form a distinctive 'bird's nest' shape. The tap root smells like carrot when freshly dug. Caution is needed to distinguish this plant from the highly toxic poison hemlock.",
    identificationTips: [
      "Flat compound umbel of tiny white flowers, often with a single dark purple floret at center",
      "Finely divided, feathery (carrot-like) leaves",
      "Hairy stems (important — poison hemlock has smooth, purple-spotted stems)",
      "Mature umbels curl inward to form a 'bird's nest' shape",
      "Tap root smells distinctly of carrot when dug and crushed",
    ],
    specimenNotes:
      "Press an open umbel face-down with flowers spread flat, plus a 'bird's nest' fruiting umbel for comparison. Include the finely divided leaves. Excellent teaching specimen for distinguishing from toxic look-alikes — label the hairy stem character clearly.",
    nativeStatus: "naturalized",
    conservationNote: "Naturalized from Europe — the wild ancestor of cultivated carrots. Collect freely. Caution: distinguish from toxic poison hemlock (Conium maculatum), which has smooth purple-spotted stems.",
    sources: [
      { label: "Go Botany — Daucus carota", url: "https://gobotany.nativeplanttrust.org/species/daucus/carota/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=DACA6" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Daucus%20carota" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Daucus_carota" },
    ],
  },
  {
    id: "sweet-pepperbush",
    scientificName: "Clethra alnifolia",
    commonName: "Sweet Pepperbush",
    family: "Clethraceae",
    category: "shrub",
    habitat: ["pond-edge", "wetland", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [3, 4], note: "Flower spikes opening; intense fragrance" },
      { month: 8, weeks: [1, 2], note: "Peak bloom" },
    ],
    description:
      "A deciduous native shrub of pond margins and swampy areas, sweet pepperbush fills the summer air with an intensely sweet, spicy fragrance from its upright spikes of small white flowers. It is one of the most aromatic native shrubs in New England and a valuable late-summer nectar source for bees and butterflies. The distinctive small pepper-like seed capsules persist through winter.",
    identificationTips: [
      "Upright terminal racemes of small, fragrant white flowers in mid-to-late July",
      "Alternate, obovate leaves with sharply toothed margins and wedge-shaped base",
      "Intensely sweet, spicy fragrance detectable from several meters away",
      "Small round pepper-like seed capsules persisting through winter on brown spikes",
      "Multi-stemmed shrub 1–3 m tall in wet habitats near ponds and streams",
    ],
    specimenNotes:
      "Press a branch with a flowering spike and several leaves. Note the fragrance on the label — it is entirely lost during drying. Collect winter specimens with persistent seed capsules for a second herbarium sheet.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Clethra alnifolia", url: "https://gobotany.nativeplanttrust.org/species/clethra/alnifolia/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CLAL3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Clethra%20alnifolia" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Clethra_alnifolia" },
    ],
  },
  {
    id: "blue-vervain",
    scientificName: "Verbena hastata",
    commonName: "Blue Vervain",
    family: "Verbenaceae",
    category: "wildflower",
    habitat: ["roadside", "pond-edge", "meadow"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [4], note: "First flowers opening" },
      { month: 8, weeks: [1, 2, 3], note: "Peak bloom — blue flower rings ascending spikes" },
    ],
    description:
      "A tall, stiffly erect wetland wildflower with distinctive candelabra-like branching and multiple slender spikes of small violet-blue flowers. The flowers open in a ring that progresses upward along each spike over several weeks, so only a narrow band of flowers is open on any given day. Found along moist roadsides, pond edges, and ditches throughout the Southborough area.",
    identificationTips: [
      "Multiple slender pencil-like flower spikes in a candelabra arrangement",
      "Tiny violet-blue flowers open in a narrow ring that moves up each spike",
      "Opposite, lance-shaped leaves with coarsely serrated margins",
      "Stiff, square stems (like mints, but in a different family)",
      "Grows 60–150 cm tall in moist, sunny habitats",
    ],
    specimenNotes:
      "Press a stem showing the candelabra branching pattern with flower spikes. The small flowers are individually unremarkable, but the ascending ring-bloom pattern is the key feature — note this on the label. Include a section showing the opposite leaves.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Verbena hastata", url: "https://gobotany.nativeplanttrust.org/species/verbena/hastata/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=VEHA2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Verbena%20hastata" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Verbena_hastata" },
    ],
  },
  {
    id: "turtlehead",
    scientificName: "Chelone glabra",
    commonName: "White Turtlehead",
    family: "Plantaginaceae",
    category: "wildflower",
    habitat: ["streambank", "wetland"],
    abundance: "occasional",
    collectionWindows: [
      { month: 8, weeks: [1, 2, 3, 4], note: "Peak bloom — white turtle-head flowers" },
      { month: 9, weeks: [1], note: "Late blooms; seed capsules forming" },
    ],
    description:
      "A wetland wildflower with flowers that resemble a turtle's head with its mouth open. The white to pale pink bilaterally symmetric flowers are tightly clustered in a short terminal spike. Turtlehead is the exclusive larval host plant for the Baltimore checkerspot butterfly. It grows along stream banks and in wet meadows in late summer.",
    identificationTips: [
      "White to pale pink flowers shaped like a turtle's head with the mouth slightly open",
      "Flowers in a tight terminal cluster (short dense spike)",
      "Opposite, lance-shaped, sharply serrated dark green leaves",
      "Stems smooth (glabrous), erect, unbranched, 60–100 cm tall",
      "Exclusively in wet habitats — stream margins, seeps, wet meadows",
    ],
    specimenNotes:
      "Press a stem with the terminal flower cluster. Slice one or two flowers lengthwise to show the interior structure, which is useful for identification. The white color is preserved well in pressing. Include a pair of opposite leaves with the serrated margin visible.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Chelone glabra", url: "https://gobotany.nativeplanttrust.org/species/chelone/glabra/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CHGL2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Chelone%20glabra" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Chelone_glabra" },
    ],
  },
  {
    id: "pokeweed",
    scientificName: "Phytolacca americana",
    commonName: "Pokeweed",
    family: "Phytolaccaceae",
    category: "wildflower",
    habitat: ["woodland-edge", "roadside"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [3, 4], note: "White flower racemes" },
      { month: 8, weeks: [2, 3, 4], note: "Dark purple berries ripening" },
      { month: 9, weeks: [1, 2], note: "Mature berries and magenta stems" },
    ],
    description:
      "A large, robust native perennial that can reach 3 meters tall by late summer. The stems turn vivid magenta-pink as the season progresses and the drooping clusters of dark purple-black berries are conspicuous in autumn. All parts of the plant are toxic to humans, especially the root and mature berries. The berry juice produces a vivid magenta dye and was historically used as ink.",
    identificationTips: [
      "Very large plant (1–3 m) with thick, smooth stems turning bright magenta-pink",
      "Long drooping racemes of small white-green flowers followed by dark purple berries",
      "Large alternate leaves, elliptical, 15–30 cm long, with an unpleasant odor when crushed",
      "Berries in drooping clusters, each berry a flattened sphere with about 10 segments",
      "Massive perennial root — plant dies back completely in winter",
    ],
    specimenNotes:
      "Wear gloves — all parts are toxic, and berry juice stains permanently. Press a stem section with flowers or berries and a few leaves. Berry juice will stain pressing paper — place waxed paper between the specimen and blotting sheets. Label as toxic on the herbarium sheet.",
    nativeStatus: "native",
    conservationNote: "All parts are toxic to humans. Handle with gloves. Label clearly as poisonous on all herbarium specimens.",
    sources: [
      { label: "Go Botany — Phytolacca americana", url: "https://gobotany.nativeplanttrust.org/species/phytolacca/americana/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=PHAM4" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Phytolacca%20americana" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Phytolacca_americana" },
    ],
  },
  {
    id: "st-johns-wort",
    scientificName: "Hypericum perforatum",
    commonName: "Common St. John's Wort",
    family: "Hypericaceae",
    category: "wildflower",
    habitat: ["roadside", "meadow"],
    abundance: "common",
    collectionWindows: [
      { month: 7, weeks: [1, 2, 3], note: "Peak bloom — yellow flowers around July 4th" },
    ],
    description:
      "A naturalized perennial from Europe that blooms prolifically along roadsides and in dry meadows in early to mid-July, traditionally around the feast of St. John the Baptist (June 24). The bright yellow flowers have a distinctive feature: dark glandular dots along the petal margins that release a red pigment (hypericin) when crushed. The leaves, when held up to light, show translucent dots — oil glands that give the species its name 'perforatum.'",
    identificationTips: [
      "Bright yellow 5-petaled flowers with black dots along petal margins",
      "Leaves with translucent dots visible when held up to sunlight (perforated appearance)",
      "Opposite, sessile, oblong leaves on a round two-ridged stem",
      "Numerous stamens in 3 clusters giving flowers a brushy center",
      "Grows 30–90 cm tall in dry, sunny roadsides and disturbed ground",
    ],
    specimenNotes:
      "Press flowering stems — the yellow color preserves well. Point out the black petal dots on the label. Hold a fresh leaf to light and photograph the translucent glands before pressing, as this feature is hard to see on dried specimens.",
    nativeStatus: "naturalized",
    sources: [
      { label: "Go Botany — Hypericum perforatum", url: "https://gobotany.nativeplanttrust.org/species/hypericum/perforatum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=HYPE" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Hypericum%20perforatum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hypericum_perforatum" },
    ],
  },

  // ───────────────────────────────────────────
  // FALL — SEPTEMBER–NOVEMBER
  // ───────────────────────────────────────────
  {
    id: "new-england-aster",
    scientificName: "Symphyotrichum novae-angliae",
    commonName: "New England Aster",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["meadow", "roadside"],
    abundance: "common",
    collectionWindows: [
      { month: 9, weeks: [1, 2, 3, 4], note: "Peak bloom — deep purple flowers" },
      { month: 10, weeks: [1, 2], note: "Late blooms; fluffy seed heads" },
    ],
    description:
      "The showiest of New England's fall asters, this tall wildflower produces abundant large flower heads in rich shades of deep purple to violet with golden-yellow disk centers. It is the dominant roadside wildflower in September across central Massachusetts. The sticky, hairy stems and clasping leaf bases distinguish it from the many other aster species that bloom at the same time.",
    identificationTips: [
      "Large flower heads (2.5–4 cm) with deep purple to violet rays and golden-yellow disk",
      "Stems and leaves conspicuously hairy and sticky (glandular)",
      "Leaf bases clasp the stem (auriculate) — wrapping partway around it",
      "Grows 60–180 cm tall, often leaning or flopping under the weight of flowers",
      "Blooms September–October in sunny roadsides and meadow edges",
    ],
    specimenNotes:
      "Press a flowering stem tip with several flower heads and clasping leaves. Purple ray color fades to pale lavender-blue when dried — note the fresh color on the label. The sticky stems will adhere to pressing paper; use waxed paper as a barrier.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Symphyotrichum novae-angliae", url: "https://gobotany.nativeplanttrust.org/species/symphyotrichum/novae-angliae/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=SYNO2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Symphyotrichum%20novae-angliae" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Symphyotrichum_novae-angliae" },
    ],
  },
  {
    id: "white-wood-aster",
    scientificName: "Eurybia divaricata",
    commonName: "White Wood Aster",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 9, weeks: [1, 2, 3], note: "Peak bloom in shaded areas" },
    ],
    description:
      "One of the few asters that thrives in dry shade, white wood aster produces loose, flat-topped clusters of small white flower heads with yellow disk flowers that turn reddish-purple with age. It is an abundant late-season wildflower of dry deciduous forests and woodland trails. The distinctive dark, wiry, zigzagging stems and heart-shaped lower leaves make this species easy to recognize.",
    identificationTips: [
      "Small white flower heads with only 5–9 ray flowers per head",
      "Disk flowers yellow at first, aging to reddish-purple",
      "Dark, wiry stems that zigzag slightly between nodes",
      "Lower leaves heart-shaped with coarsely toothed margins and long petioles",
      "Grows in dry deciduous shade — one of few asters in deep forest",
    ],
    specimenNotes:
      "Press a stem with the flat-topped flower cluster and at least one heart-shaped basal leaf. The wiry zigzag stem is diagnostic — arrange it to show this feature. White rays preserve well. Include both fresh (yellow disk) and older (purple disk) flower heads if possible.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Eurybia divaricata", url: "https://gobotany.nativeplanttrust.org/species/eurybia/divaricata/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=EUDI16" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Eurybia%20divaricata" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Eurybia_divaricata" },
    ],
  },
  {
    id: "wrinkle-leaf-goldenrod",
    scientificName: "Solidago rugosa",
    commonName: "Wrinkle-leaf Goldenrod",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["meadow", "roadside", "woodland-edge"],
    abundance: "abundant",
    collectionWindows: [
      { month: 8, weeks: [4], note: "First flowers opening" },
      { month: 9, weeks: [1, 2, 3, 4], note: "Peak bloom — golden plumes" },
      { month: 10, weeks: [1, 2], note: "Late bloom; fluffy seed heads" },
    ],
    description:
      "One of the most common goldenrods in central Massachusetts, wrinkle-leaf goldenrod forms golden arching plumes of tiny yellow flower heads along roadsides and in meadows from late August through October. The species is named for its distinctively wrinkled (rugose) leaves. Contrary to popular belief, goldenrods do not cause hay fever — their pollen is insect-carried, not wind-borne. Ragweed, which blooms at the same time, is the actual culprit.",
    identificationTips: [
      "Arching, one-sided pyramid-shaped flower clusters (panicles) of tiny golden-yellow heads",
      "Leaves conspicuously wrinkled (rugose) with strongly impressed veins",
      "Stem hairy, especially in the upper portion",
      "Alternate leaves, elliptical, sharply toothed, rough-textured",
      "Grows 60–150 cm tall in sunny to partly shaded roadsides and meadows",
    ],
    specimenNotes:
      "Press a stem showing the arching flower plume and several wrinkled leaves. Yellow color preserves reasonably well. Include a close-up of the rugose leaf surface detail. Goldenrod is very common — collect freely for teaching collections.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Solidago rugosa", url: "https://gobotany.nativeplanttrust.org/species/solidago/rugosa/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=SORU2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Solidago%20rugosa" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Solidago_rugosa" },
    ],
  },
  {
    id: "winterberry-holly",
    scientificName: "Ilex verticillata",
    commonName: "Winterberry Holly",
    family: "Aquifoliaceae",
    category: "shrub",
    habitat: ["wetland", "pond-edge", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 10, weeks: [1, 2, 3, 4], note: "Bright red berries on bare branches" },
      { month: 11, weeks: [1, 2, 3], note: "Berries persisting after leaf drop" },
    ],
    description:
      "A deciduous native holly of wet habitats that is most conspicuous in autumn and early winter, when its dense clusters of bright red berries persist on bare, leafless branches. Unlike the familiar evergreen hollies, winterberry drops its leaves in fall, making the brilliant red fruit display even more striking. It is dioecious — only female plants bear fruit, and a male plant must be nearby for pollination.",
    identificationTips: [
      "Bright red berries densely clustered along bare branches in autumn/winter",
      "Deciduous (unlike most hollies) — drops its leaves to reveal fruit",
      "Alternate, elliptical, finely toothed leaves that turn black in autumn before falling",
      "Multi-stemmed shrub 1–3 m tall in wet soils near ponds and streams",
      "Berries very small (5–8 mm), in tight clusters directly against the twig",
    ],
    specimenNotes:
      "Collect berry-laden branches after leaf drop for the most striking specimens. Press berries between extra padding — they are juicy and can stain. Include a summer-collected branch with leaves for comparison. Berries shrivel but retain red color when dried.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Ilex verticillata", url: "https://gobotany.nativeplanttrust.org/species/ilex/verticillata/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ILVE" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Ilex%20verticillata" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ilex_verticillata" },
    ],
  },
  {
    id: "virginia-creeper",
    scientificName: "Parthenocissus quinquefolia",
    commonName: "Virginia Creeper",
    family: "Vitaceae",
    category: "vine",
    habitat: ["woodland-edge", "forest-floor", "roadside"],
    abundance: "abundant",
    collectionWindows: [
      { month: 9, weeks: [3, 4], note: "Brilliant red-purple autumn foliage" },
      { month: 10, weeks: [1, 2, 3], note: "Peak fall color; dark blue berries" },
    ],
    description:
      "A vigorous native woody vine that climbs trees and walls using adhesive-tipped tendrils. Virginia creeper is one of the first plants to turn color in autumn, producing brilliant scarlet to deep burgundy foliage. The dark blue berries on bright red stalks are an important food source for birds. It is frequently confused with poison ivy, but is easily distinguished by its five leaflets versus three.",
    identificationTips: [
      "Palmately compound leaves with 5 leaflets (poison ivy has 3)",
      "Tendrils with adhesive disks at tips — sticks to bark, stone, and brick",
      "Brilliant scarlet to burgundy fall color, among the earliest to change",
      "Dark blue berries on bright red stalks (pedicels) in autumn",
      "Coarsely toothed leaflets radiating from a single point",
    ],
    specimenNotes:
      "Press a vine section with a full leaf (5 leaflets arranged flat) and tendrils showing adhesive disks. Collect at peak fall color for the most attractive specimen. Include a berry cluster if available. Red foliage color fades to brown — note the original color on the label.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Parthenocissus quinquefolia", url: "https://gobotany.nativeplanttrust.org/species/parthenocissus/quinquefolia/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=PAQU2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Parthenocissus%20quinquefolia" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Parthenocissus_quinquefolia" },
    ],
  },

  // ───────────────────────────────────────────
  // TREES
  // ───────────────────────────────────────────
  {
    id: "sugar-maple",
    scientificName: "Acer saccharum",
    commonName: "Sugar Maple",
    family: "Sapindaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Flowers and young leaves" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Peak autumn foliage — yellow, orange, scarlet" },
    ],
    description:
      "The iconic tree of New England's autumn, sugar maple produces the most spectacular fall foliage of any North American tree — rich yellows, oranges, and scarlets, often on a single tree. It is also the source of maple syrup, produced from sap collected in late winter. Sugar maple is a dominant canopy tree of rich, mesic upland forests across central Massachusetts. It is distinguished from red maple by its U-shaped leaf sinuses and more rounded lobes.",
    identificationTips: [
      "Opposite leaves with 5 lobes and smooth, U-shaped sinuses (red maple has V-shaped sinuses)",
      "Leaf lobes with few coarse teeth, not finely serrated like red maple",
      "Bark on older trees develops long, shaggy, vertical plates",
      "Paired samaras with wings nearly parallel (red maple's wings diverge widely)",
      "Fall color yellow to orange to scarlet, often multiple colors on one tree",
    ],
    specimenNotes:
      "Collect autumn leaves at peak color showing the range of shades. Press spring flowering branches with developing leaves. Compare pressed specimens side-by-side with red maple to highlight the diagnostic differences in sinus shape and samaras.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Acer saccharum", url: "https://gobotany.nativeplanttrust.org/species/acer/saccharum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ACSA3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Acer%20saccharum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Acer_saccharum" },
    ],
  },
  {
    id: "white-oak",
    scientificName: "Quercus alba",
    commonName: "White Oak",
    family: "Fagaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Catkins and tiny new leaves" },
      { month: 9, weeks: [3, 4], note: "Acorns maturing" },
      { month: 10, weeks: [1, 2, 3], note: "Autumn foliage — wine-red to russet" },
    ],
    description:
      "A long-lived, majestic tree that is one of the most important hardwoods of eastern North American forests. White oak can live over 400 years and develop a massive spreading crown. Its acorns are the preferred food of many wildlife species because they are lower in tannins than red oak acorns. The leaves have rounded lobes without bristle tips, which is the defining characteristic of the white oak group.",
    identificationTips: [
      "Leaves with 7–9 rounded lobes without bristle tips (key white oak group character)",
      "Bark light gray, broken into loose, scaly vertical blocks",
      "Acorns with a warty, shallow cap covering about one-quarter of the nut",
      "Acorns mature in one year (red oaks take two years)",
      "Autumn color variable — wine-red, russet, or brown; leaves often persist into winter",
    ],
    specimenNotes:
      "Press leaves showing the full outline of rounded lobes. Collect acorns with caps attached — dry them separately (do not press, as they are too thick). Include a bark photograph or rubbing for the herbarium sheet. White oak leaves are large — use full-size herbarium paper.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Quercus alba", url: "https://gobotany.nativeplanttrust.org/species/quercus/alba/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=QUAL" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Quercus%20alba" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Quercus_alba" },
    ],
  },
  {
    id: "red-oak",
    scientificName: "Quercus rubra",
    commonName: "Northern Red Oak",
    family: "Fagaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "abundant",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Catkins and new leaf growth" },
      { month: 9, weeks: [3, 4], note: "Acorns maturing" },
      { month: 10, weeks: [1, 2, 3], note: "Autumn foliage — russet to dark red" },
    ],
    description:
      "The fastest-growing oak in North America, northern red oak is a dominant canopy tree in the forests around St. Mark's School. It produces large acorns that take two years to mature, a hallmark of the red oak group. The leaves have pointed lobes tipped with tiny bristles, distinguishing it from white oak's rounded lobes. It is valued for its timber, its role in forest ecology, and its dependable russet-red fall color.",
    identificationTips: [
      "Leaves with 7–11 pointed lobes, each tipped with a small bristle",
      "Sinuses cut less than halfway to the midrib (unlike pin oak or scarlet oak)",
      "Bark on mature trees develops broad, flat-topped ridges with 'ski trail' stripes",
      "Acorns large (2–3 cm) with a flat, saucer-shaped cap covering only the top",
      "Acorns take two years to mature (look for tiny first-year acorns and larger second-year ones)",
    ],
    specimenNotes:
      "Press leaves arranged to show the pointed, bristle-tipped lobes clearly. Collect acorns at maturity with caps attached. Include a first-year immature acorn alongside a mature one to show the two-year cycle. Bark rubbings are a useful addition to the herbarium sheet.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Quercus rubra", url: "https://gobotany.nativeplanttrust.org/species/quercus/rubra/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=QURU" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Quercus%20rubra" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Quercus_rubra" },
    ],
  },
  {
    id: "american-beech",
    scientificName: "Fagus grandifolia",
    commonName: "American Beech",
    family: "Fagaceae",
    category: "tree",
    habitat: ["forest-floor"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2], note: "Silky new leaves expanding from cigar-shaped buds" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Golden autumn foliage; spiny bur-enclosed nuts" },
      { month: 11, weeks: [1, 2], note: "Persistent tan leaves (marcescent) on young trees" },
    ],
    description:
      "A stately forest tree easily recognized by its smooth, pale gray bark that persists into old age — unlike most hardwoods whose bark becomes furrowed. American beech produces small triangular nuts enclosed in spiny burs that are relished by wildlife. Young beech trees retain their pale tan dead leaves through winter (marcescence), rustling in the wind and making them conspicuous in the winter forest.",
    identificationTips: [
      "Smooth, pale silver-gray bark even on large old trees (distinctive among hardwoods)",
      "Long, slender, cigar-shaped pointed winter buds",
      "Simple elliptical leaves with straight parallel veins ending in coarse teeth",
      "Small triangular nuts in pairs inside a spiny, 4-valved bur",
      "Young trees retain dead tan leaves through winter (marcescent foliage)",
    ],
    specimenNotes:
      "Press leaves that show the parallel venation and toothed margin clearly. Collect the spiny bur with nuts inside — halve it to show the triangular nut shape. A winter twig showing the long pointed buds makes an excellent supplementary specimen. Bark photographs are useful since the smooth bark cannot be rubbed.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Fagus grandifolia", url: "https://gobotany.nativeplanttrust.org/species/fagus/grandifolia/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=FAGR" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Fagus%20grandifolia" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Fagus_grandifolia" },
    ],
  },
  {
    id: "paper-birch",
    scientificName: "Betula papyrifera",
    commonName: "Paper Birch",
    family: "Betulaceae",
    category: "tree",
    habitat: ["woodland-edge", "streambank"],
    abundance: "occasional",
    collectionWindows: [
      { month: 4, weeks: [3, 4], note: "Male catkins elongating" },
      { month: 5, weeks: [1, 2], note: "Female catkins and new leaves" },
      { month: 10, weeks: [1, 2, 3], note: "Golden autumn foliage" },
    ],
    description:
      "A graceful tree instantly recognized by its brilliant white, papery bark that peels in horizontal sheets. Paper birch is a pioneer species that colonizes open areas after disturbance. It reaches the southern limit of its main range in central Massachusetts and is less common here than farther north in New England. The bark was historically used by Indigenous peoples for canoes, containers, and writing surfaces.",
    identificationTips: [
      "Bright white bark that peels in papery horizontal sheets",
      "Doubly serrate, ovate leaves with pointed tip and wedge-shaped base",
      "Drooping male catkins in spring (formed the previous autumn)",
      "Small upright female catkins that disintegrate at maturity, releasing tiny winged nutlets",
      "Bark on young twigs reddish-brown, becoming white on branches over ~5 cm diameter",
    ],
    specimenNotes:
      "Press leafy branches with catkins if in season. Include a small piece of peeling bark — but never strip bark from living trees, as this can kill them. Collect naturally shed bark from the ground. Yellow fall foliage presses well and retains color.",
    nativeStatus: "native",
    conservationNote: "Near the southern edge of its primary range in Worcester County. Do not peel bark from living trees — it causes permanent scarring and can be fatal.",
    sources: [
      { label: "Go Botany — Betula papyrifera", url: "https://gobotany.nativeplanttrust.org/species/betula/papyrifera/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=BEPA" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Betula%20papyrifera" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Betula_papyrifera" },
    ],
  },
  {
    id: "eastern-hemlock",
    scientificName: "Tsuga canadensis",
    commonName: "Eastern Hemlock",
    family: "Pinaceae",
    category: "tree",
    habitat: ["forest-floor", "streambank", "rocky-outcrop"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "New bright green growth tips" },
      { month: 6, weeks: [1, 2], note: "Small cones developing" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Mature cones; evergreen foliage for pressing" },
    ],
    description:
      "A shade-tolerant evergreen conifer that forms dense, dark groves along streams and on north-facing slopes. Eastern hemlock creates a cool, humid microclimate beneath its canopy that supports unique plant and animal communities. It is currently under severe threat from the hemlock woolly adelgid, an invasive insect from East Asia that is decimating hemlock populations across New England.",
    identificationTips: [
      "Short flat needles (8–15 mm) with two white stripes on the underside, attached by tiny stalks",
      "Very small cones (1.5–2.5 cm) hanging from branch tips",
      "Feathery, graceful branches with a drooping leader (top of tree nods to one side)",
      "Bark on mature trees deeply furrowed, reddish-brown to gray",
      "Look for woolly white masses on branch undersides (hemlock woolly adelgid infestation)",
    ],
    specimenNotes:
      "Press branchlets with needles and cones attached. The flat needles press easily. Include a close-up photo of the two white bands on the needle underside. If woolly adelgid is present, note this on the label but do not transport infested material to new areas.",
    nativeStatus: "native",
    conservationNote: "Severely threatened by hemlock woolly adelgid (Adelges tsugae). Report infestations to the Massachusetts DCR. Do not transport branches from infested trees.",
    sources: [
      { label: "Go Botany — Tsuga canadensis", url: "https://gobotany.nativeplanttrust.org/species/tsuga/canadensis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=TSCA" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Tsuga%20canadensis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Tsuga_canadensis" },
    ],
  },
  {
    id: "shagbark-hickory",
    scientificName: "Carya ovata",
    commonName: "Shagbark Hickory",
    family: "Juglandaceae",
    category: "tree",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [1, 2, 3], note: "Large compound leaves expanding" },
      { month: 10, weeks: [1, 2, 3], note: "Nuts in thick husks dropping; autumn foliage" },
    ],
    description:
      "A tall hardwood tree easily identified by its extraordinarily shaggy bark — long strips of bark curve outward at top and bottom while remaining attached at the center, giving the trunk a ragged appearance. The large nuts, enclosed in a thick four-valved husk, are edible and sweet-flavored. The extremely hard, shock-resistant wood was historically the preferred material for tool handles and baseball bats.",
    identificationTips: [
      "Long shaggy bark strips curving outward from the trunk (diagnostic at any season)",
      "Pinnately compound leaves with 5 leaflets (occasionally 7), the terminal 3 much larger",
      "Leaflets finely serrated with tufts of hair on the teeth",
      "Large round nuts in a thick, four-valved green husk that splits to the base when ripe",
      "Stout twigs with large terminal buds covered in overlapping dark brown scales",
    ],
    specimenNotes:
      "Press a single compound leaf spread flat — these are large, so use full-size paper. Photograph the shaggy bark in the field. Collect nuts with husks — halve the husk to show the nut inside. Include a twig with the large terminal bud for winter identification.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Carya ovata", url: "https://gobotany.nativeplanttrust.org/species/carya/ovata/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=CAOV2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Carya%20ovata" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Carya_ovata" },
    ],
  },
  {
    id: "black-cherry",
    scientificName: "Prunus serotina",
    commonName: "Black Cherry",
    family: "Rosaceae",
    category: "tree",
    habitat: ["woodland-edge", "roadside"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "Drooping racemes of white flowers" },
      { month: 7, weeks: [3, 4], note: "Dark red to black ripe fruit" },
      { month: 8, weeks: [1], note: "Late fruit; leaf glands visible" },
    ],
    description:
      "The largest native cherry tree in North America, black cherry produces drooping clusters of small white flowers in May followed by dark red-black fruit in midsummer. The fruit is an important food source for birds and other wildlife. The bark of mature trees is distinctive — dark, scaly plates with upturned edges, often described as 'burnt potato chips.' All parts of the plant except the ripe fruit flesh contain cyanogenic glycosides.",
    identificationTips: [
      "Elongated drooping racemes of small white flowers (not flat clusters like chokecherry)",
      "Dark reddish-black bark in mature trees with scaly plates with upturned edges",
      "Leaves alternate, finely serrated, with a glossy dark green upper surface",
      "One or two small reddish glands on the leaf stalk (petiole) near the blade base",
      "Crushed bark and leaves have a bitter almond smell (cyanide compounds)",
    ],
    specimenNotes:
      "Press a flowering raceme and a fruiting raceme as separate specimens. Include leaves showing the petiolar glands (use a hand lens to verify). Note the bitter almond scent of crushed bark on the label — this is lost when dried. Ripe berries stain pressing paper.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Prunus serotina", url: "https://gobotany.nativeplanttrust.org/species/prunus/serotina/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=PRSE2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Prunus%20serotina" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Prunus_serotina" },
    ],
  },
  {
    id: "flowering-dogwood",
    scientificName: "Cornus florida",
    commonName: "Flowering Dogwood",
    family: "Cornaceae",
    category: "tree",
    habitat: ["woodland-edge", "forest-floor"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [1, 2, 3], note: "Showy white bracts at peak display" },
      { month: 10, weeks: [1, 2, 3], note: "Red fruit clusters; crimson autumn foliage" },
    ],
    description:
      "A beloved understory tree prized for its stunning spring display. What appear to be large white 'petals' are actually four petal-like bracts surrounding a tight cluster of tiny yellowish-green true flowers. In autumn it produces clusters of glossy red drupes and deep crimson foliage. Populations have declined significantly due to dogwood anthracnose disease caused by the fungus Discula destructiva.",
    identificationTips: [
      "Four large white (or rarely pink) petal-like bracts with a notch at each tip",
      "True flowers are tiny, yellowish-green, clustered in the center of the bracts",
      "Opposite, simple, ovate leaves with arcuate (curved) venation following the leaf margin",
      "Bark broken into small squarish blocks in an alligator-hide pattern on mature trees",
      "Tight clusters of glossy red drupes in September–October",
    ],
    specimenNotes:
      "Press a flowering branch with all four bracts spread flat. The bracts dry well and retain their shape. Collect a fruiting branch in autumn as a separate specimen. Photograph the distinctive bark. Note any anthracnose symptoms (brown leaf blotches, cankers) if present.",
    nativeStatus: "native",
    conservationNote: "Populations declining due to dogwood anthracnose (Discula destructiva). Note disease symptoms on specimens if observed.",
    sources: [
      { label: "Go Botany — Cornus florida", url: "https://gobotany.nativeplanttrust.org/species/cornus/florida/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=COFL2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Cornus%20florida" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cornus_florida" },
    ],
  },
  {
    id: "american-elm",
    scientificName: "Ulmus americana",
    commonName: "American Elm",
    family: "Ulmaceae",
    category: "tree",
    habitat: ["roadside", "lawn-adjacent", "streambank"],
    abundance: "occasional",
    collectionWindows: [
      { month: 4, weeks: [1, 2], note: "Tiny reddish flowers before leaf-out" },
      { month: 5, weeks: [1, 2], note: "Papery winged samaras and young leaves" },
      { month: 10, weeks: [1, 2, 3], note: "Golden-yellow autumn foliage" },
    ],
    description:
      "Once the quintessential street tree of American towns, American elm was devastated by Dutch elm disease in the mid-20th century. Surviving specimens and young trees can still be found along roadsides and near streams. The tree is recognized by its classic vase-shaped crown, with branches arching gracefully outward and upward. It flowers inconspicuously in early April before the leaves emerge.",
    identificationTips: [
      "Classic vase-shaped crown on mature trees (branches arch outward and upward)",
      "Leaves alternate, doubly serrate, with an asymmetric (lopsided) base",
      "Papery, flat, oval samaras with a notched tip, ripening in May",
      "Bark with deep, interlacing ridges in a diamond pattern on mature trunks",
      "Tiny reddish-purple flowers in clusters along twigs in early April (before leaves)",
    ],
    specimenNotes:
      "Collect spring flowering twigs before leaves emerge. Press leaves showing the diagnostic asymmetric base clearly. Include the papery samaras — they press perfectly flat. Photograph the vase-shaped crown from a distance for the herbarium sheet.",
    nativeStatus: "native",
    conservationNote: "Populations reduced by Dutch elm disease (Ophiostoma novo-ulmi). Surviving trees may be resistant — note the tree's health on the label.",
    sources: [
      { label: "Go Botany — Ulmus americana", url: "https://gobotany.nativeplanttrust.org/species/ulmus/americana/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ULAM" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Ulmus%20americana" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ulmus_americana" },
    ],
  },
  {
    id: "black-tupelo",
    scientificName: "Nyssa sylvatica",
    commonName: "Black Tupelo",
    family: "Nyssaceae",
    category: "tree",
    habitat: ["wetland", "forest-floor", "pond-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3], note: "Inconspicuous flowers; glossy new leaves" },
      { month: 10, weeks: [1, 2, 3], note: "Spectacular scarlet autumn foliage; dark blue fruits" },
      { month: 11, weeks: [1], note: "Late fall color persisting" },
    ],
    description:
      "One of the most spectacular trees for autumn color in New England, black tupelo reliably produces brilliant scarlet to deep red foliage earlier than most other deciduous trees. It grows in a variety of habitats from wet swampy ground to dry upland ridges. The dark blue-black drupes are an important food for migrating birds in autumn. The wood is extremely tough and cross-grained, making it nearly impossible to split.",
    identificationTips: [
      "Simple, alternate, glossy obovate leaves, entire (no teeth), leathery in texture",
      "Among the first trees to turn brilliant scarlet in autumn (often by late September)",
      "Bark on mature trees deeply furrowed into thick rectangular blocks resembling alligator skin",
      "Small dark blue-black oval drupes on long stalks, ripening in September–October",
      "Horizontal branching pattern gives the crown a distinctive layered appearance",
    ],
    specimenNotes:
      "Collect autumn foliage at peak scarlet color — the brilliant red darkens to brown-red during drying, so note the fresh color. Press the glossy summer leaves as well. Include a cluster of dark fruits if available. Photograph the deeply furrowed bark.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Nyssa sylvatica", url: "https://gobotany.nativeplanttrust.org/species/nyssa/sylvatica/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=NYSY" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Nyssa%20sylvatica" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Nyssa_sylvatica" },
    ],
  },

  // ───────────────────────────────────────────
  // SHRUBS
  // ───────────────────────────────────────────
  {
    id: "highbush-blueberry",
    scientificName: "Vaccinium corymbosum",
    commonName: "Highbush Blueberry",
    family: "Ericaceae",
    category: "shrub",
    habitat: ["wetland", "woodland-edge", "pond-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "White bell-shaped flowers" },
      { month: 7, weeks: [2, 3, 4], note: "Ripe blueberries" },
      { month: 10, weeks: [1, 2, 3], note: "Brilliant red-orange autumn foliage" },
    ],
    description:
      "The wild ancestor of cultivated blueberries, highbush blueberry is a common native shrub of swamp edges and moist acidic woods. It produces dangling clusters of white bell-shaped flowers in May, followed by sweet blue-black berries in July. In autumn, the foliage turns brilliant shades of scarlet, orange, and crimson, making it one of the most colorful native shrubs.",
    identificationTips: [
      "Clusters of small white to pinkish urn-shaped (bell-shaped) flowers in spring",
      "Blue-black berries with a whitish waxy bloom and a 5-pointed crown at the tip",
      "Alternate, simple, elliptical leaves with fine-serrated or entire margins",
      "Twigs greenish to reddish, with small warty dots (lenticels)",
      "Multi-stemmed shrub 1–3 m tall in wet acidic soils; brilliant red autumn color",
    ],
    specimenNotes:
      "Press flowering branches in May and fruiting branches in July as separate specimens. Berries are juicy and will stain — place between waxed paper sheets. Autumn foliage color preserves fairly well. Include multiple stages for a complete life-cycle display.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Vaccinium corymbosum", url: "https://gobotany.nativeplanttrust.org/species/vaccinium/corymbosum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=VACO" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Vaccinium%20corymbosum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Vaccinium_corymbosum" },
    ],
  },
  {
    id: "northern-arrowwood",
    scientificName: "Viburnum dentatum",
    commonName: "Northern Arrowwood",
    family: "Adoxaceae",
    category: "shrub",
    habitat: ["woodland-edge", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [1, 2, 3], note: "Flat-topped white flower clusters" },
      { month: 9, weeks: [3, 4], note: "Blue-black berries; autumn foliage" },
      { month: 10, weeks: [1, 2], note: "Persistent berries; reddish-purple leaves" },
    ],
    description:
      "A common native shrub of woodland edges and stream corridors, arrowwood produces flat-topped clusters of small white flowers in June followed by blue-black berries that are relished by birds. The name comes from its straight stems, which Native peoples used for arrow shafts. The coarsely toothed, opposite leaves with straight parallel veins are distinctive.",
    identificationTips: [
      "Flat-topped clusters (cymes) of small white flowers in June",
      "Opposite, simple, coarsely toothed leaves with very straight, parallel veins",
      "Straight, slender stems — typically unbranched for much of their length",
      "Blue-black drupes in flat clusters in September–October",
      "Multi-stemmed shrub 1–3 m tall; reddish-purple autumn color",
    ],
    specimenNotes:
      "Press a flowering branch showing the flat-topped cyme and opposite leaves. The straight parallel veining is a key character — arrange leaves to show this clearly. Collect a fruiting branch separately. Berries shrivel when dried but retain their dark color.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Viburnum dentatum", url: "https://gobotany.nativeplanttrust.org/species/viburnum/dentatum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=VIDE" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Viburnum%20dentatum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Viburnum_dentatum" },
    ],
  },
  {
    id: "staghorn-sumac",
    scientificName: "Rhus typhina",
    commonName: "Staghorn Sumac",
    family: "Anacardiaceae",
    category: "shrub",
    habitat: ["roadside", "woodland-edge", "meadow"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [3, 4], note: "Yellow-green flower clusters" },
      { month: 8, weeks: [1, 2, 3, 4], note: "Dense red fuzzy fruit clusters (drupes)" },
      { month: 10, weeks: [1, 2, 3], note: "Brilliant orange-red autumn foliage" },
    ],
    description:
      "A colonial shrub or small tree that forms dense thickets along roadsides and field edges. Staghorn sumac is named for its velvety-hairy branches that resemble the fuzzy antlers of a male deer in velvet. The dense, cone-shaped clusters of fuzzy red fruits persist through winter and can be steeped in water to make a tart, lemonade-like drink. It is not related to poison sumac, which grows in swamps and has white berries.",
    identificationTips: [
      "Thick branches covered in dense velvety brown hairs (like deer antlers in velvet)",
      "Large pinnately compound leaves with 11–31 lance-shaped, serrated leaflets",
      "Dense, upright, cone-shaped clusters of fuzzy dark red fruits (drupes)",
      "Colonial — forms thickets via root suckers",
      "Brilliant orange-red to scarlet autumn foliage; milky sap in stems",
    ],
    specimenNotes:
      "Press individual leaflets rather than whole compound leaves (too large). Include a section of the fuzzy stem and a portion of the fruit cluster. The velvety stem hairs and red fruit preserve well. Clearly label this as NOT poison sumac to avoid confusion.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Rhus typhina", url: "https://gobotany.nativeplanttrust.org/species/rhus/typhina/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=RHTY" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Rhus%20typhina" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rhus_typhina" },
    ],
  },
  {
    id: "spicebush",
    scientificName: "Lindera benzoin",
    commonName: "Northern Spicebush",
    family: "Lauraceae",
    category: "shrub",
    habitat: ["forest-floor", "wetland", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 4, weeks: [1, 2], note: "Tiny yellow flowers before leaf-out — very early" },
      { month: 9, weeks: [2, 3, 4], note: "Glossy red drupes; aromatic yellow autumn leaves" },
    ],
    description:
      "One of the first shrubs to bloom in spring, spicebush produces clusters of tiny yellow flowers along its twigs before the leaves emerge. The entire plant is strongly aromatic — crushing any part releases a spicy, citrus-like fragrance. Glossy red drupes ripen in September and are eaten by birds, especially wood thrushes. Spicebush is the sole larval host plant for the spicebush swallowtail butterfly.",
    identificationTips: [
      "Tiny yellow flowers in dense clusters directly on twigs, appearing before leaves in early April",
      "All parts strongly aromatic when crushed — spicy, citrus-like scent",
      "Alternate, simple, entire (untoothed), elliptical leaves",
      "Glossy bright red oval drupes in September, each containing a single seed",
      "Twigs slender and greenish with small pale lenticels; snap a twig and smell the spicy fragrance",
    ],
    specimenNotes:
      "Collect flowering twigs in early April before leaves appear. The tiny flowers are inconspicuous — press them carefully so they remain attached. Collect a fruiting branch in September as a separate specimen. Note the aromatic scent on the label — it is lost in drying.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Lindera benzoin", url: "https://gobotany.nativeplanttrust.org/species/lindera/benzoin/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=LIBE3" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Lindera%20benzoin" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Lindera_benzoin" },
    ],
  },
  {
    id: "witch-hazel",
    scientificName: "Hamamelis virginiana",
    commonName: "Witch Hazel",
    family: "Hamamelidaceae",
    category: "shrub",
    habitat: ["forest-floor", "woodland-edge"],
    abundance: "common",
    collectionWindows: [
      { month: 10, weeks: [3, 4], note: "Spidery yellow flowers opening" },
      { month: 11, weeks: [1, 2, 3], note: "Peak bloom — yellow flowers on bare branches" },
    ],
    description:
      "Remarkable for flowering in late October and November when most other plants have finished for the season, witch hazel produces clusters of spidery, fragrant, yellow flowers with ribbon-like petals. It often blooms as its leaves are falling, and flowers may persist on bare branches into December. The previous year's seed capsules mature simultaneously, ejecting two small black seeds explosively up to 10 meters away.",
    identificationTips: [
      "Spidery yellow flowers with 4 narrow, ribbon-like, crinkled petals, blooming October–November",
      "Flowers appear as leaves are falling or on bare branches",
      "Alternate, broadly oval leaves with wavy-toothed margins and asymmetric base",
      "Woody seed capsules that split open explosively, ejecting seeds with an audible pop",
      "Understory shrub or small tree 3–5 m tall with spreading, zigzag branches",
    ],
    specimenNotes:
      "Collect flowering branches showing both flowers and any remaining autumn leaves. Press the ribbon-like petals carefully — they curl easily. Include a mature seed capsule showing the open valves. This is one of very few specimens collectible in November.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Hamamelis virginiana", url: "https://gobotany.nativeplanttrust.org/species/hamamelis/virginiana/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=HAVI4" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Hamamelis%20virginiana" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hamamelis_virginiana" },
    ],
  },
  {
    id: "virginia-rose",
    scientificName: "Rosa virginiana",
    commonName: "Virginia Rose",
    family: "Rosaceae",
    category: "shrub",
    habitat: ["roadside", "woodland-edge", "meadow"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [2, 3, 4], note: "Pink flowers in bloom" },
      { month: 7, weeks: [1, 2], note: "Late flowers; rose hips developing" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Red rose hips; glossy red-purple autumn foliage" },
    ],
    description:
      "A native wild rose of roadsides and field edges, Virginia rose produces fragrant pink flowers in June and July and bright red rose hips that persist into winter. Unlike the invasive multiflora rose, it has a non-aggressive growth habit and typically forms loose, open colonies rather than impenetrable thickets. The glossy foliage turns attractive shades of red and purple in autumn.",
    identificationTips: [
      "Pink 5-petaled flowers 5–6 cm across with a yellow stamen center",
      "Paired, curved thorns at the nodes (not the single straight spines of multiflora rose)",
      "Stipules narrow, not fringed (multiflora rose has fringed, comb-like stipules)",
      "Pinnately compound leaves usually with 7 glossy, sharply serrated leaflets",
      "Red round rose hips (1 cm) persisting through winter",
    ],
    specimenNotes:
      "Press flowering stems showing the paired thorns and narrow stipules — these features distinguish it from invasive multiflora rose. Include the stipule close-up on the herbarium sheet. Collect rose hips in autumn. Pink petal color fades to pale lavender when dried.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Rosa virginiana", url: "https://gobotany.nativeplanttrust.org/species/rosa/virginiana/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ROVI" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Rosa%20virginiana" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rosa_virginiana" },
    ],
  },
  {
    id: "sweet-fern",
    scientificName: "Comptonia peregrina",
    commonName: "Sweet Fern",
    family: "Myricaceae",
    category: "shrub",
    habitat: ["roadside", "woodland-edge"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [2, 3], note: "Catkins and new aromatic leaves" },
      { month: 6, weeks: [1, 2, 3], note: "Full foliage; strong fragrance" },
      { month: 9, weeks: [1, 2, 3], note: "Burr-like fruits; aromatic foliage" },
    ],
    description:
      "Despite its common name, sweet fern is not a fern but a low deciduous shrub with deeply lobed, fern-like leaves that are intensely fragrant when crushed. It grows on dry, sandy, acidic roadsides and disturbed areas, often in poor soil where few other shrubs thrive. The leaves have a sweet, balsamic, resinous fragrance that is released when brushed against or crushed. It fixes nitrogen through root nodules, allowing it to colonize nutrient-poor soils.",
    identificationTips: [
      "Narrow, deeply lobed leaves that look like fern fronds but are on a woody shrub",
      "Intensely aromatic when crushed — sweet, balsamic, resinous scent",
      "Low, colonial shrub 60–120 cm tall on dry, sandy, acidic sites",
      "Small burr-like fruits enclosed by spiny bracts in late summer",
      "Grows in poor, dry soils along roadsides and power-line cuts where little else thrives",
    ],
    specimenNotes:
      "Press a branch with several leaves spread flat to show the fern-like lobing. The aromatic oils persist somewhat in dried specimens. Include catkins or burr-like fruits if in season. Note the fragrance on the label — it is the plant's most memorable characteristic.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Comptonia peregrina", url: "https://gobotany.nativeplanttrust.org/species/comptonia/peregrina/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=COPE80" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Comptonia%20peregrina" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Comptonia_peregrina" },
    ],
  },

  // ───────────────────────────────────────────
  // FERNS
  // ───────────────────────────────────────────
  {
    id: "christmas-fern",
    scientificName: "Polystichum acrostichoides",
    commonName: "Christmas Fern",
    family: "Dryopteridaceae",
    category: "fern",
    habitat: ["forest-floor", "rocky-outcrop"],
    abundance: "abundant",
    collectionWindows: [
      { month: 4, weeks: [3, 4], note: "Fiddleheads uncoiling with silvery scales" },
      { month: 6, weeks: [1, 2, 3, 4], note: "Full fronds; fertile pinnae on upper fronds" },
      { month: 11, weeks: [1, 2, 3, 4], note: "Evergreen fronds persisting through winter" },
    ],
    description:
      "The most common evergreen fern of New England forests, Christmas fern stays green through winter, lying flat against the forest floor under the snow. The common name comes from its use in holiday decorations and the fact that each pinna (leaflet) is shaped like a Christmas stocking, with a small lobe (the 'toe') at the base. Fertile pinnae at the frond tip are distinctly smaller and bear brown sori on their undersides.",
    identificationTips: [
      "Evergreen — green fronds visible even in winter, lying flat on the forest floor",
      "Each pinna has a small 'ear' or lobe at the base on the upper side (looks like a stocking toe)",
      "Leathery, glossy dark green once-pinnate fronds in a vase-shaped cluster",
      "Fertile pinnae near the frond tip are noticeably smaller and bear round brown sori underneath",
      "Fiddleheads in spring covered with conspicuous silvery-white scales",
    ],
    specimenNotes:
      "Press a full frond — they are the right size for standard herbarium paper. Include a fertile frond showing the smaller upper pinnae with sori. Evergreen fronds collected in winter show the persistent character. These are abundant — excellent for student practice pressing.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Polystichum acrostichoides", url: "https://gobotany.nativeplanttrust.org/species/polystichum/acrostichoides/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=POAC4" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Polystichum%20acrostichoides" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Polystichum_acrostichoides" },
    ],
  },
  {
    id: "ostrich-fern",
    scientificName: "Matteuccia struthiopteris",
    commonName: "Ostrich Fern",
    family: "Onocleaceae",
    category: "fern",
    habitat: ["streambank", "wetland"],
    abundance: "common",
    collectionWindows: [
      { month: 4, weeks: [3, 4], note: "Tightly coiled fiddleheads (edible stage)" },
      { month: 5, weeks: [1, 2, 3], note: "Fronds unfurling; fiddleheads past prime" },
      { month: 6, weeks: [1, 2, 3, 4], note: "Full plume-like vegetative fronds" },
      { month: 9, weeks: [2, 3, 4], note: "Dark brown fertile fronds (persist into winter)" },
    ],
    description:
      "The largest fern in New England, ostrich fern produces dramatic vase-shaped clumps of plume-like fronds up to 1.5 meters tall along stream banks and in floodplains. Its tightly coiled spring fiddleheads are one of the few ferns considered safe to eat (when properly cooked). In late summer, stiff, dark brown fertile fronds emerge in the center of the clump and persist upright through winter, releasing spores.",
    identificationTips: [
      "Very large (up to 1.5 m) fronds in a symmetrical, vase-shaped clump",
      "Fronds widest at the middle, tapering to both tip and base (like an ostrich plume)",
      "Separate dark brown, woody fertile fronds in center of clump (persist through winter)",
      "Deep, U-shaped groove on the front of the stipe (stem) — run your finger along it",
      "Grows in rich, moist alluvial soils along streams and in floodplains",
    ],
    specimenNotes:
      "Press individual pinnae or a section of the upper half of a frond — full fronds are too large. Include a separate fertile frond section (they press flat easily). Photograph the fiddlehead stage in April and the full vase-shaped clump in June for the herbarium file.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Matteuccia struthiopteris", url: "https://gobotany.nativeplanttrust.org/species/matteuccia/struthiopteris/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=MAST" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Matteuccia%20struthiopteris" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Matteuccia_struthiopteris" },
    ],
  },
  {
    id: "hay-scented-fern",
    scientificName: "Dennstaedtia punctilobula",
    commonName: "Hay-scented Fern",
    family: "Dennstaedtiaceae",
    category: "fern",
    habitat: ["woodland-edge", "meadow", "forest-floor"],
    abundance: "abundant",
    collectionWindows: [
      { month: 6, weeks: [1, 2, 3, 4], note: "Full fronds; fragrant when brushed" },
      { month: 7, weeks: [1, 2], note: "Sporangia developing on pinnule margins" },
      { month: 9, weeks: [1, 2], note: "Yellowing autumn fronds with sweet scent" },
    ],
    description:
      "An extremely common fern that forms dense, extensive colonies on woodland slopes and in abandoned fields. When crushed or walked through, the fronds release a distinctive sweet scent reminiscent of fresh-cut hay. It spreads aggressively by rhizomes and can dominate the understory of open woods, sometimes creating nearly pure stands that exclude other plants. The lacy, yellow-green fronds are twice-pinnate and deciduous.",
    identificationTips: [
      "Crushed fronds smell distinctly like fresh-cut hay (the best field test)",
      "Lacy, twice-pinnate, yellow-green fronds, 40–75 cm tall",
      "Forms dense single-species colonies via spreading rhizomes",
      "Fronds arise singly (not in clumps) from the rhizome, spaced evenly apart",
      "Sori tiny, cup-shaped, on the margins of the pinnules (need a hand lens)",
    ],
    specimenNotes:
      "Press a full frond — they are manageable-sized and press beautifully flat. The sweet scent persists faintly in dried specimens. Note the hay fragrance on the label. Extremely abundant — ideal for student collections and pressing practice.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Dennstaedtia punctilobula", url: "https://gobotany.nativeplanttrust.org/species/dennstaedtia/punctilobula/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=DEPU" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Dennstaedtia%20punctilobula" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Dennstaedtia_punctilobula" },
    ],
  },
  {
    id: "sensitive-fern",
    scientificName: "Onoclea sensibilis",
    commonName: "Sensitive Fern",
    family: "Onocleaceae",
    category: "fern",
    habitat: ["wetland", "pond-edge", "streambank"],
    abundance: "common",
    collectionWindows: [
      { month: 5, weeks: [2, 3, 4], note: "Broad green fronds expanding" },
      { month: 6, weeks: [1, 2, 3, 4], note: "Full fronds at peak" },
      { month: 9, weeks: [1, 2, 3, 4], note: "Dark bead-like fertile fronds persisting" },
    ],
    description:
      "Named for its sensitivity to frost — it is one of the first ferns to be killed by autumn's cold — sensitive fern is a common wetland species with an unusual appearance for a fern. Its broad, once-pinnate fronds with net-like venation look more like a coarsely lobed leaf than a typical fern frond. The separate fertile fronds are striking: stiff, dark brown stalks bearing bead-like clusters of sporangia that persist upright through winter.",
    identificationTips: [
      "Broad, coarsely lobed fronds with net-like (reticulate) venation — atypical for ferns",
      "Pinnae with wavy, undulating margins, not individually separated to the rachis",
      "Separate bead-like fertile fronds — stiff, dark brown, persistent through winter",
      "Very sensitive to frost — among the first ferns to die back in autumn",
      "Grows in wet, open habitats — pond edges, ditches, wet meadows",
    ],
    specimenNotes:
      "Press a vegetative frond showing the net-like venation (unusual for ferns — highlight on the label). Collect a bead-like fertile frond separately — they press flat and are excellent diagnostic specimens. Both types can be mounted on a single herbarium sheet for comparison.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Onoclea sensibilis", url: "https://gobotany.nativeplanttrust.org/species/onoclea/sensibilis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=ONSE" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Onoclea%20sensibilis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Onoclea_sensibilis" },
    ],
  },
  {
    id: "royal-fern",
    scientificName: "Osmunda regalis",
    commonName: "Royal Fern",
    family: "Osmundaceae",
    category: "fern",
    habitat: ["streambank", "pond-edge", "wetland"],
    abundance: "occasional",
    collectionWindows: [
      { month: 5, weeks: [3, 4], note: "Young fronds expanding; reddish tint" },
      { month: 6, weeks: [1, 2, 3, 4], note: "Full fronds with fertile tips" },
      { month: 8, weeks: [1, 2, 3], note: "Sporangia maturing at frond tips" },
    ],
    description:
      "The largest fern native to eastern North America, royal fern can reach 1.5 meters or more in favorable wet habitats. Its twice-pinnate fronds with widely spaced, oblong pinnules look quite unlike a typical fern — more like a locust tree's compound leaf. The fertile portion is a distinctive cluster of brown sporangia at the tip of each fertile frond, resembling a flower cluster. New spring growth emerges with a coppery-red tint.",
    identificationTips: [
      "Twice-pinnate fronds with widely spaced, oblong pinnules that look un-fern-like",
      "Fertile sporangia clustered at frond tips, turning dark brown — resembles a flower head",
      "Very large ferns (up to 1.5 m) forming massive clumps in swamps and stream edges",
      "New spring growth coppery-red to bronze before turning green",
      "Pinnules without the typical fern 'lacy' look — blunt-tipped, widely spaced, entire-margined",
    ],
    specimenNotes:
      "Press a section of frond including both vegetative pinnae and the fertile tip. The widely spaced pinnules make pressing easy. Include a close-up of the sporangial cluster at the frond tip. Royal fern is large — select a frond section that fits standard herbarium paper.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Osmunda regalis", url: "https://gobotany.nativeplanttrust.org/species/osmunda/regalis/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=OSRE2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Osmunda%20regalis" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Osmunda_regalis" },
    ],
  },
  {
    id: "rock-polypody",
    scientificName: "Polypodium virginianum",
    commonName: "Rock Polypody",
    family: "Polypodiaceae",
    category: "fern",
    habitat: ["rocky-outcrop"],
    abundance: "common",
    collectionWindows: [
      { month: 6, weeks: [1, 2, 3, 4], note: "Full fronds on rocks; sori developing" },
      { month: 10, weeks: [1, 2, 3, 4], note: "Evergreen fronds with mature sori" },
    ],
    description:
      "A small, tough evergreen fern that grows in dense mats on the surface of rocks and boulders, rooted in thin accumulations of humus and moss. Rock polypody is the characteristic fern of shaded rock outcrops in New England forests. The once-pinnate fronds are leathery and stay green through winter. Large round sori on the frond underside lack a protective covering (indusium), distinguishing this genus from most other ferns.",
    identificationTips: [
      "Small evergreen fern growing directly on rock surfaces in mats",
      "Leathery, once-pinnate fronds 10–25 cm long with rounded to blunt-tipped pinnae",
      "Large, round, orange-brown sori on underside of pinnae — no indusium (covering)",
      "Rhizome creeping along the rock surface, often partially visible",
      "Found on shaded, moss-covered rock outcrops and boulders — not on soil",
    ],
    specimenNotes:
      "Peel a section of frond with attached rhizome from the rock surface. The evergreen fronds press flat easily. Show the sori on the underside — mount one frond face-up and one face-down on the herbarium sheet. Collect at any time of year since the fronds are persistent.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Polypodium virginianum", url: "https://gobotany.nativeplanttrust.org/species/polypodium/virginianum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=POVI5" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Polypodium%20virginianum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Polypodium_virginianum" },
    ],
  },

  // ───────────────────────────────────────────
  // GRASSES & OTHERS
  // ───────────────────────────────────────────
  {
    id: "switchgrass",
    scientificName: "Panicum virgatum",
    commonName: "Switchgrass",
    family: "Poaceae",
    category: "grass",
    habitat: ["meadow", "streambank"],
    abundance: "occasional",
    collectionWindows: [
      { month: 8, weeks: [1, 2, 3, 4], note: "Open airy seed heads" },
      { month: 9, weeks: [1, 2, 3], note: "Seeds maturing; golden autumn color" },
      { month: 10, weeks: [1, 2], note: "Persistent golden stalks" },
    ],
    description:
      "A tall, warm-season native bunchgrass that produces large, open, airy seed heads (panicles) in late summer. Switchgrass is a keystone species of the tallgrass prairie and also occurs naturally in moist meadows and stream corridors in New England. It has gained prominence as a potential biofuel crop. The golden autumn color and persistent upright stems add winter interest to the landscape.",
    identificationTips: [
      "Tall (1–2 m) bunchgrass with large, diffuse, airy panicles in late summer",
      "Wide leaf blades (8–15 mm) with a distinct patch of hair at the collar (ligule area)",
      "Stems stiff and upright, often remaining standing through winter",
      "Seed heads open and spreading — not compact or one-sided",
      "Grows in moist meadows and along stream banks in dense clumps",
    ],
    specimenNotes:
      "Press a stem section with the panicle and a leaf blade showing the hairy ligule area (use a hand lens). Grasses are best pressed when the panicle is freshly open. Include a separate leaf showing the collar region detail. Label the ligule character on the herbarium sheet.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Panicum virgatum", url: "https://gobotany.nativeplanttrust.org/species/panicum/virgatum/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=PAVI2" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Panicum%20virgatum" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Panicum_virgatum" },
    ],
  },
  {
    id: "little-bluestem",
    scientificName: "Schizachyrium scoparium",
    commonName: "Little Bluestem",
    family: "Poaceae",
    category: "grass",
    habitat: ["meadow", "roadside"],
    abundance: "common",
    collectionWindows: [
      { month: 8, weeks: [3, 4], note: "Blue-green stems; flowers emerging" },
      { month: 9, weeks: [1, 2, 3, 4], note: "Fluffy white seed heads; bronze autumn color" },
      { month: 10, weeks: [1, 2, 3], note: "Copper-bronze winter color; persistent stems" },
    ],
    description:
      "One of the most beautiful native grasses, little bluestem turns a stunning copper-bronze in autumn and holds that color through much of winter, with fluffy white seed heads catching the low-angle light. In summer, the stems and leaves have a distinctive blue-green to blue-purple tint. It is a dominant grass of dry meadows and roadsides on well-drained soils and is increasingly used in ecological restoration and native landscaping.",
    identificationTips: [
      "Blue-green to blue-purple stems and foliage in summer (the 'bluestem' character)",
      "Turns rich copper-bronze in autumn, persisting through winter",
      "Fluffy white zigzag seed heads (racemes) with silky hairs on each spikelet",
      "Grows in dense clumps (bunchgrass) 40–100 cm tall on dry, sunny sites",
      "Flattened, slightly hairy leaf sheaths often tinged with purple at the base",
    ],
    specimenNotes:
      "Collect in early autumn when the bronze color and fluffy seed heads are both present. Press the entire upper portion of a culm with seed head attached. The fluffy seeds shed easily — handle gently. Include a summer stem to show the blue-green color for comparison.",
    nativeStatus: "native",
    sources: [
      { label: "Go Botany — Schizachyrium scoparium", url: "https://gobotany.nativeplanttrust.org/species/schizachyrium/scoparium/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=SCSC" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Schizachyrium%20scoparium" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Schizachyrium_scoparium" },
    ],
  },
  {
    id: "common-dandelion",
    scientificName: "Taraxacum officinale",
    commonName: "Common Dandelion",
    family: "Asteraceae",
    category: "wildflower",
    habitat: ["lawn-adjacent", "roadside"],
    abundance: "abundant",
    collectionWindows: [
      { month: 4, weeks: [2, 3, 4], note: "First spring flowers in lawns" },
      { month: 5, weeks: [1, 2, 3, 4], note: "Peak spring bloom; seed heads" },
      { month: 9, weeks: [1, 2, 3, 4], note: "Fall bloom resurgence" },
    ],
    description:
      "Perhaps the most universally recognized wildflower, the common dandelion is a naturalized perennial from Eurasia found in every lawn, sidewalk crack, and disturbed site. Despite its reputation as a weed, it is ecologically valuable as one of the earliest and most reliable pollen and nectar sources for bees in spring. Every part of the plant is edible. The spherical seed heads (blowballs) disperse seeds on feathery parachutes.",
    identificationTips: [
      "Bright yellow composite flower head on a single hollow, leafless, milky-sapped stalk",
      "All ray flowers — no disk flowers (unlike many yellow composites)",
      "Deeply lobed basal leaves with backward-pointing teeth (runcinate lobes)",
      "Spherical white seed head ('blowball') of parachute-bearing achenes",
      "Thick taproot exuding milky latex; found in lawns, cracks, roadsides — everywhere",
    ],
    specimenNotes:
      "Press a complete rosette with root, leaves, flower, and seed head for a comprehensive specimen. Blot the milky sap from the stalk before pressing. The yellow flower color preserves well. Dandelions are ubiquitous — excellent for student practice and for demonstrating composite flower structure.",
    nativeStatus: "naturalized",
    sources: [
      { label: "Go Botany — Taraxacum officinale", url: "https://gobotany.nativeplanttrust.org/species/taraxacum/officinale/" },
      { label: "USDA PLANTS Database", url: "https://plants.usda.gov/home/plantProfile?symbol=TAOF" },
      { label: "iNaturalist Observations", url: "https://www.inaturalist.org/taxa/search?q=Taraxacum%20officinale" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Taraxacum_officinale" },
    ],
  },
];
