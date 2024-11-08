let students = [];
console.log("hhiiiiii");
let sortOrder = {
    rank: "asc",
    username: "asc",
    totalSolved: "asc",
    easySolved: "asc",
    mediumSolved: "asc",
    hardSolved: "asc",
};

// Function to initialize students from the backend
async function initializeStudents() {
    try {
        const response = await fetch("http://4.188.73.8:3001/data"); // Call the backend to get sorted data
        if (!response.ok) {
            throw new Error("Failed to fetch data from the server");
        }
        const data = await response.json();
        students = data; // Store fetched data in students array
        updateLeaderboard(); // Update the leaderboard after fetching all students
    } catch (error) {
        console.error("Error initializing students:", error);
        alert("Unable to fetch student data. Please try again later.");
    }
}

// Function to update the leaderboard
function updateLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = "";

    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-4">${index + 1}</td>
            <td class="p-4">
                <a href="#" onclick="window.open('https://leetcode.com/${student.username}', '_blank')">${student.username}</a>
   
            </td>
            <td class="p-4">
    ${student.totalSolved} 
    &nbsp;
    <span class="text-green-500">
        <i class="fa fa-arrow-up"></i>
    </span> 
    ${Math.floor(student.totalSolved / 8) -Math.floor(student.totalSolved / 18)  }
</td>
            <td class="p-4 text-green-400">${student.easySolved}</td>
            <td class="p-4 text-yellow-400">${student.mediumSolved}</td>
            <td class="p-4 text-red-400">${student.hardSolved}</td>
        `;
        leaderboardBody.appendChild(row);
    });

    updateTopSolvers();
}

// Function to update top solvers
function updateTopSolvers() {
    const topSolversEl = document.getElementById("top-solvers");
    topSolversEl.innerHTML = "";

    const top3 = students.slice(0, 3);
    top3.forEach((student) => {
        const listItem = document.createElement("li");
        listItem.classList.add("flex", "justify-between", "m-2", "p-2", "bg-gray-700", "rounded-lg", "shadow-md");
        listItem.innerHTML = `<span>${student.username}</span><span>${student.totalSolved} Solved</span>`;
        topSolversEl.appendChild(listItem);
    });
}

// Function to sort the table
function sortTable(attribute) {
    const currentOrder = sortOrder[attribute];

    // Toggle sort order
    sortOrder[attribute] = currentOrder === "asc" ? "desc" : "asc";

    students.sort((a, b) => {
        if (attribute === 'username') {
            return sortOrder[attribute] === "asc" ? a[attribute].localeCompare(b[attribute]) : b[attribute].localeCompare(a[attribute]);
        } else {
            return sortOrder[attribute] === "asc" ? a[attribute] - b[attribute] : b[attribute] - a[attribute];
        }
    });

    // Reset all icons to default state
    document.querySelectorAll("th i").forEach(i => {
        i.classList.remove("fa-sort-up", "fa-sort-down");
        i.classList.add("fa-sort");
    });

    // Update icon for current column
    const icon = document.querySelector(`th[onclick="sortTable('${attribute}')"] i`);
    icon.classList.toggle("fa-sort-up", sortOrder[attribute] === "asc");
    icon.classList.toggle("fa-sort-down", sortOrder[attribute] === "desc");

    updateLeaderboard();
}

// Initialize students and leaderboard
initializeStudents();

