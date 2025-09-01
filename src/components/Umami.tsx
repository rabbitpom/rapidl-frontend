import UmamiLogger from "./UmamiLogger";

const Umami = UmamiLogger.getInstance();
Umami.initialize({
  websiteId: "ff4b2b9c-52f8-4387-9f41-514abf4ddf25",
});

export default Umami;
