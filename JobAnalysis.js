class Job {
    constructor({ Title, Posted, Type, Level, Skill, Detail }) {
      this.title = Title;
      this.posted = Posted;
      this.type = Type;
      this.level = Level;
      this.skill = Skill;
      this.detail = Detail;
    }
  

    getPostedTimeInMinutes() {
      const units = { minute: 1, hour: 60, day: 1440 };
      const [value, unit] = this.posted.split(" ");
      return parseInt(value) * units[unit] || 0;
    }
  
    getDetails() {
      return `${this.title} (${this.level})`;
    }
  }
  
  let jobs = [];
  let filteredJobs = [];
  
  // Load and parse JSON file
  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        jobs = data.map((job) => new Job(job));
        filteredJobs = [...jobs];
        populateFilters();
        displayJobs(filteredJobs);
      } catch (err) {
        displayError("Invalid JSON file. Please upload a valid file.");
      }
    };
  
    reader.onerror = () => displayError("Error reading file.");
    reader.readAsText(file);
  });
  
  // Display error message
  function displayError(message) {
    document.getElementById("errorMessage").textContent = message;
  }
  
  function populateFilters() {
    populateDropdown("levelFilter", [...new Set(jobs.map((job) => job.level))]);
    populateDropdown("typeFilter", [...new Set(jobs.map((job) => job.type))]);
    populateDropdown("skillFilter", [...new Set(jobs.map((job) => job.skill))]);
  }
  
  function populateDropdown(id, options) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="">All</option>`;
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      dropdown.appendChild(opt);
    });
  }
  
  // Display job listings
  function displayJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";
    jobs.forEach((job) => {
      const li = document.createElement("li");
      li.textContent = job.getDetails();
      jobList.appendChild(li);
    });
  }
  
  // Apply filters
  document.getElementById("applyFilters").addEventListener("click", () => {
    const level = document.getElementById("levelFilter").value;
    const type = document.getElementById("typeFilter").value;
    const skill = document.getElementById("skillFilter").value;
  
    filteredJobs = jobs.filter((job) => {
      return (
        (!level || job.level === level) &&
        (!type || job.type === type) &&
        (!skill || job.skill === skill)
      );
    });
  
    displayJobs(filteredJobs);
  });
  
  // Sorting functions
  document.getElementById("sortTitleAsc").addEventListener("click", () => {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    displayJobs(filteredJobs);
  });
  
  document.getElementById("sortTitleDesc").addEventListener("click", () => {
    filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
    displayJobs(filteredJobs);
  });
  
  document.getElementById("sortTimeAsc").addEventListener("click", () => {
    filteredJobs.sort((a, b) => a.getPostedTimeInMinutes() - b.getPostedTimeInMinutes());
    displayJobs(filteredJobs);
  });
  
  document.getElementById("sortTimeDesc").addEventListener("click", () => {
    filteredJobs.sort((a, b) => b.getPostedTimeInMinutes() - a.getPostedTimeInMinutes());
    displayJobs(filteredJobs);
  });
  