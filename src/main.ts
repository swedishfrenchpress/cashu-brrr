import "@fontsource/ultra/latin-400.css";
import "@fontsource/libre-franklin/latin-400.css";
import "@fontsource/libre-franklin/latin-ext-400.css";
import "@fontsource/libre-franklin/latin-700.css";
import "@fontsource/libre-franklin/latin-ext-700.css";
import "@fontsource/dela-gothic-one/latin-400.css";
import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
