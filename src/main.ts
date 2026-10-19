import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/martian-mono/latin-400.css";
import "@fontsource/martian-mono/latin-600.css";
import "@fontsource/dela-gothic-one/latin-400.css";
import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
