

export function generateUI_ActiveTickets( parentContainer, arrayOfTickets, callback) {

  /*
  arrayOfTickets = [
    {
      "ID": "d4797470-e1a0-4849-8217-7cb8b4d60cdc",
      "data": {
        "des": "nga but"
      },
      "ownerID": "393a15cc-3031-70de-5d9e-3ecb604a7f50",
      "timestamp": "2026-05-16T20:08:14.783Z"
    },
    {...},
    ...
  ]
  */
  const freepikLogoTransparent = import.meta.url + "/../.././images/Freepik ticket transparent.png";
  const callbackReference = callback;
  for (const ticketData of arrayOfTickets) {


    const card = document.createElement("li");
    card.classList.add("container-ticket");
  
  
    // logo
    const logoElement = document.createElement("img");
    logoElement.src = freepikLogoTransparent;
    logoElement.alt = "transparent logo";
    card.appendChild(logoElement);

    // title
    const titleElement = document.createElement("div");
    titleElement.textContent = ticketData.data.ti;
    titleElement.classList.add("primary");
    titleElement.style.zIndex = 5;
    card.appendChild(titleElement);
  
    // border
    const borderElement = document.createElement("div");
    borderElement.classList.add("border");
    borderElement.style.left = "calc(80% - 60px)";
    titleElement.style.zIndex = 5;
    card.appendChild(borderElement);

    // date added
    const dateElement = document.createElement("div");
    dateElement.textContent = ticketData.timestamp.split("T")[0];
    dateElement.classList.add("secondary");
    dateElement.style.zIndex = 5;
    card.appendChild(dateElement);

    // the actual button
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("container-fit-to-container");
    buttonElement.style.cursor = "pointer";
    buttonElement.style.zIndex = 10;
    buttonElement.addEventListener("click", () => {
      callbackReference(card, ticketData)
    });
    card.appendChild(buttonElement);


  
    parentContainer.appendChild(card);
  }
}