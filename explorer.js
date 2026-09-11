// Metadata sources:
// - v2: README.md (forest4model datacube v2, D2.3). Coverage uses temporal_coverage
//   where the first description line conflicts.
// - v1: FN_D2.1_Multilayered_forest_geodatabase_v2.pdf (forest4model datacube v1,
//   D2.1), Table 1 overview plus Sections 2.1-2.5 for sources and processing.
//   Table 1 is the source for units, valid ranges, storage types, and specifications.
//   No-data values, scale/offset beyond Table 1, and CF conventions are not
//   specified in the D2.1 documentation, so the v1 panel states that explicitly
//   instead of reusing v2 values.

const S3_BASE =
  "https://s3.iiasa.ac.at/accelerator-prod/forest-navigator/WP2_D2_3_data/";
const GITLAB_BASE =
  "https://gitlab.iiasa.ac.at/forestnavigator/wp2/public/-/raw/main/";

const disturbanceAtlasV2 = {
  name: "European Forest Disturbance Atlas",
  url: "https://zenodo.org/records/13333034",
};
const biomassV6 = {
  name: "ESA CCI Biomass · version 6",
  url: "https://climate.esa.int/en/projects/biomass/",
};
const forestMaskV2 =
  "Masked with the forest cover (2020) dataset from datacube v1 and reprojected to WGS84.";

const v2Datasets = [
  {
    file: "Forest4model_v2_Disturbance_agent.nc",
    variable: "disturbance_agent",
    title: "Disturbance agent",
    category: "Disturbance",
    summary: "Dominant cause of forest disturbance.",
    description:
      "The dominant disturbance agent at 100 m spatial resolution: wind/bark beetle, fire, harvest, or mixed disturbance.",
    coverage: "1985–2023",
    year: 2023,
    units: "adimensional",
    range: "1–4",
    source: disturbanceAtlasV2,
    history: `Resampled to 100 m. ${forestMaskV2}`,
    classes: ["Wind / bark beetle", "Fire", "Harvest", "Mixed"],
    comparison:
      "New in v2. There is no disturbance-agent layer in the v1 datacube.",
  },
  {
    file: "Forest4model_v2_Disturbance_fraction.nc",
    variable: "disturbance_fraction",
    title: "Disturbance fraction",
    category: "Disturbance",
    summary: "Fraction of forest affected by disturbance.",
    description:
      "The fraction of disturbance from 30 m source data within each 100 m pixel.",
    coverage: "1985–2023",
    year: 2023,
    units: "adimensional",
    range: "0–1",
    source: disturbanceAtlasV2,
    history: `Disturbance year data converted to binary, then resampled to 100 m. ${forestMaskV2}`,
    comparison:
      "Compared with v1 (Disturbance_intensity.nc): v1 covers 1986–2020 from Senf & Seidl (2021) stored as signed 16-bit integers with scale factor 0.001; v2 covers 1985–2023 from the European Forest Disturbance Atlas with scale factor 1.",
  },
  {
    file: "Forest4model_v2_Disturbance_year.nc",
    variable: "disturbance_year",
    title: "Disturbance year",
    category: "Disturbance",
    summary: "Year of forest disturbance events.",
    description:
      "The year of disturbance events, based on the European Forest Disturbance Atlas and resampled to 100 m spatial resolution.",
    coverage: "1985–2023",
    year: 2023,
    units: "years",
    range: "1985–2023",
    source: disturbanceAtlasV2,
    history: `Resampled to 100 m. ${forestMaskV2}`,
    comparison:
      "Compared with v1: v1 covers 1986–2020 from Senf & Seidl (2021); v2 extends coverage to 1985–2023 from the European Forest Disturbance Atlas.",
  },
  ...[
    { year: 2010, max: 410 },
    { year: 2015, max: 421 },
    { year: 2020, max: 422 },
    { year: 2022, max: 414 },
  ].map(({ year, max }) => ({
    file: `Forest4model_v2_Forest_AGB_${year}.nc`,
    variable: `Forest_agb_${year}`,
    title: `Forest aboveground biomass · ${year}`,
    category: "Biomass",
    summary: "Forest aboveground biomass from ESA CCI.",
    description: `Forest aboveground biomass for ${year} at 100 m spatial resolution, based on ESA CCI Biomass version 6.`,
    coverage: `${year}`,
    year,
    units: "Mg ha⁻¹",
    range: `1–${max}`,
    source: biomassV6,
    history: forestMaskV2,
    comparison:
      "Compared with v1 (single 2020 layer, ESA CCI v4, valid range 0–631): v2 uses ESA CCI Biomass version 6 with one file per year and per-year valid maxima of 410 (2010), 421 (2015), 422 (2020), and 414 (2022).",
  })),
  {
    file: "Forest4model_v2_Forest_timber_volume.nc",
    variable: "Timber_volume",
    title: "Forest timber volume",
    category: "Timber volume",
    summary: "Forest timber volume from PathFinder.",
    description:
      "Forest timber volume for 2020 at 100 m spatial resolution, based on the PathFinder High-Resolution Pan-European Forest Structure Datasets.",
    coverage: "2020",
    year: 2020,
    units: "m-3/ha (as recorded)",
    range: "1–757",
    source: {
      name: "High-Resolution Pan-European Forest Structure Maps",
      url: "https://doi.org/10.5281/zenodo.13143235",
    },
    history: `Resampled to 100 m. ${forestMaskV2}`,
    note: "The README’s first description says 2015; its detailed description and temporal_coverage specify 2020, used here. The units are shown exactly as recorded in the README.",
    comparison:
      "New in v2. There is no timber-volume layer in the v1 datacube.",
  },
];

const V1_DOCS =
  "D2.1 documentation (FN_D2.1_Multilayered_forest_geodatabase_v2.pdf)";

function v1File(file) {
  return GITLAB_BASE + file;
}

const v1Datasets = [
  {
    file: "Forest4model_v1_Forest_cover.nc",
    title: "Forest cover · 2020",
    category: "Cover & extent",
    summary: "Binary forest cover for 2020 (FAO definition).",
    description:
      "Forest cover in 2020: areas with more than 10% tree cover, tree height of at least 5 m, and a minimum area of 0.5 ha, at 100 m spatial resolution.",
    coverage: "2020",
    year: 2020,
    units: "binary: 1",
    range: "1",
    storage: "signed integers 16 bit",
    source: { name: "ESA WorldCover 10 m 2020 + Potapov tree height" },
    history:
      "ESA WorldCover upscaled to 30 m (mode), combined with tree height ≥ 5 m, small objects below 0.5 ha removed, upscaled to 100 m (mode), masked consistently, reprojected to WGS84.",
    comparison:
      "Retained from v1. This layer was used as the forest mask for the v2 layers.",
  },
  {
    file: "Forest4model_v1_Forest_cover_fraction.nc",
    title: "Forest cover fraction · 2020",
    category: "Cover & extent",
    summary: "Forest cover fraction at 100 m.",
    description:
      "Forest cover fraction aggregated from 30 m to 100 m (mean), masked with the forest cover 2020 layer.",
    coverage: "2020",
    year: 2020,
    units: "0–1",
    range: "0–1",
    storage: "signed integers 16 bit · scale factor 0.001",
    source: { name: "ESA WorldCover 10 m 2020 + Potapov tree height" },
    history:
      "Same forest mask as forest cover, converted to float, upscaled to 100 m (average), masked with forest cover 2020, reprojected to WGS84.",
    comparison:
      "Retained from v1. No equivalent single layer is shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_extent_stable.nc",
    title: "Forest extent stable · 2000–2020",
    category: "Cover & extent",
    summary: "Forest area present in both 2000 and 2020.",
    description:
      "Stable forest area identified by combining the 2000 and 2020 forest extent layers at 100 m spatial resolution.",
    coverage: "2000–2020",
    year: 2020,
    units: "binary: 1",
    range: "1",
    storage: "signed integers 16 bit",
    source: { name: "Potapov global forest extent 2000 / 2020" },
    history:
      "Forest extent layers upscaled to 100 m (mode), combined to stable extent, masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No forest-extent layers are shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_extent_loss.nc",
    title: "Forest extent loss · 2000–2020",
    category: "Cover & extent",
    summary: "Forest extent loss between 2000 and 2020.",
    description:
      "Forest extent loss identified from stable extent and the 2000 forest extent at 100 m spatial resolution.",
    coverage: "2000–2020",
    year: 2020,
    units: "binary: 1",
    range: "1",
    storage: "signed integers 16 bit",
    source: { name: "Potapov global forest extent 2000 / 2020" },
    history:
      "Combined stable extent with forest extent 2000, masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No forest-extent layers are shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_extent_gain.nc",
    title: "Forest extent gain · 2000–2020",
    category: "Cover & extent",
    summary: "Forest extent gain between 2000 and 2020.",
    description:
      "Forest extent gain identified from stable extent and the 2020 forest extent at 100 m spatial resolution.",
    coverage: "2000–2020",
    year: 2020,
    units: "binary: 1",
    range: "1",
    storage: "signed integers 16 bit",
    source: { name: "Potapov global forest extent 2000 / 2020" },
    history:
      "Combined stable extent with forest extent 2020, masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No forest-extent layers are shipped in v2.",
  },
  {
    file: "Forest4model_v1_Disturbance_year.nc",
    title: "Disturbance year",
    category: "Disturbance",
    summary: "Year of forest disturbance events, 1986–2020.",
    description:
      "Main disturbance year per 100 m pixel, aggregated from 30 m European forest disturbance maps and masked with forest cover 2020.",
    coverage: "1986–2020",
    year: 2020,
    units: "1986–2020",
    range: "1986–2020",
    storage: "signed integers 16 bit",
    source: {
      name: "Senf & Seidl (2021) European forest disturbance maps v1.1.4",
    },
    history:
      "Disturbance year upscaled to 100 m (mode), masked with forest cover 2020 to remove small-scale patches and non-forest disturbances, reprojected to WGS84.",
    comparison:
      "Compared with v2: v2 covers 1985–2023 from the European Forest Disturbance Atlas with units “years”; v1 covers 1986–2020 from Senf & Seidl (2021).",
  },
  {
    file: "Forest4model_v1_Disturbance_intensity.nc",
    title: "Disturbance fraction",
    category: "Disturbance",
    summary: "Fraction of disturbed 30 m pixels per 100 m pixel.",
    description:
      "Fraction of 30 m pixels identified as disturbed within each 100 m pixel, masked with forest cover 2020. The D2.1 documentation calls this layer “disturbance fraction”; the file itself is named Disturbance_intensity.nc.",
    coverage: "1986–2020",
    year: 2020,
    units: "0–1",
    range: "0–1",
    storage: "signed integers 16 bit · scale factor 0.001",
    source: {
      name: "Senf & Seidl (2021) European forest disturbance maps v1.1.4",
    },
    history:
      "Disturbance year converted to binary (disturbance = 1), upscaled to 100 m (average), masked with forest cover 2020, reprojected to WGS84.",
    note: "File-to-documentation naming difference: the D2.1 report (Tables 1 and 5) describes this product as “disturbance fraction”; the NetCDF file is named Forest4model_v1_Disturbance_intensity.nc.",
    comparison:
      "Compared with v2 (Disturbance_fraction.nc, 1985–2023, European Forest Disturbance Atlas, scale factor 1): same 0–1 concept and processing, but v1 covers 1986–2020 from Senf & Seidl (2021) stored as scaled 16-bit integers.",
  },
  {
    file: "Forest4model_v1_Forest_agb.nc",
    title: "Forest aboveground biomass · 2020",
    category: "Biomass & structure",
    summary: "Aboveground biomass 2020 from ESA CCI v4.",
    description:
      "Estimated aboveground biomass in forest areas for 2020 at 100 m spatial resolution, masked with forest cover 2020.",
    coverage: "2020",
    year: 2020,
    units: "aboveground biomass in forest areas",
    range: "0–631",
    storage: "signed integers 16 bit",
    source: { name: "ESA CCI Biomass v4 (Santoro & Cartus, 2023)" },
    history:
      "ESA CCI aboveground biomass 2020 masked with forest cover 2020, reprojected to WGS84.",
    comparison:
      "Compared with v2 (four yearly files, ESA CCI v6, per-year maxima 410–422 Mg ha⁻¹): v1 ships a single 2020 layer from ESA CCI v4 with valid range 0–631.",
  },
  {
    file: "Forest4model_v1_Canopy_height.nc",
    title: "Forest canopy height · 2020",
    category: "Biomass & structure",
    summary: "Tree height 2020 upscaled to 100 m.",
    description:
      "Tree height for 2020 upscaled from 30 m to 100 m (average) and masked with forest cover 2020.",
    coverage: "2020",
    year: 2020,
    units: "0–50",
    range: "0–50",
    storage: "signed integers 16 bit",
    source: { name: "Potapov et al. (2021) global forest canopy height" },
    history:
      "Tree height upscaled to 100 m (average), masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No canopy-height layer is shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_type.nc",
    title: "Forest type · 2018",
    category: "Biodiversity",
    summary: "Broadleaved, coniferous, mixed, or undefined.",
    description:
      "Dominant leaf types from the Copernicus High Resolution Layer Forest Type 2018, masked with forest cover 2020.",
    coverage: "2018",
    year: 2018,
    units: "1, 2, 3, 4",
    range: "1–4",
    storage: "signed integers 16 bit",
    source: { name: "Copernicus HRL Forest Type 2018" },
    history:
      "HRL Forest Type 2018 masked with forest cover 2020, reprojected to WGS84.",
    classes: ["Undefined", "Broadleaved", "Coniferous", "Mixed"],
    comparison: "Retained from v1. No forest-type layer is shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_fragment.nc",
    title: "Forest fragmentation · 2020",
    category: "Biodiversity",
    summary: "Distribution of forest fragments, 2020.",
    description:
      "Forest fragmentation index downscaled from 5 km to 100 m (mode) and masked with forest cover 2020. Treat as a first approximation because of the coarse source resolution and gaps.",
    coverage: "2020",
    year: 2020,
    units: "0–1",
    range: "0–1",
    storage: "signed integers 16 bit · scale factor 0.001",
    source: { name: "Ma et al. (2023) global forest fragmentation" },
    history:
      "Fragmentation 2020 downscaled to 100 m (mode), masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No fragmentation layers are shipped in v2.",
  },
  {
    file: "Forest4model_v1_Forest_fragment_change.nc",
    title: "Forest fragmentation change · 2000–2020",
    category: "Biodiversity",
    summary: "Change in forest fragmentation, 2000–2020.",
    description:
      "Change in the forest fragmentation index between 2000 and 2020, downscaled to 100 m and masked with forest cover 2020.",
    coverage: "2000–2020",
    year: 2020,
    units: "0–1",
    range: "0–1",
    storage: "signed integers 16 bit · scale factor 0.001",
    source: { name: "Ma et al. (2023) global forest fragmentation" },
    history:
      "Fragmentation 2000 and 2020 downscaled to 100 m (mode), combined to change, masked with forest cover 2020, reprojected to WGS84.",
    comparison: "Retained from v1. No fragmentation layers are shipped in v2.",
  },
  {
    file: "Forest4model_v1_Natural_forests.nc",
    title: "Natural forests · 2020",
    category: "Biodiversity",
    summary: "Natural vs. non-natural forest.",
    description:
      "Natural forests (unmanaged or minimally managed) selected from SBTN natural land classes and masked with forest cover 2020.",
    coverage: "2020",
    year: 2020,
    units: "1, 2",
    range: "1–2",
    storage: "signed integers 16 bit",
    source: { name: "SBTN natural lands map (WRI; Mazur et al. 2023)" },
    history:
      "Natural forest class (= 2) selected, reprojected via EPSG:3035, masked with forest cover 2020 (1 = non-natural, 2 = natural), reprojected to WGS84.",
    classes: ["Non-natural forest", "Natural forest"],
    comparison: "Retained from v1. No natural-forest layer is shipped in v2.",
  },
];

const VERSIONS = {
  v1: {
    label: "Version 1",
    badge: "v1.0",
    edition: "forest4model datacube · D2.1",
    heroEyebrow: "FOREST4MODEL / VERSION 1",
    topbar: "WP2 · D2.1",
    footer: "EC Deliverable D2.1",
    docsLabel: "Deliverable D2.1",
    readme: GITLAB_BASE + "README.md",
    pdf: GITLAB_BASE + "FN_D2.1_Multilayered_forest_geodatabase_v2.pdf",
    count: "13",
    timespan: "1986–2020",
    extent: "Europe",
    extentSub: "EU-wide · 35 countries for disturbance",
    heroIndex: "01 — 13 / DATA COLLECTION",
    citation:
      'EC Forest Navigator project. Deliverable D2.1, <a href="https://gitlab.iiasa.ac.at/forestnavigator/wp2/public">project repository</a>',
    datasets: v1Datasets,
  },
  v2: {
    label: "Version 2",
    badge: "v2.0",
    edition: "forest4model datacube · D2.3",
    heroEyebrow: "FOREST4MODEL / VERSION 2",
    topbar: "WP2 · D2.3",
    footer: "EC Deliverable D2.3",
    docsLabel: "Deliverable D2.3",
    readme: S3_BASE + "README.md",
    pdf: S3_BASE + "FN_D2.3_Documentation_final.pdf",
    count: "08",
    timespan: "1985–2023",
    extent: "Europe",
    extentSub: "50–60° N · 0–10° E",
    heroIndex: "01 — 08 / DATA COLLECTION",
    citation:
      'EC Forest Navigator project. Deliverable D2.3, <a href="https://www.forestnavigator.eu/">forestnavigator.eu</a>',
    datasets: v2Datasets,
  },
};

const CATEGORY_ICONS = {
  all: "▦",
  "Cover & extent": "▦",
  Disturbance: "↯",
  "Biomass & structure": "♧",
  Biomass: "♧",
  Biodiversity: "❀",
  "Timber volume": "▤",
};

const list = document.querySelector("#file-list");
const panel = document.querySelector("#detail-panel");
const search = document.querySelector("#search");
const categoriesNav = document.querySelector("#categories");
let version = "v2";
let category = "all";
let sort = "name";
let selectedFile = v2Datasets[0].file;

function currentVersion() {
  return VERSIONS[version];
}

function categories() {
  const cats = [];
  for (const dataset of currentVersion().datasets) {
    if (!cats.includes(dataset.category)) cats.push(dataset.category);
  }
  return cats;
}

function renderCategories() {
  const counts = { all: currentVersion().datasets.length };
  for (const dataset of currentVersion().datasets) {
    counts[dataset.category] = (counts[dataset.category] || 0) + 1;
  }
  const buttons = [
    { value: "all", label: "All datasets" },
    ...categories().map((cat) => ({ value: cat, label: cat })),
  ];
  categoriesNav.innerHTML = buttons
    .map(
      ({ value, label }) => `
      <button class="category ${value === category ? "active" : ""}" data-category="${value}" aria-pressed="${value === category}">
        <span><span class="nav-icon">${CATEGORY_ICONS[value] || "▦"}</span>${label}</span><span>${String(counts[value]).padStart(2, "0")}</span>
      </button>`,
    )
    .join("");
}

function renderVersionChrome() {
  const v = currentVersion();
  document.querySelector("#edition-badge").textContent = v.badge;
  document.querySelector("#edition-label").textContent = v.edition;
  document.querySelector("#topbar-deliverable").textContent = v.topbar;
  document.querySelector("#footer-deliverable").textContent = v.footer;
  document.querySelector("#hero-version").innerHTML =
    `<span class="dot"></span> ${v.heroEyebrow}`;
  document.querySelector("#hero-index").innerHTML =
    `EUROPEAN FOREST OBSERVATIONS<br />${v.heroIndex}`;
  document.querySelector("#stat-count").textContent = v.count;
  document.querySelector("#stat-timespan").textContent = v.timespan;
  document.querySelector("#stat-extent").textContent = v.extent;
  document.querySelector("#stat-extent-sub").textContent = v.extentSub;
  for (const [id, href] of [
    ["#doc-readme", v.readme],
    ["#footer-readme", v.readme],
    ["#doc-pdf", v.pdf],
    ["#footer-pdf", v.pdf],
  ]) {
    document.querySelector(id).setAttribute("href", href);
  }
  document.querySelector("#doc-pdf").innerHTML =
    `${v.docsLabel} <span>↗</span>`;
  document.querySelector("#footer-pdf").innerHTML = `Documentation ↗`;
}

function downloadURL(dataset) {
  if (version === "v1") return v1File(dataset.file);
  return S3_BASE + dataset.file;
}

function technicalRows(dataset) {
  if (version === "v2") {
    return `<dl class="metadata"><div><dt>NetCDF variable</dt><dd>${dataset.variable}</dd></div><div><dt>No-data value</dt><dd>−9999</dd></div><div><dt>Scale / offset</dt><dd>1 / 0</dd></div><div><dt>Conventions</dt><dd>CF-1.12</dd></div><div><dt>Axis / grid mapping</dt><dd>Z / spatial_ref</dd></div><div><dt>Author</dt><dd>Alexandra Runge · GFZ</dd></div></dl>`;
  }
  return `<dl class="metadata"><div><dt>Storage type</dt><dd>${dataset.storage}</dd></div><div><dt>Source dataset</dt><dd>${dataset.source.name}</dd></div></dl>`;
}

function renderDetail(dataset) {
  const v = currentVersion();
  const sourceLink = dataset.source.url
    ? `<a href="${dataset.source.url}" target="_blank" rel="noopener">${dataset.source.name} ↗</a>`
    : dataset.source.name;
  panel.innerHTML = `
    <div class="detail-top">
      <div class="detail-label"><span>Dataset details · ${v.label}</span><span class="format">NetCDF</span></div>
      <h3>${dataset.title}</h3>
      <code class="filename">${dataset.file}</code>
      <p class="detail-description">${dataset.description}</p>
      ${dataset.classes ? `<ul class="agent-key">${dataset.classes.map((label, index) => `<li><b>${index + 1}</b>${label}</li>`).join("")}</ul>` : ""}
    </div>
    <div class="detail-body">
      <dl class="metadata">
        <div><dt>Temporal coverage</dt><dd>${dataset.coverage}</dd></div>
        <div><dt>Spatial resolution</dt><dd>100 m</dd></div>
        <div><dt>Units</dt><dd>${dataset.units}</dd></div>
        <div><dt>Valid range</dt><dd>${dataset.range}</dd></div>
        <div><dt>Geographic extent</dt><dd>${version === "v1" ? "Europe (EU-wide)" : "50–60° N · 0–10° E"}</dd></div>
        <div><dt>Coordinate system</dt><dd>WGS84 · lat / lon</dd></div>
      </dl>
      <details class="detail-extra"><summary>Processing & technical metadata</summary><p>${dataset.history}</p>
        ${technicalRows(dataset)}
      </details>
      ${dataset.note ? `<details class="detail-extra"><summary>Source metadata note</summary><p>${dataset.note}</p></details>` : ""}
      ${dataset.comparison ? `<details class="detail-extra"><summary>Version comparison</summary><p>${dataset.comparison}</p></details>` : ""}
      <details class="detail-extra"><summary>Citation</summary><p>${v.citation}</p></details>
      <div class="metadata-source"><span>Data source</span>${sourceLink}</div>
      <a class="download-button" href="${downloadURL(dataset)}" aria-label="Download ${dataset.file}">Download NetCDF <span aria-hidden="true">↓</span></a>
    </div>`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const datasets = currentVersion().datasets;
  const visible = datasets
    .filter(
      (dataset) =>
        (category === "all" || dataset.category === category) &&
        [
          dataset.title,
          dataset.file,
          dataset.variable || "",
          dataset.description,
          dataset.category,
          dataset.coverage,
          dataset.source.name,
        ].some((value) => value.toLowerCase().includes(query)),
    )
    .sort((a, b) => {
      if (sort === "newest")
        return b.year - a.year || a.title.localeCompare(b.title);
      if (sort === "oldest")
        return a.year - b.year || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
  document.querySelector("#result-count").textContent =
    `${visible.length} of ${datasets.length} datasets · ${VERSIONS[version].label}`;
  if (!visible.length) {
    list.innerHTML =
      '<div class="empty"><h2>No datasets found</h2><p>Try another search or category.</p><button id="reset">Clear filters</button></div>';
    panel.hidden = true;
    document.querySelector("#reset").addEventListener("click", () => {
      search.value = "";
      category = "all";
      renderCategories();
      render();
      search.focus();
    });
    return;
  }
  panel.hidden = false;
  if (!visible.some((dataset) => dataset.file === selectedFile))
    selectedFile = visible[0].file;
  list.innerHTML = visible
    .map(
      (dataset) => `
    <div class="dataset ${dataset.file === selectedFile ? "selected" : ""}">
      <button class="dataset-select" data-file="${dataset.file}" aria-pressed="${dataset.file === selectedFile}" aria-controls="detail-panel">
        <span class="file-icon" aria-hidden="true">.nc</span>
        <span class="file-copy"><span class="file-title">${dataset.title}</span><span class="file-description">${dataset.summary}</span><span class="file-tags"><span>${dataset.category}</span><span>${dataset.coverage}</span><span>100 m</span></span></span>
      </button>
      <a class="row-download" href="${downloadURL(dataset)}" aria-label="Download ${dataset.file}" title="Download NetCDF">↓</a>
    </div>`,
    )
    .join("");
  renderDetail(visible.find((dataset) => dataset.file === selectedFile));
}

function setVersion(value) {
  version = value;
  category = "all";
  selectedFile = null;
  renderVersionChrome();
  renderCategories();
  render();
}

categoriesNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  category = button.dataset.category;
  renderCategories();
  render();
});
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-file]");
  if (!button) return;
  selectedFile = button.dataset.file;
  list.querySelectorAll(".dataset-select").forEach((item) => {
    const selected = item.dataset.file === selectedFile;
    item.setAttribute("aria-pressed", selected);
    item.closest(".dataset").classList.toggle("selected", selected);
  });
  renderDetail(
    currentVersion().datasets.find((dataset) => dataset.file === selectedFile),
  );
  if (window.matchMedia("(max-width: 900px)").matches)
    panel.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
});
search.addEventListener("input", render);
document
  .querySelector("#version-switch")
  .addEventListener("change", (event) => {
    if (event.target.name === "version") setVersion(event.target.value);
  });
document.querySelector("#sort-group").addEventListener("change", (event) => {
  if (event.target.name === "sort") {
    sort = event.target.value;
    render();
  }
});
renderVersionChrome();
renderCategories();
render();
