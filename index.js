document.addEventListener("DOMContentLoaded", function() {
    const animalList = document.getElementById("animal-list");
    const animalDetails = document.getElementById("animal-details");
    // Retrieve animal data from server
    async function getAnimals() {
      const response = await fetch("http://localhost:3000/characters");
      const animals = await response.json();
      return animals;
    }

    
    // Render list of animal names
    async function renderAnimalList() {
      const animals = await getAnimals();
      animalList.innerHTML = "";
      animals.forEach(animal => {
        const li = document.createElement("li");
        li.textContent = animal.name;
        li.addEventListener("click", () => renderAnimalDetails(animal));
        animalList.appendChild(li);
      });
    }

    // Render details of selected animal
    function renderAnimalDetails(animal) {
      animalDetails.innerHTML = `
        <h2>${animal.name}</h2>
        <img src="${animal.image}" alt="${animal.name}" width="300">
        <p>Votes: <span id="votes">${animal.votes}</span></p>
        <button id="vote-btn">Vote</button>
        <button id="reset-btn">Reset</button>
      `;
      const voteBtn = document.getElementById("vote-btn");
      const resetBtn = document.getElementById("reset-btn");
      voteBtn.addEventListener("click", () => updateVotes(animal.id));
      resetBtn.addEventListener("click", () => resetVotes(animal.id));
    }

    // Update number of votes for selected animal
    async function updateVotes(animalId) {
      const votesElem = document.getElementById("votes");
      const response = await fetch(`http://localhost:3000/characters/${animalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ votes: parseInt(votesElem.textContent) + 1 })
      });
      const updatedAnimal = await response.json();
      votesElem.textContent = updatedAnimal.votes;
    }
    // Reset votes for selected animal
    async function resetVotes(animalId) {
      const votesElem = document.getElementById("votes");
      const response = await fetch(`http://localhost:3000/characters/${animalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ votes: 0 })
      });

      const updatedAnimal = await response.json();
      votesElem.textContent = updatedAnimal.votes;
    }

    // Initialize app
    renderAnimalList();
  });