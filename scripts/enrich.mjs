// Build-time enrichment: grounds the hand-authored guide in institutional data.
//
// Sources (all keyless, all CORS-open, all cited in the UI later):
//   GBIF        — taxonomy: accepted name, synonym resolution, family, vernacular names
//   iNaturalist — phenology (flowering/fruiting annotations, Massachusetts) + observations near campus
//   Wikipedia   — one-paragraph summary + lead thumbnail
//
// Architectural rule: fetch at AUTHOR time, commit the JSON, never call a third party at
// request time. Run `npm run enrich` by hand; the output (src/data/enrichment.json) is committed.
// This script is deliberately NOT wired into `npm run build` — a network hiccup must never
// fail a deploy. Every fetch is individually guarded and falls back to the previously committed
// value, so the site keeps serving last-known-good data even if every request fails.
//
// Scoping note: phenology histograms use place_id=2 (Massachusetts), NOT a campus radius.
// Within 5-8 km of campus a species has only ~10 observations — far too thin to chart.
// The campus radius (25 km) is used only for the "seen near here" count.
//
// Rate limits: iNaturalist publishes 100 req/min, asks for <=60/min and <=10,000/day.
// We stay sequential with a 1000 ms pause between plants (plus a short pause between
// iNat calls), so a full run is roughly 4-5 minutes for 65 plants.

import fs from "node:fs";
import path from "node:path";

const PLANTS_FILE = path.resolve("src/data/plants.ts");
const OUTPUT_FILE = path.resolve("src/data/enrichment.json");

// Required by Wikimedia policy; requested by GBIF and iNaturalist.
const USER_AGENT =
  "StMarksFlora/2.0 (educational field guide; https://github.com/ikonkim2027-Korea/stmarks-flora)";

// St. Mark's School, Southborough MA — keep in sync with SCHOOL_CENTER in the app.
const CAMPUS_LAT = 42.3075;
const CAMPUS_LNG = -71.5235;
const NEARBY_RADIUS_KM = 25;

const PLACE_ID_MASSACHUSETTS = 2;
const TERM_PHENOLOGY = 12;
const VALUE_FLOWERING = 13;
const VALUE_FRUITING = 14;

const DELAY_BETWEEN_PLANTS_MS = 1000;
const DELAY_BETWEEN_INAT_CALLS_MS = 200;
const OBSERVATIONS_PER_PAGE = 200;
const MAX_OBSERVATION_PAGES = 6; // 1,200 annotated observations is plenty for a month histogram

const warnings = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function warn(id, field, reason) {
  const line = `WARN ${id} ${field} ${reason}`;
  warnings.push(line);
  console.log(line);
}

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Read the plant list straight out of plants.ts by regex — same technique as
// scripts/add-sources.mjs. Importing the TS module from Node is not an option.
function readPlants() {
  const content = fs.readFileSync(PLANTS_FILE, "utf8");
  const regex = /id: "([^"]+)",\s*\n\s*scientificName: "([^"]+)",/g;
  const plants = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    plants.push({ id: match[1], scientificName: match[2] });
  }
  return plants;
}

function readPrevious() {
  if (!fs.existsSync(OUTPUT_FILE)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
    return parsed?.plants ?? {};
  } catch {
    console.log("WARN - enrichment.json unreadable; starting fresh");
    return {};
  }
}

function emptyMonths() {
  return new Array(12).fill(0);
}

// ── GBIF ────────────────────────────────────────────────────────────────────

async function fetchGbif(scientificName) {
  const url = new URL("https://api.gbif.org/v1/species/match");
  url.searchParams.set("name", scientificName);
  url.searchParams.set("kingdom", "Plantae"); // avoids animal homonyms
  const match = await getJson(url);
  if (!match || match.matchType === "NONE" || !match.usageKey) {
    throw new Error(`no GBIF match (matchType=${match?.matchType})`);
  }

  const info = {
    usageKey: match.usageKey,
    taxonKey: match.usageKey,
    status: match.status ?? null,
    matchedName: match.scientificName ?? null,
    acceptedName: null,
    family: match.family ?? null,
    vernacularNames: [],
  };

  // A SYNONYM match points at the accepted usage; follow it so the guide can show
  // the current name. taxonKey is the ACCEPTED key — that is what map tiles need.
  if (match.status === "SYNONYM" && match.acceptedUsageKey) {
    const accepted = await getJson(
      `https://api.gbif.org/v1/species/${match.acceptedUsageKey}`
    );
    info.taxonKey = match.acceptedUsageKey;
    info.acceptedName = accepted?.canonicalName ?? accepted?.scientificName ?? null;
    if (accepted?.family) info.family = accepted.family;
  }

  return info;
}

// Common names live on whichever GBIF usage happens to carry them. A freshly split
// accepted taxon often has none while the synonym still does (Sitobolium punctilobum
// has zero English names; Dennstaedtia punctilobula has "Hay-scented Fern"), so try the
// accepted key first and fall back to the matched key.
async function fetchVernacularNames(taxonKey, fallbackKey) {
  const names = await fetchVernacularNamesForKey(taxonKey);
  if (names.length > 0 || !fallbackKey || fallbackKey === taxonKey) return names;
  return fetchVernacularNamesForKey(fallbackKey);
}

async function fetchVernacularNamesForKey(taxonKey) {
  const data = await getJson(
    `https://api.gbif.org/v1/species/${taxonKey}/vernacularNames?limit=100`
  );
  const seen = new Set();
  const names = [];
  for (const record of data?.results ?? []) {
    if (record.language !== "eng") continue;
    const name = String(record.vernacularName ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
    if (names.length >= 6) break;
  }
  return names;
}

// ── iNaturalist ─────────────────────────────────────────────────────────────

// Taxon id comes from /v1/taxa/autocomplete: we prefer an exact name match, then a
// name that starts with the query, then the top-ranked result. The resolved NAME is
// reused for the observation queries, so a plant whose guide name iNaturalist does not
// index (e.g. an infraspecific name) can still be matched via its GBIF accepted name.
async function resolveInatTaxon(name) {
  const url = new URL("https://api.inaturalist.org/v1/taxa/autocomplete");
  url.searchParams.set("q", name);
  url.searchParams.set("per_page", "10");
  const data = await getJson(url);
  const results = data?.results ?? [];
  if (results.length === 0) return null;
  const lower = name.toLowerCase();
  const exact = results.find((r) => String(r.name).toLowerCase() === lower);
  const prefixed = results.find((r) => String(r.name).toLowerCase().startsWith(lower));
  const picked = exact ?? prefixed ?? results[0];
  return { id: picked.id, name: picked.name };
}

// Month histogram of phenology annotations. Two implementations:
//
//   1. /observations/histogram?interval=month_of_year — one small request, counts the
//      WHOLE population. This is the primary path.
//   2. paging /observations and tallying observed_on_details.month — the obvious approach,
//      kept as a fallback if the histogram endpoint ever changes shape.
//
// Verified equal: for Claytonia virginica (48 flowering annotations in MA) and for
// Taraxacum officinale (361, i.e. past the 200-per-page limit) the histogram and the
// paged tally return byte-identical arrays. The histogram is preferred because paging
// 200-record pages costs ~12 large responses per plant (a ~50 min run) and silently
// truncates any species with more annotations than the page cap.
async function fetchAnnotationMonths(taxonName, termValueId) {
  try {
    return await fetchAnnotationHistogram(taxonName, termValueId);
  } catch (error) {
    console.log(`INFO histogram unavailable (${error.message}); paging observations instead`);
    return tallyAnnotationObservations(taxonName, termValueId);
  }
}

async function fetchAnnotationHistogram(taxonName, termValueId) {
  const url = new URL("https://api.inaturalist.org/v1/observations/histogram");
  url.searchParams.set("taxon_name", taxonName);
  url.searchParams.set("place_id", String(PLACE_ID_MASSACHUSETTS));
  url.searchParams.set("term_id", String(TERM_PHENOLOGY));
  url.searchParams.set("term_value_id", String(termValueId));
  url.searchParams.set("date_field", "observed");
  url.searchParams.set("interval", "month_of_year");
  const data = await getJson(url);
  const buckets = data?.results?.month_of_year;
  if (!buckets) throw new Error("no month_of_year buckets");
  const months = emptyMonths();
  for (let month = 1; month <= 12; month += 1) {
    months[month - 1] = Number(buckets[String(month)] ?? 0);
  }
  const total = months.reduce((sum, n) => sum + n, 0);
  return { months, total, collected: total };
}

async function tallyAnnotationObservations(taxonName, termValueId) {
  const months = emptyMonths();
  let page = 1;
  let total = Infinity;
  let collected = 0;

  while (collected < total && page <= MAX_OBSERVATION_PAGES) {
    const url = new URL("https://api.inaturalist.org/v1/observations");
    url.searchParams.set("taxon_name", taxonName);
    url.searchParams.set("place_id", String(PLACE_ID_MASSACHUSETTS));
    url.searchParams.set("term_id", String(TERM_PHENOLOGY));
    url.searchParams.set("term_value_id", String(termValueId));
    url.searchParams.set("per_page", String(OBSERVATIONS_PER_PAGE));
    url.searchParams.set("page", String(page));
    url.searchParams.set("order_by", "observed_on");
    const data = await getJson(url);
    total = data?.total_results ?? 0;
    const results = data?.results ?? [];
    if (results.length === 0) break;
    for (const record of results) {
      const month = record?.observed_on_details?.month;
      if (month >= 1 && month <= 12) months[month - 1] += 1;
    }
    collected += results.length;
    page += 1;
    if (collected < total && page <= MAX_OBSERVATION_PAGES) {
      await sleep(DELAY_BETWEEN_INAT_CALLS_MS);
    }
  }

  return { months, total, collected };
}

async function fetchNearbyObservations(taxonName) {
  const url = new URL("https://api.inaturalist.org/v1/observations");
  url.searchParams.set("taxon_name", taxonName);
  url.searchParams.set("lat", String(CAMPUS_LAT));
  url.searchParams.set("lng", String(CAMPUS_LNG));
  url.searchParams.set("radius", String(NEARBY_RADIUS_KM));
  url.searchParams.set("per_page", "1");
  const data = await getJson(url);
  const total = data?.total_results;
  if (typeof total !== "number") throw new Error("no total_results");
  return total;
}

// ── Wikipedia ───────────────────────────────────────────────────────────────

async function fetchWikipediaSummary(title) {
  const data = await getJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title.replace(/ /g, "_")
    )}`
  );
  if (!data?.extract || data.type === "disambiguation") {
    throw new Error(`no usable summary (type=${data?.type})`);
  }
  return {
    extract: data.extract,
    url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title.replace(/ /g, "_")}`,
    thumbnail: data.thumbnail?.source ?? null,
  };
}

// ── Per-plant pipeline ──────────────────────────────────────────────────────

async function enrichPlant(plant, previous) {
  const prev = previous ?? null;
  const now = new Date().toISOString();

  const record = {
    id: plant.id,
    scientificName: plant.scientificName,
    fetchedAt: prev?.fetchedAt ?? now,
    gbif: prev?.gbif ?? null,
    floweringByMonth: prev?.floweringByMonth ?? emptyMonths(),
    fruitingByMonth: prev?.fruitingByMonth ?? emptyMonths(),
    nearbyObservations: prev?.nearbyObservations ?? 0,
    inatTaxonId: prev?.inatTaxonId ?? null,
    wikipedia: prev?.wikipedia ?? null,
  };

  const ok = {
    gbif: false,
    vernacular: false,
    flowering: false,
    fruiting: false,
    nearby: false,
    inatTaxon: false,
    wikipedia: false,
  };

  // 1. GBIF taxonomy
  let gbif = null;
  try {
    gbif = await fetchGbif(plant.scientificName);
    record.gbif = gbif;
    ok.gbif = true;
  } catch (error) {
    warn(plant.id, "gbif", error.message);
    gbif = record.gbif; // reuse previously committed taxonomy if we have it
  }

  // 2. GBIF vernacular names
  if (gbif?.taxonKey) {
    try {
      const names = await fetchVernacularNames(gbif.taxonKey, gbif.usageKey);
      record.gbif = { ...gbif, vernacularNames: names };
      ok.vernacular = true;
    } catch (error) {
      // Keep whatever the previous run committed rather than blanking the list.
      const previousNames = prev?.gbif?.vernacularNames ?? [];
      record.gbif = { ...record.gbif, vernacularNames: previousNames };
      warn(plant.id, "vernacularNames", error.message);
    }
  }

  // 3. Resolve the iNaturalist taxon. Fall back to the GBIF accepted name when the
  //    guide's name is not indexed by iNaturalist (infraspecific names, old synonyms).
  const candidates = [plant.scientificName];
  if (gbif?.acceptedName && gbif.acceptedName !== plant.scientificName) {
    candidates.push(gbif.acceptedName);
  }
  let inatName = plant.scientificName;
  for (const candidate of candidates) {
    try {
      const taxon = await resolveInatTaxon(candidate);
      await sleep(DELAY_BETWEEN_INAT_CALLS_MS);
      if (taxon) {
        record.inatTaxonId = taxon.id;
        inatName = taxon.name;
        ok.inatTaxon = true;
        if (taxon.name !== plant.scientificName) {
          console.log(`INFO ${plant.id} iNaturalist name resolved to "${taxon.name}"`);
        }
        break;
      }
    } catch (error) {
      warn(plant.id, "inatTaxonId", error.message);
    }
  }
  if (!ok.inatTaxon) warn(plant.id, "inatTaxonId", "no autocomplete match");

  // 4. Flowering phenology (Massachusetts)
  try {
    const { months, total, collected } = await fetchAnnotationMonths(inatName, VALUE_FLOWERING);
    record.floweringByMonth = months;
    ok.flowering = true;
    if (collected < total) {
      warn(plant.id, "floweringByMonth", `sampled ${collected}/${total} observations (page cap)`);
    }
    await sleep(DELAY_BETWEEN_INAT_CALLS_MS);
  } catch (error) {
    warn(plant.id, "floweringByMonth", error.message);
  }

  // 5. Fruiting phenology (Massachusetts)
  try {
    const { months, total, collected } = await fetchAnnotationMonths(inatName, VALUE_FRUITING);
    record.fruitingByMonth = months;
    ok.fruiting = true;
    if (collected < total) {
      warn(plant.id, "fruitingByMonth", `sampled ${collected}/${total} observations (page cap)`);
    }
    await sleep(DELAY_BETWEEN_INAT_CALLS_MS);
  } catch (error) {
    warn(plant.id, "fruitingByMonth", error.message);
  }

  // 6. Observations within 25 km of campus
  try {
    record.nearbyObservations = await fetchNearbyObservations(inatName);
    ok.nearby = true;
  } catch (error) {
    warn(plant.id, "nearbyObservations", error.message);
  }

  // 7. Wikipedia summary — scientific name first, then the GBIF accepted name,
  //    then the genus page (which is what exists for several of these taxa).
  const wikiTitles = [plant.scientificName];
  if (gbif?.acceptedName && gbif.acceptedName !== plant.scientificName) {
    wikiTitles.push(gbif.acceptedName);
  }
  wikiTitles.push(plant.scientificName.split(" ")[0]);
  for (const title of wikiTitles) {
    try {
      record.wikipedia = await fetchWikipediaSummary(title);
      ok.wikipedia = true;
      if (title !== plant.scientificName) {
        console.log(`INFO ${plant.id} wikipedia summary from "${title}"`);
      }
      break;
    } catch (error) {
      if (title === wikiTitles[wikiTitles.length - 1]) {
        warn(plant.id, "wikipedia", error.message);
      }
    }
  }

  if (Object.values(ok).some(Boolean)) record.fetchedAt = now;

  return { record, ok };
}

// ── Main ────────────────────────────────────────────────────────────────────

// `--only=id[,id]` refreshes just those plants and copies every other record forward
// untouched. Useful for fixing one entry without re-querying 65 species (a full run is
// ~13 minutes at these APIs' latency).
function parseOnlyFilter() {
  return new Set(
    process.argv
      .slice(2)
      .filter((arg) => arg.startsWith("--only="))
      .flatMap((arg) => arg.slice("--only=".length).split(","))
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

async function main() {
  const plants = readPlants();
  const previous = readPrevious();
  const only = parseOnlyFilter();
  const targets = only.size > 0 ? plants.filter((p) => only.has(p.id) || !previous[p.id]) : plants;
  console.log(
    `Enriching ${targets.length} of ${plants.length} plants from plants.ts` +
      (only.size > 0 ? ` (--only=${[...only].join(",")})` : "") +
      "\n"
  );

  const output = {};
  const counts = {
    gbif: 0,
    vernacular: 0,
    flowering: 0,
    fruiting: 0,
    nearby: 0,
    inatTaxon: 0,
    wikipedia: 0,
  };
  const synonyms = [];

  // Every plant that is not being refreshed keeps its committed record verbatim, so the
  // output always covers the whole guide.
  for (const plant of plants) {
    if (!targets.includes(plant)) output[plant.id] = previous[plant.id];
  }

  for (let i = 0; i < targets.length; i += 1) {
    const plant = targets[i];
    const { record, ok } = await enrichPlant(plant, previous[plant.id]);
    output[plant.id] = record;
    for (const key of Object.keys(counts)) {
      if (ok[key]) counts[key] += 1;
    }
    const peak = record.floweringByMonth.indexOf(Math.max(...record.floweringByMonth)) + 1;
    console.log(
      `[${i + 1}/${targets.length}] ${plant.id} — ${record.gbif?.status ?? "?"}, ` +
        `flowering peak month ${Math.max(...record.floweringByMonth) > 0 ? peak : "none"}, ` +
        `${record.nearbyObservations} nearby`
    );
    if (i < targets.length - 1) await sleep(DELAY_BETWEEN_PLANTS_MS);
  }

  // Reported across the whole file, not just the refreshed subset.
  for (const plant of plants) {
    const gbif = output[plant.id]?.gbif;
    if (gbif?.status === "SYNONYM") {
      synonyms.push({
        id: plant.id,
        ourName: plant.scientificName,
        acceptedName: gbif.acceptedName,
      });
    }
  }

  // Keys sorted alphabetically, 2-space indent, so future diffs stay readable.
  const sorted = {};
  for (const id of Object.keys(output).sort()) sorted[id] = output[id];

  fs.writeFileSync(
    OUTPUT_FILE,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), plants: sorted }, null, 2)}\n`
  );

  console.log(`\nWrote ${OUTPUT_FILE}`);
  console.log(`\nField success counts (out of ${targets.length} refreshed plants):`);
  for (const [field, count] of Object.entries(counts)) {
    console.log(`  ${field.padEnd(12)} ${count}/${targets.length}`);
  }

  console.log(`\nSYNONYM findings (${synonyms.length}):`);
  if (synonyms.length === 0) {
    console.log("  none — every name in plants.ts is the GBIF accepted name");
  } else {
    for (const s of synonyms) {
      console.log(`  ${s.id}: "${s.ourName}" -> accepted "${s.acceptedName}"`);
    }
  }

  console.log(`\nWarnings (${warnings.length}):`);
  for (const line of warnings) console.log(`  ${line}`);
}

// Never fail the caller: enrichment is an authoring step, not a build step.
main().catch((error) => {
  console.log(`WARN - pipeline aborted: ${error.message}`);
  process.exit(0);
});
