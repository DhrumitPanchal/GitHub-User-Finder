document.addEventListener("DOMContentLoaded", () => {
    const ApiURL = "https://api.github.com/users/";
    const accessToken = "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";
    const perPage = 10;
    let currentPage = 1;
    let username;
    let Totalrepos;
  
    //  getUserDetails ---------------------------------------
    const getUserDetails = async () => {
      try {
        const [userDataResponse, starredReposResponse] = await Promise.all([
            fetch(ApiURL + username, {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }),
            fetch(ApiURL + username + "/starred"),
          ])
      
          const userData = await userDataResponse.json();
          const starredRepos = await starredReposResponse.json();
      
          return { userData, starredRepos };
      }
      catch (error) {
        console.error("Error fetching data:", error);
        alert(error)
      }
    };
  
    //  getUserRepositories ---------------------------------------
    const getUserRepositories = async (page, perPage) => {
      const response = await fetch(
        `${ApiURL}${username}/repos?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }
      );
  
      const reposData = await response.json();
      const getTotalRepos = await fetch(ApiURL + username + "/repos", {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      let TotalRepoData = await getTotalRepos.json();
      Totalrepos = TotalRepoData.length;
      return reposData;
    };
  
    //  displayUserDetails ---------------------------------------
  
    const displayUserDetails = ({ userData, starredRepos }) => {
      const userInfo = ` 
          <div class="container">
          <img id="user_img" src=${userData.avatar_url} alt="" />
          <div>
            <h2 class="desplay_name">${userData.name}</h2>
            <h2 class="user_name">${userData.login}</h2>
          </div>   
          </div>
          <a href="${userData.html_url}" class="github_user_link">GitHub</a>
      `;
  
      const otheruserInfo = ` <div>
          <h4>Repositories</h4>
          <h3>${userData.public_repos}</h3>
        </div>
        <div>
          <h4>Starred</h4>
          <h3>${starredRepos.length}</h3>
        </div>
        <div>
          <h4>Followers</h4>
          <h3>${userData.followers}</h3>
        </div>
        <div>
          <h4>following</h4>
          <h3>${userData.following}</h3>
        </div>`;
  
      document.querySelector("aside").innerHTML = userInfo;
      document.querySelector(".count_container").innerHTML = otheruserInfo;
    };
  
  
    const addRepoTitle = () => {
        let titleContainer = document.getElementById("repo_title_container");
        let RepoTitle = document.createElement("h3");
        RepoTitle.innerHTML = "Repositories";
        titleContainer.appendChild(RepoTitle);
      };

    //  displayUserRepositories ---------------------------------------

    const displayUserRepositories = async (repositories) => {
      const repositoriesContainer = document.querySelector(
        "#repositories_container"
      );
    
         
      // Clear the container before appending new repositories
      repositoriesContainer.innerHTML = "";
  
      // Display repositories for the current page
      const startIndex = 0;
      const endIndex = Math.min(startIndex + perPage, repositories.length);
      for (let i = 0; i < endIndex; i++) {
        const repo = repositories[i];
        const languagesResponse = await fetch(repo.languages_url, {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        const languagesData = await languagesResponse.json();
        const languages = Object.keys(languagesData);
  
        const repoStarsResponse = await fetch(
          "https://api.github.com/repos/" +
            username +
            "/" +
            repo.name +
            "/stargazers",
          {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          }
        );
  
        const repoStarsData = await repoStarsResponse.json();
        const repoStars = repoStarsData.length;
  
        let repoElement = document.createElement("div");
         
        repoElement.classList.add("repositories");
        repoElement.innerHTML = `
          <a href="${repo.html_url}" target="_blanck">${repo.name}</a>
          <p>${repo.description != null ? repo.description : ""}</p>
          <div class="other_detail">
            <div class="repo_star_cont">
              <i class="fa-solid fa-star"></i>
              <h4>${repoStars}</h4>
            </div>
            <div class="repo_lang_cont">
              ${languages.map((lang) => `<h3>${lang}</h3>`).join("")}
            </div>
          </div>
        `;
        repositoriesContainer.appendChild(repoElement);
      }


      
    };
  
    document.querySelector("#prevPageBtn").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchData();
      }
    });
  
    document.querySelector("#nextPageBtn").addEventListener("click", () => {
      const totalPages = Math.ceil(Totalrepos / perPage);
      if (currentPage < totalPages) {
        currentPage++;
        fetchData();
      }
    });
  
    const fetchData = async () => {
        try {
          const userDetails = await getUserDetails();
          if (userDetails.userData.message === "Not Found") {
            alert("User not found");
            return;
          }
          const userRepositories = await getUserRepositories(currentPage, perPage);
      
          displayUserDetails(userDetails);
          document.querySelector("#Repo_section_title").style.display = "block";
          displayUserRepositories(userRepositories);
      
          // Show the previous and next buttons
          document.querySelector(".pagination").style.display = "flex";
        } catch (error) {
          alert(error);
        }
      };
      
      
  
    document.querySelector("#searchForm").addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission
  
       username = document.querySelector("#usernameInput").value;
      if (username) {
        fetchData()
      } else {
        alert("Username is required.");
      }
    });
  });
  