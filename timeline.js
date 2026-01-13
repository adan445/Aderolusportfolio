/* Renders a visual timeline + stat tiles from a small JSON array.
   TODO: Paste entries from your PDF below. Each item supports:
   { role, company, start, end, location, bullets[], tools[], logo }
*/
const DATA = [
  // EXAMPLE — replace with real entries from your PDF:
  {
    role: "IT Intern",
    company: "Canaccord Genuity LLC",
    start: "2024-06",
    end: "2024-12",
    location: "Boston, MA",
    bullets: [
      "Configured and maintained IT inventory (computers, peripherals, licenses).",
      "Supported video conferencing setups; troubleshot user issues.",
      "Documented processes in Active Directory, Azure, Intune, Autopilot.",
      "Assisted with security risk assessments."
    ],
    tools: ["Azure", "Intune", "Active Directory", "VC Support"],
    logo: "./assets/images/cg.png"
  }
];

function monthsBetween(a, b) {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

function fmtRange(start, end) {
  const opts = { month: "short", year: "numeric" };
  const s = new Date(start + "-01").toLocaleDateString(undefined, opts);
  const e = end ? new Date(end + "-01").toLocaleDateString(undefined, opts) : "Present";
  return `${s} — ${e}`;
}

function renderStats(list) {
  const statsEl = document.getElementById("stats");
  if (!statsEl) return;
  const roles = list.length;

  // compute total months
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const totalMonths = list.reduce((acc, item) => {
    const end = item.end || nowStr;
    return acc + Math.max(0, monthsBetween(item.start, end));
  }, 0);
  const years = (totalMonths / 12).toFixed(1);

  statsEl.innerHTML = `
    <article class="stat card">
      <div class="stat-number">${roles}</div>
      <div class="stat-label">Roles</div>
    </article>
    <article class="stat card">
      <div class="stat-number">${years}y</div>
      <div class="stat-label">Total Experience</div>
    </article>
    <article class="stat card">
      <div class="stat-number">${list.flatMap(x=>x.tools||[]).length}</div>
      <div class="stat-label">Tools Mentioned</div>
    </article>
  `;
}

function renderTimeline(list) {
  const wrap = document.getElementById("timeline");
  if (!wrap) return;
  wrap.innerHTML = "";

  list
    .sort((a, b) => (b.end || "9999-12").localeCompare(a.end || "9999-12"))
    .forEach(item => {
      const li = document.createElement("li");
      li.className = "timeline-item";
      li.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card card">
          <div class="timeline-header">
            ${item.logo ? `<img src="${item.logo}" alt="${item.company} logo" class="company-logo" loading="lazy">` : ""}
            <div>
              <h3>${item.role} — ${item.company}</h3>
              <p class="muted">${fmtRange(item.start, item.end)}${item.location ? ` • ${item.location}` : ""}</p>
            </div>
          </div>
          ${Array.isArray(item.bullets) && item.bullets.length ? `
            <ul class="bullets">
              ${item.bullets.map(b=>`<li>${b}</li>`).join("")}
            </ul>` : ""
          }
          ${Array.isArray(item.tools) && item.tools.length ? `
            <div class="tools">
              ${item.tools.map(t=>`<span class="tool"><i class="fa-solid fa-hashtag"></i> ${t}</span>`).join("")}
            </div>` : ""
          }
        </div>
      `;
      wrap.appendChild(li);
    });
}

renderStats(DATA);
renderTimeline(DATA);
