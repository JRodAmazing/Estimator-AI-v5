async function loadProjects() {
  const res = await fetch("/api/projects");
  const projects = await res.json();
  const container = document.getElementById("projects");
  container.innerHTML = projects.map(p =>
    `<div class="card">
      <h3>${p.id}</h3>
      <p>${p.type.toUpperCase()} — ${p.input?.location || "Unknown"}</p>
      <p>Cost: $${p.estimatedCost || p.data?.totalCost || "N/A"}</p>
      <button onclick="optimize('${p.id}')">Optimize</button>
    </div>`
  ).join("");
}

async function optimize(id) {
  const res = await fetch(`/api/optimize/${id}`);
  const data = await res.json();
  alert(`Optimization complete.\nSavings: $${data.savings.toLocaleString()}`);
}

document.getElementById("refresh").addEventListener("click", loadProjects);
loadProjects();
