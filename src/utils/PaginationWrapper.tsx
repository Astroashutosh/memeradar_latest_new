import { useEffect, useState } from "react";
 
const PaginationWrapper = ({ itemsPerPage = 10 }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
 
  useEffect(() => {
    const table = document.querySelector("table tbody");
    if (!table) return;
 
    const rows = Array.from(table.querySelectorAll("tr"));
 
    const dataRows = rows.filter(
      (row) => !row.innerText.includes("Total")
    );
 
    const totalPages = Math.ceil(dataRows.length / itemsPerPage);
 
    dataRows.forEach((row: any, index) => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
 
      row.style.display =
        index >= start && index < end ? "" : "none";
    });
 
    rows.forEach((row: any) => {
      if (row.innerText.includes("Total")) {
        row.style.display = "";
      }
    });
 
    const container = document.getElementById("pagination-container");
    if (!container) return;
 
    container.innerHTML = `
      <ul class="pagination mt-3">
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <button class="page-link" id="prev-btn">Previous</button>
        </li>
        ${[...Array(totalPages)]
        .map(
          (_, i) =>
            `<li class="page-item ${currentPage === i + 1 ? "active" : ""
            }">
                <button class="page-link page-btn" data-page="${i + 1}">${i + 1}</button>
              </li>`
        )
        .join("")}
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""
      }">
          <button class="page-link" id="next-btn">Next</button>
        </li>
      </ul>
    `;
 
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
 
    prevBtn?.addEventListener("click", () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    });
 
    nextBtn?.addEventListener("click", () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    });
 
    document.querySelectorAll(".page-btn").forEach((btn: any) => {
      btn.addEventListener("click", () => {
        setCurrentPage(Number(btn.dataset.page));
      });
    });
 
  }, [currentPage, itemsPerPage]);
 
  return <div id="pagination-container"></div>;
};
 
export default PaginationWrapper;