

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


function buildPromptBase() {
  // background
  const Background = document.createElement("div");
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

let isPromptedToTitleAndDescription = false;
export function prompt_RetrieveNewTitleAndDescription(currentTitle, currentDescription, callback) {
  if (isPromptedToTitleAndDescription) {
    console.log("you have an ongoing prompt to type in a new title and description already!");
    return;
  }
  isPromptedToTitleAndDescription = true;

  const parentContainer = document.querySelector(".container-fit-to-screen");
  const { Background, Title, Content, ButtonContainer, leftButton, rightButton } = buildPromptBase();
  Title.textContent = "Enter a new title and description"


  // title prompt
  const inputTitle = document.createElement("input");
  inputTitle.classList.add("prompttitle");
  inputTitle.type = "text";
  inputTitle.name = "newtitle";
  inputTitle.placeholder = "Title";
  Content.appendChild(inputTitle);

  // description prompt
  const inputDescription = document.createElement("textarea");
  inputDescription.classList.add("prompdescription");
  inputDescription.name = "newdescription";
  Content.appendChild(inputDescription);

  leftButton.textContent = "Cancel"
  leftButton.addEventListener("click", async () => {
    callback(false, "", "");
    isPromptedToTitleAndDescription = false;
    Background.remove()
  });

  rightButton.textContent = "Submit"
  rightButton.addEventListener("click", async () => {
    callback(true, inputTitle.value, inputDescription.value);
    isPromptedToTitleAndDescription = false;
    Background.remove()
  });

  parentContainer.appendChild(Background);
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