import { Modalblanc } from "../dist/module.js";

const app = document.getElementById("app");
const modal = new Modalblanc();
const h1 = document.createElement("h1");
const openModalButton = document.createElement("button");

h1.innerText = "Demo page";

openModalButton.innerText = "Open modal";
openModalButton.addEventListener("click", () => modal.open());

app?.appendChild(h1);
app?.appendChild(openModalButton);
