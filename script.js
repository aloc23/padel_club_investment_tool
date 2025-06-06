const files = {
  "folios": ["philllips land folio.pdf", "DAFC folio_MH11730_041846.pdf"],
  "renders": ["x2.png", "aq.png", "Screenshot 2025-05-06 at 20.06.07.png", "x copy.png", "1af.png", "x3.png", "3af.png", "z9.png", "6f.png", "z8.png", "4fa.png", "x4.png", "z.png", "n8.png", "n.png", "bbb.png", "x.png", "a4.png", "aza.png", "az7.png", "1b.png", "az6.png", "dddd.png", "aaaa.png", "az5.png", "ccc.png", "az1.png", "ddd.png", "n10.png", "az3.png", "aaa.png", "2d.png", "d5.png", "x3 copy.png", "x2 copy.png", "d4.png", "cccc.png", "Screenshot 2025-05-06 at 20.05.04.png", "z10.png", "x12.png", "www.png", "b4.png", "n7.png", "z2.png", "z11.png", "w7.png", "Screenshot 2025-05-06 at 20.06.19.png", "w.png", "az.png", "w6.png", "ww.png", "w2.png", "z5.png", "z4.png", "w3.png", "z6.png", "c4.png", "a1b.png", "z7.png"],
  "quotes": ["Fw_ DOLAN PCI PADEL COURTS.eml", "004 Inxtremis 30 x 62 x 6m or 8m Sports Hall.pdf"],
  "drawings": ["club overview.pdf", "top view.pdf", "HG_HALL_GABLES 2.pdf", "height.pdf", "HG_HALL_PLAN 2.pdf", "HG_HALL_LONGSIDES 2.pdf", "club.pdf"],
  "contracts": [],
  "draft contracts": ["Mayweather_DAFC_Lease_Agreement_2025.pdf", "Mayweather_DAFC_Heads_of_Terms_2025.pdf"],
};


function loadFiles() {
  const folder = document.getElementById("folderSelect").value;
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (files[folder]) {
    const ul = document.createElement("ul");
    files[folder].forEach(file => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="files/${folder}/${file}" target="_blank">${file}</a>`;
      ul.appendChild(li);
    });
    fileList.appendChild(ul);
  } else {
    fileList.textContent = "No files available.";
  }
}







const files = {
  "folios": ["philllips land folio.pdf", "DAFC folio_MH11730_041846.pdf"],
  "renders": ["x2.png", "aq.png", "Screenshot 2025-05-06 at 20.06.07.png", "x copy.png", "1af.png", "x3.png", "3af.png", "z9.png", "6f.png", "z8.png", "4fa.png", "x4.png", "z.png", "n8.png", "n.png", "bbb.png", "x.png", "a4.png", "aza.png", "az7.png", "1b.png", "az6.png", "dddd.png", "aaaa.png", "az5.png", "ccc.png", "az1.png", "ddd.png", "n10.png", "az3.png", "aaa.png", "2d.png", "d5.png", "x3 copy.png", "x2 copy.png", "d4.png", "cccc.png", "Screenshot 2025-05-06 at 20.05.04.png", "z10.png", "x12.png", "www.png", "b4.png", "n7.png", "z2.png", "z11.png", "w7.png", "Screenshot 2025-05-06 at 20.06.19.png", "w.png", "az.png", "w6.png", "ww.png", "w2.png", "z5.png", "z4.png", "w3.png", "z6.png", "c4.png", "a1b.png", "z7.png"],
  "quotes": ["Fw_ DOLAN PCI PADEL COURTS.eml", "004 Inxtremis 30 x 62 x 6m or 8m Sports Hall.pdf"],
  "drawings": ["club overview.pdf", "top view.pdf", "HG_HALL_GABLES 2.pdf", "height.pdf", "HG_HALL_PLAN 2.pdf", "HG_HALL_LONGSIDES 2.pdf", "club.pdf"],
  "contracts": [],
  "draft contracts": ["Mayweather_DAFC_Lease_Agreement_2025.pdf", "Mayweather_DAFC_Heads_of_Terms_2025.pdf"],
};


function loadFiles() {
  const folder = document.getElementById("folderSelect").value;
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  if (files[folder]) {
    const ul = document.createElement("ul");
    files[folder].forEach(file => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="files/${folder}/${file}" target="_blank">${file}</a>`;
      ul.appendChild(li);
    });
    fileList.appendChild(ul);
  } else {
    fileList.textContent = "No files available.";
  }
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(sec => {
    sec.classList.toggle('hidden', sec.id !== tabId);
  });

  document.querySelectorAll('nav.tabs button').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'btn' + capitalize(tabId));
  });

  if (tabId === 'pnl') updatePnL();
  if (tabId === 'roi') updateROI();
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
window.onload = () => {
  showTab("padel");
  calculatePadel();
  calculateGym();
  updateRampDurationLabel(document.getElementById("rampDuration").value);
  updateRampEffectLabel(document.getElementById("rampEffect").value);
  updateROIAdjustmentLabel();
  loadFiles();
};

const files = {
  quotes: ["quote1.pdf", "quote2.pdf"],
  drawings: ["drawing1.png", "drawing2.png"],
  folios: ["folio1.docx"],
  renders: ["render1.jpg", "render2.jpg"],
  "draft contracts": ["draft1.pdf"],
  contracts: ["contract1.pdf"]
};

function loadFiles() {
  const folderSelect = document.getElementById("folderSelect");
  const fileList = document.getElementById("fileList");
  folderSelect.innerHTML = "";
  fileList.innerHTML = "";

  Object.keys(files).forEach(folder => {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
    folderSelect.appendChild(option);
  });

  folderSelect.addEventListener("change", () => {
    fileList.innerHTML = "";
    const selectedFolder = folderSelect.value;
    files[selectedFolder].forEach(file => {
      const a = document.createElement("a");
      a.href = "files/" + selectedFolder + "/" + file;
      a.textContent = file;
      a.target = "_blank";
      a.className = "block text-blue-500 hover:underline";
      fileList.appendChild(a);
    });
  });

  folderSelect.dispatchEvent(new Event("change"));
}

window.onload = () => {
  showTab("padel");
  calculatePadel();
  calculateGym();
  updatePnL();
  updateROI();
  loadFiles();
};