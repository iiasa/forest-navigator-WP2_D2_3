// Metadata transcribed from README.md. Coverage uses temporal_coverage where descriptions conflict.
const disturbanceSource = {
  name: "European Forest Disturbance Atlas",
  url: "https://zenodo.org/records/13333034",
};
const biomassSource = {
  name: "ESA CCI Biomass · version 6",
  url: "https://climate.esa.int/en/projects/biomass/",
};
const forestMask =
  "Masked with the forest cover (2020) dataset from datacube v1 and reprojected to WGS84.";
const datasets = [
  {
    id: "Disturbance_agent",
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
    source: disturbanceSource,
    history: `Resampled to 100 m. ${forestMask}`,
    classes: ["Wind / bark beetle", "Fire", "Harvest", "Mixed"],
  },
  {
    id: "Disturbance_fraction",
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
    source: disturbanceSource,
    history: `Disturbance year data converted to binary, then resampled to 100 m. ${forestMask}`,
  },
  {
    id: "Disturbance_year",
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
    source: disturbanceSource,
    history: `Resampled to 100 m. ${forestMask}`,
  },
  ...[
    { year: 2010, max: 410 },
    { year: 2015, max: 421 },
    { year: 2020, max: 422 },
    { year: 2022, max: 414 },
  ].map(({ year, max }) => ({
    id: `Forest_AGB_${year}`,
    variable: `Forest_agb_${year}`,
    title: `Forest aboveground biomass · ${year}`,
    category: "Biomass",
    summary: "Forest aboveground biomass from ESA CCI.",
    description: `Forest aboveground biomass for ${year} at 100 m spatial resolution, based on ESA CCI Biomass version 6.`,
    coverage: `${year}`,
    year,
    units: "Mg ha⁻¹",
    range: `1–${max}`,
    source: biomassSource,
    history: forestMask,
    note: [2010, 2020].includes(year)
      ? `The README’s first description says 2015. The variable name, detailed description, and temporal_coverage specify ${year}, used here.`
      : null,
  })),
  {
    id: "Forest_timber_volume",
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
    history: `Resampled to 100 m. ${forestMask}`,
    note: "The README’s first description says 2015; its detailed description and temporal_coverage specify 2020, used here. The units are shown exactly as recorded in the README.",
  },
];

// Public object URLs match download-links.txt without its short-lived authentication query.
const baseURL =
  "https://s3.iiasa.ac.at/accelerator-prod/forest-navigator/WP2_D2_3_data/";
const filename = (dataset) => `Forest4model_v2_${dataset.id}.nc`;
const downloadURL = (dataset) => baseURL + filename(dataset);
const list = document.querySelector("#file-list");
const panel = document.querySelector("#detail-panel");
const search = document.querySelector("#search");
const sort = document.querySelector("#sort");
let category = "all";
let selectedId = datasets[0].id;

function renderDetail(dataset) {
  panel.innerHTML = `
    <div class="detail-top">
      <div class="detail-label"><span>Dataset details</span><span class="format">NetCDF</span></div>
      <h3>${dataset.title}</h3>
      <code class="filename">${filename(dataset)}</code>
      <p class="detail-description">${dataset.description}</p>
      ${dataset.classes ? `<ul class="agent-key">${dataset.classes.map((label, index) => `<li><b>${index + 1}</b>${label}</li>`).join("")}</ul>` : ""}
    </div>
    <div class="detail-body">
      <dl class="metadata">
        <div><dt>Temporal coverage</dt><dd>${dataset.coverage}</dd></div>
        <div><dt>Spatial resolution</dt><dd>100 m</dd></div>
        <div><dt>Units</dt><dd>${dataset.units}</dd></div>
        <div><dt>Valid range</dt><dd>${dataset.range}</dd></div>
        <div><dt>Geographic extent</dt><dd>50–60° N · 0–10° E</dd></div>
        <div><dt>Coordinate system</dt><dd>WGS84 · lat / lon</dd></div>
      </dl>
      <details class="detail-extra"><summary>Processing & technical metadata</summary><p>${dataset.history}</p>
        <dl class="metadata"><div><dt>NetCDF variable</dt><dd>${dataset.variable}</dd></div><div><dt>No-data value</dt><dd>−9999</dd></div><div><dt>Scale / offset</dt><dd>1 / 0</dd></div><div><dt>Conventions</dt><dd>CF-1.12</dd></div><div><dt>Axis / grid mapping</dt><dd>Z / spatial_ref</dd></div><div><dt>Author</dt><dd>Alexandra Runge · GFZ</dd></div></dl>
      </details>
      ${dataset.note ? `<details class="detail-extra"><summary>Source metadata note</summary><p>${dataset.note}</p></details>` : ""}
      <details class="detail-extra"><summary>Citation</summary><p>EC Forest Navigator project. Deliverable D2.3, <a href="https://www.forestnavigator.eu/">forestnavigator.eu</a></p></details>
      <div class="metadata-source"><span>Data source</span><a href="${dataset.source.url}" target="_blank" rel="noopener">${dataset.source.name} ↗</a></div>
      <a class="download-button" href="${downloadURL(dataset)}" aria-label="Download ${filename(dataset)}">Download NetCDF <span aria-hidden="true">↓</span></a>
    </div>`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = datasets
    .filter(
      (dataset) =>
        (category === "all" || dataset.category === category) &&
        [
          dataset.title,
          filename(dataset),
          dataset.variable,
          dataset.description,
          dataset.category,
          dataset.coverage,
          dataset.source.name,
        ].some((value) => value.toLowerCase().includes(query)),
    )
    .sort((a, b) => {
      if (sort.value === "newest")
        return b.year - a.year || a.title.localeCompare(b.title);
      if (sort.value === "oldest")
        return a.year - b.year || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
  document.querySelector("#result-count").textContent =
    `${visible.length} of ${datasets.length} datasets`;
  if (!visible.length) {
    list.innerHTML =
      '<div class="empty"><h2>No datasets found</h2><p>Try another search or category.</p><button id="reset">Clear filters</button></div>';
    panel.hidden = true;
    document.querySelector("#reset").addEventListener("click", () => {
      search.value = "";
      setCategory("all");
      search.focus();
    });
    return;
  }
  panel.hidden = false;
  if (!visible.some((dataset) => dataset.id === selectedId))
    selectedId = visible[0].id;
  list.innerHTML = visible
    .map(
      (dataset) => `
    <div class="dataset ${dataset.id === selectedId ? "selected" : ""}">
      <button class="dataset-select" data-id="${dataset.id}" aria-pressed="${dataset.id === selectedId}" aria-controls="detail-panel">
        <span class="file-icon" aria-hidden="true">.nc</span>
        <span class="file-copy"><span class="file-title">${dataset.title}</span><span class="file-description">${dataset.summary}</span><span class="file-tags"><span>${dataset.category}</span><span>${dataset.coverage}</span><span>100 m</span></span></span>
      </button>
      <a class="row-download" href="${downloadURL(dataset)}" aria-label="Download ${filename(dataset)}" title="Download NetCDF">↓</a>
    </div>`,
    )
    .join("");
  renderDetail(visible.find((dataset) => dataset.id === selectedId));
}

function setCategory(value) {
  category = value;
  document.querySelectorAll(".category").forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });
  render();
}

document.querySelector("#categories").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  selectedId = button.dataset.id;
  list.querySelectorAll(".dataset-select").forEach((item) => {
    const selected = item.dataset.id === selectedId;
    item.setAttribute("aria-pressed", selected);
    item.closest(".dataset").classList.toggle("selected", selected);
  });
  renderDetail(datasets.find((dataset) => dataset.id === selectedId));
  if (window.matchMedia("(max-width: 900px)").matches)
    panel.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
});
search.addEventListener("input", render);
sort.addEventListener("change", render);
render();
