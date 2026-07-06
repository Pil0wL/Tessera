

import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/+esm';

export function generateUI_ActiveTickets(parentContainer, arrayOfTickets, callback) {

  /*
  arrayOfTickets = [
    {
      "ID": "d4797470-e1a0-4849-8217-7cb8b4d60cdc",
      "data": {
        "des": "nga but",
        "ti": "yeah"
      },
      "category": 0,
      "ownerID": "393a15cc-3031-70de-5d9e-3ecb604a7f50",
      "timestamp": "2026-05-16T20:08:14.783Z"
    },
    {...},
    ...
  ]
  */
  const freepikLogoTransparent = import.meta.url + "/../.././images/Freepik ticket transparent.png";
  const callbackReference = callback;

  const toReturn = [];
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
    toReturn.push({
      data: ticketData,
      element: card
    })
  }

  return toReturn;
}

export function generateUI_UserListElement(parentContainer, arrayOfUsers, callback) {

  /*
  arrayOfUsers = [
    {
      "ID": UUID,
      "activeTickets": [
        {
        "ID": UUID,
        "org": "Tessera-Organization-Tickets.Pecunia"
        }
      ],
      "createdAt": Timestamp,
      "currentStatus": number,
      "email": String,
      "Statistics": {
        "CategoryDistribution": {
          "Human Resource": 0,
          "Network": 0,
          "Technical": 0
        },
        "Logins": {Timestamp: true},
        "ResponseTime": {
          "<12hour": 0,
          "<30min": 0,
          "<4hour": 0,
          ">Day": 0,
          ">Week": 0
        },
        "SatistfactionDistribution": [ 0, 0, 0, 0, 0 ]
      },
      "StatisticsSubmittedTickets": 0,
      "ticketHistory": []
    },
    {...},
    ...
  ]
  */


  while (parentContainer.firstChild) { // replaceChildren() but this is more tuff
    parentContainer.removeChild(parentContainer.lastChild);
  }

  const freepikLogoTransparent = import.meta.url + "/../.././images/Freepik user profile transparent.png";
  const callbackReference = callback;

  const toReturn = [];
  for (const userData of arrayOfUsers) {


    const card = document.createElement("li");
    card.classList.add("container-user-list-element");


    // logo
    const logoElement = document.createElement("img");
    logoElement.src = freepikLogoTransparent;
    logoElement.alt = "transparent logo";
    card.appendChild(logoElement);

    // title
    const titleElement = document.createElement("div");
    titleElement.textContent = userData.email;
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
    dateElement.textContent = userData.createdAt.split("T")[0];
    dateElement.classList.add("secondary");
    dateElement.style.zIndex = 5;
    card.appendChild(dateElement);

    // the actual button
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("container-fit-to-container");
    buttonElement.style.cursor = "pointer";
    buttonElement.style.zIndex = 10;
    buttonElement.addEventListener("click", () => {
      callbackReference(card, userData)
    });
    card.appendChild(buttonElement);



    parentContainer.appendChild(card);
    toReturn.push({
      data: userData,
      element: card
    })
  }

  return toReturn;
}

let currentZIndex = 1000;
function buildPromptBase() {
  currentZIndex = currentZIndex + 1;
  // background
  const Background = document.createElement("div");
  Background.zIndex = currentZIndex;
  Background.classList.add("container-prompt");

  // header title
  const Title = document.createElement("div");
  Title.classList.add("headertitle");
  Background.appendChild(Title);

  // maincontent
  const Content = document.createElement("div");
  Content.classList.add("maincontent");
  Background.appendChild(Content);

  // buttons
  const ButtonContainer = document.createElement("div");
  ButtonContainer.classList.add("buttoncontainer");
  Background.appendChild(ButtonContainer);

  // left
  const leftButton = document.createElement("button");
  leftButton.classList.add("left");
  leftButton.style.cursor = "pointer";
  ButtonContainer.appendChild(leftButton);

  // right
  const rightButton = document.createElement("button");
  rightButton.classList.add("right");
  rightButton.style.cursor = "pointer";
  ButtonContainer.appendChild(rightButton);

  return {
    Background: Background,
    Title: Title,
    Content: Content,
    ButtonContainer: ButtonContainer,
    leftButton: leftButton,
    rightButton: rightButton
  }
}

let isPromptedToInput = false;
export function prompt_RetrieveNewTitleAndDescription(ticketData, callback) {
  if (isPromptedToInput) {
    console.log("you have an ongoing prompt to type in a new title and description already!");
    return;
  }
  isPromptedToInput = true;

  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();
  Title.textContent = "Enter a new title and description";


  // title prompt
  const inputTitle = document.createElement("input");
  inputTitle.classList.add("prompttitle");
  inputTitle.type = "text";
  inputTitle.name = "newtitle";
  inputTitle.placeholder = "Title";
  inputTitle.value = ticketData.data.ti;
  Content.appendChild(inputTitle);

  // description prompt
  const inputDescription = document.createElement("textarea");
  inputDescription.classList.add("prompdescription", "text-with-many-words");
  inputDescription.name = "newdescription";
  inputDescription.value = ticketData.data.des;
  Content.appendChild(inputDescription);

  let proceeding = false;
  const proceedCallback = async (success, newTitle, newDescription) => {
    if (proceeding) return;
    proceeding = true
    try {
      await callback(success, newTitle, newDescription);
    } catch (e) {
      console.log("prompt_RetrieveNewTitleAndDescription callback error:", e)
    }

    Background.remove();
    isPromptedToInput = false;
  };

  leftButton.textContent = "Cancel"
  leftButton.addEventListener("click", async () => {
    await proceedCallback(false, "", "");
  });

  rightButton.textContent = "Submit"
  rightButton.addEventListener("click", async () => {
    await proceedCallback(true, inputTitle.value, inputDescription.value);
  });

  parentContainer.appendChild(Background);
}


export async function display_Progress(titleText, callback) {
  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  Content.appendChild(spinner);

  Title.textContent = titleText
  leftButton.remove();

  rightButton.textContent = "Confirm";
  rightButton.style.display = "none";

  parentContainer.appendChild(Background);

  var success = true;
  try {
    await callback();
    Content.classList.add("center-items");
    Content.textContent = "Success!";
  } catch (e) {
    Content.classList.add("text-with-many-words");
    Content.textContent = "Error: " + e;
    console.error("Error:", e);
    success = false;
  }
  spinner.remove();
  Title.remove();

  rightButton.style.display = "block";
  rightButton.addEventListener("click", async () => {
    Background.remove();
  });

  return success;
}
export function prompt_Confirmation(titleText, callback) {
  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();

  Title.textContent = titleText

  rightButton.textContent = "Confirm";
  rightButton.addEventListener("click", async () => {
    Background.remove();
    callback(true);
  });

  leftButton.textContent = "Cancel";
  leftButton.addEventListener("click", async () => {
    Background.remove();
    callback(false);
  });


  parentContainer.appendChild(Background);
}
export function prompt_Message(titleText, description, callback) {
  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();

  Title.textContent = titleText

  rightButton.textContent = "Confirm";
  rightButton.addEventListener("click", async () => {
    Background.remove();
    callback();
  });

  Content.textContent = description;

  leftButton.remove();


  parentContainer.appendChild(Background);
}


export function officiate_dropdown(prefix, targetDropdownElement, callback) {

  const content = targetDropdownElement.querySelector(".container-dropdown-content");

  let toggled = false;
  const toggler = (event) => {
    const clickedInsideContent = content.contains(event.target);
    if (clickedInsideContent) return;

    toggled = !toggled;
    content.style.display = toggled ? "flex" : "none";
  };
  content.style.display = "none";

  targetDropdownElement.addEventListener("click", toggler);


  const buttons = targetDropdownElement.querySelectorAll("button");
  const dropdownTextDisplay = targetDropdownElement.querySelector("p");

  for (let i = 0; i < buttons.length; i++) {
    const childButton = buttons[i];

    childButton.addEventListener("click", () => {
      const thisText = childButton.textContent

      dropdownTextDisplay.textContent = prefix + thisText;

      toggled = false;
      content.style.display = "none";

      callback(i);
    });
  }

  buttons[0].click();
}

const sortingLambdas = [
  (a, b) => { return a.data.timestamp.localeCompare(b.data.timestamp); },
  (a, b) => { return b.data.timestamp.localeCompare(a.data.timestamp); },
  (a, b) => { return a.data.data.ti.localeCompare(b.data.data.ti); },
  (a, b) => { return b.data.data.ti.localeCompare(a.data.data.ti); }
]
export function filter_givenTickets(generatedTickets, filterInfo) {
  /*
  generatedTickets = [
    {
      data = ticketData,
      element = html element
    },
    {...},
    ...
  ]
  */

  /*
  arrayOfTickets = [
    {
      "ID": "d4797470-e1a0-4849-8217-7cb8b4d60cdc",
      "data": {
        "des": "nga but",
        "ti": "yeah"
      },
      "category": 0,
      "ownerID": "393a15cc-3031-70de-5d9e-3ecb604a7f50",
      "timestamp": "2026-05-16T20:08:14.783Z"
    },
    {...},
    ...
  ]
  */
  /*
  filterInfo = {
    sortBy = 0, // defaults to zero
    searchString = "..."
  }
  */
  const maxSize = generatedTickets.length;
  if (!maxSize) return;

  filterInfo.sortBy = filterInfo.hasOwnProperty("sortBy") ? filterInfo.sortBy : 0;
  generatedTickets.sort(sortingLambdas[filterInfo.sortBy]);

  const parentContainer = generatedTickets[0].element.parentElement;

  const searchString = filterInfo.hasOwnProperty("searchString") ? filterInfo.searchString.toLowerCase() : "";
  for (const indexData of generatedTickets) {
    const thisElement = indexData.element;

    parentContainer.appendChild(thisElement);
    if (indexData.data.data.ti.toLowerCase().includes(searchString)) {
      thisElement.style.display = "block";
    } else {
      thisElement.style.display = "none";
    }
  }
}
export function displayTicketDescription(container, ticketData) {

  const categoryConverter = [
    "Technical",
    "Network",
    "Human Resource"
  ];

  const buildingString = [`Title: ${ticketData.data.ti}
    \n\nDescription: ${ticketData.data.des}
    \n\nCategory: ${categoryConverter[ticketData.category]}
    \n\nDate: ${ticketData.timestamp.split("T")[0]}`];

  if (ticketData.notes) {
    buildingString.push(`\n\nNotes:\n"${ticketData.notes.join("\"\n\n\"")}"`)
  }
  container.textContent = buildingString.join("");
}


export function prompt_RetrieveNewString(title, callback) {
  if (isPromptedToInput) {
    console.log("you have an ongoing prompt!");
    return;
  }
  isPromptedToInput = true;

  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();
  Title.textContent = title;

  // description prompt
  const inputDescription = document.createElement("textarea");
  inputDescription.classList.add("prompdescription", "text-with-many-words");
  inputDescription.name = "newdescription";
  inputDescription.value = "your comment here";
  Content.appendChild(inputDescription);

  let proceeding = false;
  const proceedCallback = async (success, newString) => {
    if (proceeding) return;
    proceeding = true
    try {
      await callback(success, newString);
    } catch (e) {
      console.log("prompt_RetrieveNewTitleAndDescription callback error:", e)
    }

    Background.remove();
    isPromptedToInput = false;
  };

  leftButton.textContent = "Cancel"
  leftButton.addEventListener("click", async () => {
    await proceedCallback(false, "");
  });

  rightButton.textContent = "Submit"
  rightButton.addEventListener("click", async () => {
    await proceedCallback(true, inputDescription.value);
  });

  parentContainer.appendChild(Background);
}


export function prompt_RetrieveNewInteger(title, callback) {
  prompt_RetrieveNewString(title, async (success, newString) => {
    if (!success) {
      await callback(false, 0);
      return;
    }
    if (
      (typeof newString !== 'string' || newString.trim() === "")
      || !Number.isInteger(Number(newString))
    ) {
      prompt_Message("Error", "Invalid Integer", () => { });
      await callback(false, 0);
      return;
    }



    await callback(true, Number(newString));
  });
}


export function formatDate(timestamp) {

  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const monthShort = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });

  return `${year}-${monthShort}-${day}, ${hours}:${minutes} UTC`;
}


export function officiate_chart(target_container, options, refresh_callback) {



  options.chart.toolbar = {
    show: false
  };

  if (options.tooltip) {
    options.tooltip.theme = "dark";
  } else {
    options.tooltip = {
      theme: "dark"
    }
  }



  let main_chart_place;
  {
    const created = document.createElement("div");
    created.classList.add("containerchild");
    target_container.appendChild(created);

    main_chart_place = created;
  }

  let button_refresh;
  {
    const created = document.createElement("div");
    created.classList.add("chartrefresh");
    target_container.appendChild(created);

    const created_button = document.createElement("button");
    created_button.classList.add("container-fit-to-container");

    const created_image = document.createElement("img");
    created_image.classList.add("parent-height-ratio-1-1");
    created_image.src = "../.././images/Freepik reload.png";
    created_image.alt = "reload icon";

    created_button.appendChild(created_image)
    created.appendChild(created_button);
    target_container.appendChild(created);

    button_refresh = created_button
  }


  let containerbuttons;
  {
    const created = document.createElement("div");
    created.classList.add("containerbuttons");
    target_container.appendChild(created);

    containerbuttons = created;
  }

  { // border
    const created = document.createElement("div");
    created.classList.add("border");
    target_container.appendChild(created);
  }


  const chart = new ApexCharts(main_chart_place, options);

  let refresh_debounce = false;
  async function refresh() {
    if (refresh_debounce) return;
    refresh_debounce = true;
    while (main_chart_place.firstChild) { // replaceChildren() but this is more tuff
      main_chart_place.removeChild(main_chart_place.lastChild);
    }

    try {
      await refresh_callback();
    } catch (error) {
      console.error(target_container, " | refresh error | ", error.message);
    }
    refresh_debounce = false;
    chart.render();
  }
  button_refresh.addEventListener("click", refresh);

  { // button downloads // from https://apexcharts.com/docs/export-chart-image/
    function getButton() {
      // the actual button
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button-style2");
      buttonElement.style.position = "relative";

      return buttonElement
    }
    { // png
      const retrievedButton = getButton();
      retrievedButton.addEventListener("click", async () => {
        const { imgURI } = await chart.dataURI();
        const link = document.createElement("a");
        link.href = imgURI;
        link.download = "my-chart.png";
        link.click();

      });
      retrievedButton.textContent = "Download as PNG";
      containerbuttons.appendChild(retrievedButton);
    }
    { // svg
      const retrievedButton = getButton();
      retrievedButton.addEventListener("click", async () => {
        const svgString = await chart.getSvgString();
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const blobURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "my-chart.svg";
        link.click();

        URL.revokeObjectURL(blobURL);

      });
      retrievedButton.textContent = "Download as SVG";
      containerbuttons.appendChild(retrievedButton);
    }
    { // csv
      const retrievedButton = getButton();
      retrievedButton.addEventListener("click", async () => {
        chart.exportToCSV({
          fileName: "my-chart-data"
        });
      });
      retrievedButton.textContent = "Download as CSV";
      containerbuttons.appendChild(retrievedButton);
    }
  }

  button_refresh.click();

  return chart
}
//// Starting number
//let timeLeft = 10;
//
//// Update the countdown every 1 second
//const countdown = setInterval(function() {
//  timeLeft--; // Subtract 1
//
//  // Show the new number in the HTML
//  document.getElementById("timer").textContent = timeLeft;
//
//  // Check if we reached zero
//  if (timeLeft <= 0) {
//      clearInterval(countdown); // This stops the timer
//      doSomethingNext();        // Call your next function
//  }
//}, 1000);
//
//// The "something" you want to do after
//function doSomethingNext() {
//  document.getElementById("message").textContent = "Time's up! 🚀";
//  alert("Countdown finished!");
//}